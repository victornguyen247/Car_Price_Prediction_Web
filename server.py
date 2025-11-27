import socket
import joblib as jb
import time
import threading
import json
import numpy as np
import os
from datetime import datetime
import warnings
import pandas as pd
from catboost import CatBoostRegressor
from sklearn.preprocessing import TargetEncoder, OrdinalEncoder

warnings.filterwarnings("ignore", message="X does not have valid feature names")

# path of neccessary files
script_dir = os.path.dirname(os.path.abspath(__file__))

# rate limiting dictionary :{ip: last request time}
rate_limit_tracker = {}
rate_limit_per_second = 1

# load predict model and encoder
try: 
    path = './model_n_encoder'
    model = jb.load(path + '/best_model.pkl')
    print('model loaded successfully!')
    category_encoder = jb.load(path + '/category_encoder.pkl')
    color_encoder = jb.load(path + '/color_encoder.pkl')
    fuel_encoder = jb.load(path + '/fuel_encoder.pkl')
    gear_box_encoder = jb.load(path + '/gear_box_encoder.pkl')
    drive_wheel_encoder = jb.load(path + '/drive_wheel_encoder.pkl')
    manufacturer_encoder = jb.load(path + '/manufacturer_encoder.pkl')
    model_encoder = jb.load(path + '/model_encoder.pkl')
    city_encoder = jb.load(path + '/city_encoder.pkl')
    state_encoder = jb.load(path + '/state_encoder.pkl')
    print('Load encoders successfull!')
except Exception as e:
    model = None
    print(f'Error loading:{e}')
        

def preprocessing_input(data):
    """ preprocessing the input data before prediction """
    global category_encoder, color_encoder, fuel_encoder, gear_box_encoder
    global drive_wheel_encoder, manufacturer_encoder, model_encoder
    global city_encoder, state_encoder

    data['Manufacturer'] = manufacturer_encoder.transform([[data['Manufacturer']]])[0][0]
    data['Model'] = model_encoder.transform([[data['Model']]])[0][0]
    data['Category'] = category_encoder.transform([[data['Category']]])[0][0]
    data['Leather interior'] = 1 if data['Leather interior'] else 0
    data['Fuel type'] = fuel_encoder.transform([[data['Fuel type']]])[0][0]
    data['Gear box type'] = gear_box_encoder.transform([[data['Gear box type']]])[0][0]
    data['Drive wheels'] = drive_wheel_encoder.transform([[data['Drive wheels']]])[0][0]
    data['Wheel'] = 0 if data['Wheel'] == 'Left wheel' else 1
    data['Color'] = color_encoder.transform([[data['Color'].lower().capitalize() ]])[0][0]
    data['City'] = city_encoder.transform([[data['City']]])[0][0]
    data['State'] = state_encoder.transform([[data['State']]])[0][0]
    data['Age'] = datetime.now().year - data['Prod. year']
    data['Mileage_per_year'] = data['Mileage'] / (data['Age'] + 1)
    
    order = ['Manufacturer','Model','Category','Leather interior','Fuel type','Engine volume',
             'Mileage','Cylinders','Gear box type','Drive wheels','Wheel','Color','Airbags',
             'City','State','Turbo','Age','Mileage_per_year']

    data_preprocessed = pd.DataFrame([[data[col] for col in order]], columns=order)
    return data_preprocessed

def make_prediction(data_preprocessed):
    """function predicts car's price"""
    global model
    price = model.predict(data_preprocessed)[0]
    return {'price': round(float(price),1), 'status': 'successfull'}

def check_rate_limit(client_ip):
    """ check if client's requestions has exceeded rate limit """
    current_time = time.time()
    if client_ip in rate_limit_tracker:
        time_elapsed = current_time - rate_limit_tracker[client_ip]
        if (time_elapsed < rate_limit_per_second):
            return False
    rate_limit_tracker[client_ip] = current_time
    return True      

def parse_http_request(request_data):
    """ Parse http request to extract method, path, header and body"""
    try:
        request_lines = request_data.split(b'\r\n')
        request_first_line = request_lines[0].decode('utf-8')
        method, path,_ = request_first_line.split(' ')

        # find the body (after blank line)
        body_start = request_data.find(b'\r\n\r\n') +4
        body = request_data[body_start:].decode('utf-8')

        return method, path, body
    except Exception as e:
        print(f'Error parsing request:{e}')
        return None, None, None

def create_http_response(code_no, content_type, body):
    """ create HTTP response"""
    status_messenger = {
        200: 'OK',
        400: 'Bab Request',
        404: 'Not Found',
        429: 'Too Many Request',
        500: 'Internal Server Error'
    }
    status_messenger = status_messenger.get(code_no, 'Unknown')
    response = f'HTTP/1.1 {code_no} {status_messenger} \r\n'
    response += f'Content-Type: {content_type}\r\n'
    response += 'Connection: close\r\n'
    response += 'Access-Control-Allow-Origin: *\r\n'
    response += '\r\n'
    response += body

    return response.encode('utf-8')

def get_content_type(file_name):
    """ get content of file based on file extension"""
    extension = file_name.lower().split('.')[-1]
    content_style ={
        'html': 'text/html',
        'css': 'text/css',
        'js': 'application/javascript',
        'json': 'application/json',
        'png': 'image/png',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'gif': 'image/gif',
        'svg': 'image/svg+xml',
        'ico': 'image/x-icon',
        'webp': 'image/webp'
    }
    return content_style.get(extension, 'application/octet-stream')

def handle_client(client_socket, client_address):
    """ Funtion handle individual client connection """
    try: 
        # receive connection
        request_data = client_socket.recv(4096)

        if not request_data: 
            return

        method, path, body = parse_http_request(request_data)

        if method == None:
            response = create_http_response(400, 'text/plain', 'Bad Request')
            client_socket.send(response)

        client_ip = client_address[0] # [ip_address, port_number]

        # handle GET request for index.html 
        if (method == 'GET' and path == '/'):
            try:
                html_path = os.path.join(script_dir, 'index.html')
                with open(html_path, 'r', encoding='utf-8') as f:
                    html_content = f.read()
                response = create_http_response(200, 'text/html', html_content)
                client_socket.send(response)

                # save request time into rate_limit_tracker
                request_time = time.time()
                with lock:
                    if rate_limit_tracker.get(client_ip) == None:
                        rate_limit_tracker[client_ip] = request_time
            except FileNotFoundError:
                print('Error found html file.')
                response = create_http_response(404, 'text/plain', 'html file not found')
                client_socket.send(response)
                
        # handle GET request for static file (eg css, js, image,etc)
        elif (method == 'GET' and path != '/api/predict'):
            file_path = path.lstrip('/')
            full_path = os.path.join(script_dir, file_path)

            try: 
                with open(full_path,'rb') as f:
                    file_content = f.read()
            except FileNotFoundError:
                response = create_http_response(404, 'text/plain', f'file {file_path} not found')
                client_socket.send(response)

            content_type = get_content_type(file_path)
            response = create_http_response(200, content_type, '')
            response += file_content
            client_socket.send(response)
        
        # handle POST request for prediction
        elif (method == 'POST' and path == '/api/predict'):
            # check rate limit
            if (not check_rate_limit(client_ip)):
                error_response = json.dumps({
                    'error': 'Rate limit exceeded. Please wait a sencond between request.',
                    'status': 'rate_limit_exceeded'
                    })
                response = create_http_response(429, 'application/json', error_response)
                client_socket.send(response)
                return
            # parse JSON body
            try:
                data = json.loads(body) if body else {}
                try: 
                    data_preprocessed = preprocessing_input(data)
                    result = make_prediction(data_preprocessed) 
                except Exception as e:
                    print(f'Error predict price:{e}')

                response_body = json.dumps(result)
                response = create_http_response(200, 'application/json', response_body)
                client_socket.send(response)
                print(f"Sending result to client ip:[{client_ip}].")
            except json.JSONDecodeError:
                error_response = json.dumps({'error':'Invalid JSON','status': 'Error'})
                response = create_http_response(400, 'application/json', error_response)
                client_socket.send(response)
        
        # handle unknown path
        else:
            response = create_http_response(404, 'text/plain', 'Not Found')
            client_socket.send(response)

    except Exception as e:
        print(f'Error handling client:{e}')
        try:
            error_response = json.dumps({'error':str(e), 'status': 'error'})
            response = create_http_response(500,'application/json', error_response)
            client_socket.send(response)
        except: pass
    finally: 
        client_socket.close()


if __name__ == '__main__':
    # server address
    host = '127.0.0.1'
    port = 4390
    lock = threading.Lock()

    try:
        # declare socket and blind ip and host into socket
        server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM) # ipv4 and TCP protocol
        server_socket.bind((host,port))

        server_socket.listen(5) # limit at most 5 connections

        print(f"\n{'='*60}")
        print(f"Car Price Estimator Server Started")
        print(f"Server running on: http://{host}:{port}")
        print(f"Rate limit: 1 request per second per IP")
        print(f"Press Ctrl+C to stop the server")
        print(f"{'='*60}\n")

        # Prevent accept() from blocking forever
        server_socket.settimeout(1)   # 1 second timeout

        while True:
            try:
                client_socket, client_address = server_socket.accept()
                threading.Thread(target=handle_client, args=(client_socket, client_address), daemon= True).start()
            except socket.timeout:
                continue
            
    except KeyboardInterrupt:
        print('\n...Server is shutting down...')
    finally:
        server_socket.close()
        print('Server stop.')




