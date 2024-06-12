# Used Car Price Prediction Application

## Overview

This project is a Python Flask and React application that utilizes a machine learning model to predict used car prices. The model, built using Random Forest Regression, has achieved an R² score of 0.87. The application can parse through a dataset of used vehicles, automatically train the model with predefined configurations, and implement the learned model into the backend. The React frontend provides a user-friendly interface for entering car details and obtaining price predictions.

## Features

- **Automated Model Training**: The application can automatically train the model using a dataset of used vehicles.
- **Price Prediction**: Users can input car details through the frontend and receive a predicted price from the backend.
- **Visualization**: The result page displays various graphs including a linear graph of predictions based on mileage, correlation graphs, and a price range histogram.

## Setup Guide

Follow these steps to install and use the application on your own machine.

### Install Necessary Programs

Ensure you have the following programs installed on a Windows computer:

- Python 3
- PIP
- Matplotlib
- Scikit-learn
- Flask
- Numpy
- Pandas
- Seaborn

### Training the Model

1. Run the `modeling.py` code to train the model using the provided data:
   ```sh
   python modeling.py

### Running the Application
1. After training the model, run the server
    ```sh
    python app.py

2. Your application should be running on port 5000
3. Open web browser (Chrome) and visit: http://localhost:5000

### Making a Prediciton
1. Click "Start" on the homepage
2. From the input menu, enter the vehicle informations
3. Click "Predict"

   