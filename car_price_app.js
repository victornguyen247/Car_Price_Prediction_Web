const carModels = {
    Lexus: ['RX 450', 'RX 350', 'RX 400', 'GX 470', 'GX 460', 'NX 300', 'CT 200h', 'GS 350', 'NX 200', 'RX 300', 'ES 350', 'IS 200', 'ES 300', 'IS 250', 'LS 460', 'IS 350', 'HS 250h', 'LX 570', 'RC F'],
    Chevrolet: ['Equinox', 'Cruze LT', 'Captiva', 'Cruze', 'Orlando', 'Volt', 'Malibu', 'Lacetti', 'Aveo', 'Matiz', 'Spark', 'Impala', 'Camaro', 'Traverse', '1500', 'Cruze RS', 'Sonic', 'Malibu LT', 'Silverado', 'Trax'],
    Honda: ['FIT', 'Civic', 'Cr-v', 'Insight', 'Stream', 'Shuttle', 'Element', 'Odyssey', 'Insight EX', 'Hr-v', 'Accord', 'Inspire', 'Fred', 'Pilot', 'Elysion', 'CR-Z', 'Step Wagon'],
    Ford: ['Escape', 'Transit', 'Fusion', 'Mustang', 'Focus SE', 'Explorer', 'C-MAX', 'Taurus', 'Fiesta', 'Focus', 'Fusion TITANIUM', 'Transit Connect', 'Tourneo Connect', 'Edge', 'Mondeo', 'Escort', 'Expedition', 'Focus TITANIUM', 'F150', 'KA', 'C-MAX SEL', 'Fusion SE', 'Escape SE', 'Focus Titanium', 'Focus se'],
    Hyundai: ['Santa FE', 'Sonata', 'Elantra', 'H1', 'Tucson', 'Genesis', 'I30', 'Veloster', 'Sonata SPORT', 'Elantra SE', 'Accent', 'Grandeur', 'IX35', 'Elantra limited', 'Sonata hybrid', 'Elantra LIMITED', 'Elantra GT', 'Getz', 'Elantra Limited', 'Azera', 'Sonata Hybrid', 'Sonata Limited', 'Tucson SE'],
    Toyota: ['Prius', 'Camry', 'CHR', 'Highlander', 'Tacoma', 'Prius C', 'Aqua', 'VOXY', 'Vitz', 'Yaris', 'RAV 4', 'Sienna', 'Camry Se', 'Sienta', 'Avalon LIMITED', 'Ist', 'Corolla', 'Tundra', 'Avalon', 'Camry SE', 'Aqua S', 'Land Cruiser Prado', 'Ipsum', 'Prius V', 'Passo', 'ISIS', 'Camry se', 'Corolla LE', 'Alphard', 'Camry XLE', 'Venza', 'Corolla S', 'Altezza', 'Estima', 'Camry SPORT', 'Hilux', 'Camry sport', 'Land Cruiser', 'Aqua s', 'Camry HYBRID', 'Camry LE', 'Wish', 'Vitz RS', 'Century', 'Fun Cargo', '4Runner', 'Camry Hybrid', 'Highlander LIMITED', 'Celica'],
    MercedesBenz: ['E 350', 'E 220', 'Vito', 'E 300', 'C 180', 'GLA 250', 'A 160', 'ML 350', 'E 320', 'Sprinter', 'C 220', 'A 170', 'C 250', 'Vaneo', 'CLS 550', 'C 300', 'C 350', 'CLS 500', 'S 350', 'C 200', 'CLK 320', 'ML 250', 'E 200', 'GLE 350', 'E 250', 'GLC 300', 'C 240', 'E 240', 'E 270', 'A 190', 'SLK 230', 'E 230', 'GL 320', 'S 550', 'E 500', 'CLS 350', 'CLA 250', 'GL 550', 'Smart', 'A 140', 'E 280', 'GL 450', 'B 170', 'CLS 55 AMG', 'Viano', 'CLK 200', 'E 550', '230', 'C 280', 'E 430', 'R 350', 'ML 350 4 MATIC', 'C 230', 'S 500', '320', 'GLE 63 AMG', 'S 63 AMG', 'ML 500', 'G 55 AMG', 'ML 270', '200', 'ML 320', 'E 350 AMG', 'S 320', 'C 320', 'GL 350', '300', 'CLK 230', '270', 'GLC 300 GLC coupe', 'G 550', 'GLK 350', '190', 'E 400', 'S 430', '220', 'Sprinter 313', 'Sprinter 516'],
    Porsche: ['Cayenne', '911', 'Panamera'],
    Bmw: ['X5', '535', '328', '325', '530', '330', '318', '750', 'X6', '520', '525', 'M6', '320', 'M3', '335', 'X5 M', '435', '428', 'X5 3.5', '528', '740', '650', '550', '535 i', '316', 'X3', 'X1', '545', '225', 'M5', '328 i', '745', 'X4', '323', 'X5 E70'],
    Jeep: ['Grand Cherokee', 'Wrangler', 'Compass', 'Cherokee', 'Liberty', 'Renegade', 'Patriot'],
    Volkswagen: ['Jetta', 'Passat', 'Golf', 'Sharan', 'GTI', 'Golf 4', 'Vento', 'Polo', 'Crafter', 'Tiguan', 'UP', 'Touareg', 'Golf TDI', 'Caddy', 'CC', 'Passat SE', 'Touran', 'Scirocco', 'Jetta TDI', 'Golf 3', 'Jetta se', 'Jetta SE'],
    Audi: ['Q7', 'Q5', 'A6', 'A7', 'A4', 'Q3', 'A5', 'A8', 'Allroad', 'A3'],
    Nissan: ['Juke', 'Patrol', 'Serena', 'Maxima', 'Pathfinder', 'Altima', 'Rogue', 'Tiida', 'Elgrand', 'X-Trail', 'Teana', 'March', 'X-Terra', 'Frontier', 'Versa', 'Note', 'Sentra', 'Fuga', 'Micra', 'Murano', 'Skyline', 'Vanette', 'Quest', 'Presage', 'Navara'],
    Subaru: ['Forester', 'Legacy', 'Outback', 'XV', 'Impreza', 'Crosstrek'],
    Kia: ['Picanto', 'Optima', 'RIO', 'SOUL', 'Sorento', 'Sportage', 'Carnival', 'Ceed', 'Cadenza', 'Cerato', 'Avella', 'Forte', 'Niro', 'Optima HYBRID'],
    Mitsubishi: ['Airtrek', 'Lancer', 'Pajero', 'Delica', 'Outlander', 'Colt', 'Pajero IO', 'L 200', 'Montero', 'Minica', 'Mirage', 'Grandis', 'Outlander SPORT', 'Outlander Sport', 'Outlander sport', 'Carisma'],
    Mazda: ['616', '1000', 'CX-7', 'MPV', '323', 'Mazda 3', 'CX-9', '1300', 'Atenza', 'Demio', 'CX-5', 'Mazda 6', 'Demio evropuli', 'Eunos 500', 'Verisa'],
    Gmc: ['TERRAIN', 'Acadia'],
    Fiat: ['500', '500 Abarth', '500 Sport', 'Panda', '500L'],
    Lincoln: ['Navigator', 'Town Car', 'MKZ'],
    LandRover: ['Discovery', 'Freelander', 'Range Rover', 'Land Rover Sport', 'Range Rover Evoque'],
    Mini: ['Cooper', 'Countryman', 'Countryman S', 'Cooper S Cabrio'],
    Dodge: ['Challenger', 'Journey', 'RAM', 'Avenger', 'Durango', 'Caliber', 'Ramcharger', 'Caravan', 'Dart', 'Neon'],
    Chrysler: ['200', 'PT Cruiser', 'Town and Country', '300'],
    Jaguar: ['XF', 'F-pace', 'E-pace'],
    Buick: ['Century', 'Encore'],
    Acura: ['RDX', 'TSX', 'MDX'],
    Infiniti: ['FX35', 'EX37', 'G37'],
    Cadillac: ['CTS', 'SRX', 'ATS'],
    Volvo: ['XC90', 'S60'],
    Hummer: ['H3', 'H2']
};

// Get DOM elements
const makeSelect = document.getElementById('make');
const modelSelect = document.getElementById('model');
const form = document.getElementById('carForm');
const submitBtn = document.getElementById('submitBtn');
const resultArea = document.getElementById('resultArea');
const loadingSpinner = document.getElementById('loadingSpinner');
const priceResult = document.getElementById('priceResult');
const priceValue = document.getElementById('priceValue');
const yearInput = document.getElementById('year');
const yearError = document.getElementById('yearError');
const mileageInput = document.getElementById('mileage');
const mileageError = document.getElementById('mileageError');
const cityInput = document.getElementById('City');
const cityError = document.getElementById('CityError');
const airbagsInput = document.getElementById('airbags');
const airbagsError = document.getElementById('airbagsError');


// Validate airbags
airbagsInput.addEventListener('blur', function() {
    const airbagsValue = parseInt(this.value);
    if (isNaN(airbagsValue) || airbagsValue < 0 || airbagsValue > 20) {
        this.classList.add('error');
        airbagsError.classList.add('show');
    } else {
        this.classList.remove('error');
        airbagsError.classList.remove('show');
    }
});

// Validate year
yearInput.addEventListener('blur', function() {
    const year = parseInt(this.value);
    const currentYear = new Date().getFullYear();
    if (isNaN(year) || year < 1990 || year > currentYear) {
        this.classList.add('error');
        yearError.classList.add('show');
    } else {
        this.classList.remove('error');
        yearError.classList.remove('show');
    }
});

// Validate mileage
mileageInput.addEventListener('blur', function() {
    const mileage = parseInt(this.value);
    if (isNaN(mileage) || mileage < 0 || mileage > 300000) {
        this.classList.add('error');
        mileageError.classList.add('show');
    } else {
        this.classList.remove('error');
        mileageError.classList.remove('show');
    }
});

// Validate City
cityInput.addEventListener('blur', function() {
    let city = this.value.trim();
    const cityList = [
        'Albuquerque', 'Atlanta', 'Austin', 'Baltimore', 'Boise', 'Boston',
        'Buffalo', 'Charlotte', 'Chicago', 'Cincinnati', 'Cleveland',
        'Colorado Springs', 'Columbus', 'Dallas', 'Denver', 'Detroit',
        'Greenville', 'Honolulu', 'Houston', 'Indianapolis',
        'Jacksonville', 'Kansas City', 'Las Vegas', 'Los Angeles',
        'Louisville', 'Madison', 'Miami', 'Milwaukee', 'Minneapolis',
        'Nashville', 'New Orleans', 'New York', 'Ocala', 'Orlando',
        'Philadelphia', 'Phoenix', 'Pittsburgh', 'Portland', 'Raleigh',
        'Richmond', 'Sacramento', 'Saint Louis', 'Salt Lake City',
        'San Antonio', 'San Diego', 'San Francisco', 'San Jose', 'Seattle',
        'Spokane', 'Tampa', 'Tucson', 'Washington', 'Wichita' , 'Other'
    ];

    if (city === "") {
        this.classList.add('error');
        cityError.classList.add('show');
        return;
    }

    // Normalize city name - capitalize first letter of each word
    city = city.toLowerCase().split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');

    if (cityList.includes(city)) {
        this.classList.remove('error');
        cityError.classList.remove('show');
    } else {
        this.classList.add('error');
        cityError.classList.add('show');
    }
});

// Handle make selection and models
makeSelect.addEventListener('change', function() {
    const selectedMake = this.value;
    modelSelect.innerHTML = '<option value="">Select Model</option>';

    if (selectedMake && carModels[selectedMake]) {
        modelSelect.disabled = false;
        carModels[selectedMake].forEach(function(model) {
            const option = document.createElement('option');
            option.value = model.toLowerCase().replace(/\s+/g, '-');
            option.textContent = model;
            modelSelect.appendChild(option);
        });
    } else {
        modelSelect.disabled = true;
    }
});

// Handle form submission
form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Get values with proper fallbacks for optional fields
    const formData = {
        'Manufacturer': makeSelect.value,
        'Model': modelSelect.value,
        'Prod. year': parseInt(yearInput.value),
        'Category': document.getElementById('category').value,
        'Leather interior': document.getElementById('leatherInterior').checked ,
        'Fuel type': document.getElementById('fuel').value,
        'Engine volume': parseFloat(document.getElementById('engineVolume').value),
        'Mileage': parseInt(document.getElementById('mileage').value),
        'Cylinders': parseFloat(document.getElementById('cylinders').value),
        'Gear box type': document.getElementById('gearbox').value,
        'Drive wheels': document.getElementById('driveWheel').value,
        'Wheel': document.getElementById('wheel').value,
        'Color': document.getElementById('color').value,
        'Airbags': parseInt(airbagsInput.value),
        'City': cityInput.value,
        'State': document.getElementById('State').value,
        'Turbo': parseFloat(document.querySelector('input[name="turbo"]:checked').value)
    };

    // Show loading state
    resultArea.classList.remove('hidden');
    loadingSpinner.classList.remove('hidden');
    priceResult.classList.add('hidden');
    submitBtn.disabled = true;

    // Send data to API
    fetch('/api/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(function(response) {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(function(data) {
        loadingSpinner.classList.add('hidden');
        priceResult.classList.remove('hidden');
        
        if (data.price !== undefined) {
            priceValue.textContent = '$' + data.price.toLocaleString();
            priceValue.style.color = '#27ae60';
        } else {
            priceValue.textContent = 'Error calculating price';
            priceValue.style.color = '#e74c3c';
        }
        
        submitBtn.disabled = false;
    })
    .catch(function(error) {
        console.error('Error:', error);
        loadingSpinner.classList.add('hidden');
        priceResult.classList.remove('hidden');
        priceValue.textContent = 'Error: Unable to estimate price';
        priceValue.style.color = '#e74c3c';
        submitBtn.disabled = false;

        // Reset color after 3 seconds
        setTimeout(function() {
            priceValue.style.color = '#27ae60';
        }, 3000);
    });
});