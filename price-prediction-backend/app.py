from flask import Flask, jsonify, request, send_from_directory, render_template
from flask_cors import CORS
from retrieveConfig import allMakes
import joblib
import pandas as pd
import logging


logging.basicConfig(filename="price-prediction-backend/prediction_record.log", level=logging.INFO, format='%(levelname)s %(asctime)s %(message)s')
logger = logging.getLogger(__name__)

werkzeug_logger = logging.getLogger("werkzeug")
werkzeug_logger.setLevel(logging.ERROR)


app = Flask(__name__, static_folder='dist', template_folder='dist')
CORS(app) 



#Load preprocessor and machine learned model
pipeline = joblib.load('price-prediction-backend/vehicle_price_predictor_RandomForestRegressor.pkl')
preprocessor = joblib.load('price-prediction-backend/preprocessor.pkl')


def predict_price(input_data):
    # Convert input data to DataFrame
    input_df = pd.DataFrame([input_data], columns=[
        'brand', 'model', 'year', 'mileage', 'engine', 'transmission', 'drivetrain', 'damaged', 'first_owner', 'personal_using',
        'turbo', 'adaptive_cruise_control', 'navigation_system', 'power_liftgate', 'backup_camera', 'keyless_start', 'remote_start',
        'sunroof/moonroof', 'leather_seats', 'memory_seat', 'apple_car_play/android_auto', 'bluetooth', 'usb_port', 'heated_seats',
        'alloy_wheels', 'third_row_seating', 'stability_control', 'automatic_emergency_braking', 'automatic_transmission'
    ])

    input_transformed = preprocessor.transform(input_df)

    # Predict the price
    predicted_price = pipeline.predict(input_transformed)
    
    return predicted_price[0]


@app.route('/')
def serve():
    return render_template('index.html')

@app.route('/<path:path>')
def static_proxy(path):
    return send_from_directory(app.static_folder, path)

@app.route('/getinfo', methods=['GET'])
def get_info():
    app.logger.info("Got info")
    makes_dict = {make: {
        'models': {model: {
            'years': list(currModel.years),
            'engines': list(currModel.engines),
            'transmissions': list(currModel.transmissions),
            'drivetrains': list(currModel.drivetrains)
        } for model, currModel in currMake.models.items()}
    } for make, currMake in allMakes.items()}
    return jsonify(makes_dict)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    userData = {
        'brand': data['make'],
        'model': data['model'],
        'year': data['year'],
        'mileage': data['mileage'],
        'engine': data['engine'],
        'transmission': data['transmission'],
        'drivetrain': data['drivetrain'],
        'damaged': int(data['Damages']),
        'first_owner': int(data['First Owner']), 
        'personal_using': int(data['Personal']), 
        'turbo': int(data['Turbo']), 
        'adaptive_cruise_control': int(data['Cruise']), 
        'navigation_system': int(data['Navigation']), 
        'power_liftgate': int(data['Power Lift']), 
        'backup_camera': int(data['Backup Camera']),
        'keyless_start': int(data['Keyless Entry']), 
        'remote_start': int(data['Remote Start']), 
        'sunroof/moonroof': int(data['Sunroof']), 
        'leather_seats': int(data['Leather Seats']), 
        'memory_seat': int(data['Memory Seats']), 
        'apple_car_play/android_auto': int(data['Apple/Google Car']),
        'bluetooth': int(data['Bluetooth']), 
        'usb_port': int(data['USB']), 
        'heated_seats': int(data['Heated Seats']),
        'alloy_wheels': int(data['Allow Wheels']),
        'third_row_seating': int(data['Third Row Seating']),
        'stability_control': int(data['Stability Control']),
        'automatic_emergency_braking': int(data['Emergency Braking']),
        'automatic_transmission': int(data['Automatic Transmission'])
    }

    print(userData)
    lowMileageData = userData.copy()
    highMileageData = userData.copy()
    lowMileageData['mileage'] = str(int(lowMileageData['mileage']) * .5)
    lowMileageData['mileage'] = 5000
    highMileageData['mileage'] = 100000
    predicted_price = predict_price(userData)
    lowMileagePrice = predict_price(lowMileageData)
    highMileagePrice = predict_price(highMileageData)
    print(lowMileageData)
    print(highMileageData)
    print(predicted_price)

    log_message = f"The data prediction was made with: {data}, prediction was: {predicted_price}"
    app.logger.info(log_message)


    return jsonify({'predicted_price': predicted_price, 'low_mileage_price': lowMileagePrice, 'high_mileage_price': highMileagePrice})

if __name__ == '__main__':
    app.run(debug=True)

