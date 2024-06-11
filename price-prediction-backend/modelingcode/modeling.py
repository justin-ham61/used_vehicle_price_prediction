import joblib
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression
from feature_engine.encoding import OneHotEncoder
from sklearn.metrics import mean_squared_error, r2_score


sns.set_theme()

train = pd.read_csv("modelingcode/train.csv")

##Retrieves all column names in lower case from the data
train.columns  = [col.lower() for col in train.columns]


##Dropping missing values in price
train.dropna(subset=['price', 'engine', 'transmission', 'damaged', 'first_owner', 'personal_using'], inplace=True)
##Filter out non-numeric values from price since some are labeled as "No Price"
train = train[train['price'].apply(lambda x : x.isnumeric())]
##Convert price to integer
train['price'] = train['price'].astype(int)

#Dropping columns that will have little effect on the prediction or have a lot of missing values 
train.drop(['min_mpg', 'max_mpg', 'engine_size', 'interior_color', 'exterior_color', 'fuel_type'], axis=1, inplace=True)


target = 'price'
number_datatypes = ['int64', 'float64']

#Separate the columns by data types Boolean, Categorical, Numerical
boolean_variables = [col for col in train.columns if train[col].nunique() == 2]
category_variables = [col for col in train.columns if col not in boolean_variables and train[col].dtype =="object"]
number_variables = [col for col in train.columns if col not in boolean_variables and train[col].dtype in number_datatypes and col != target]

#Graph visualization of the price spread from data. Remove outlier of the .99th percentile which is 145572
fig = plt.figure(figsize=(8, 10))
train = train[train['price'] < 145572]
sns.histplot(train[target], kde=True)
plt.title("Histogram of Price")
plt.show()

#Graph of year vs price
fig = plt.figure(figsize=(8, 10))
sns.scatterplot(data=train, x='year', y=target)
plt.title("Scatter plot between Year and Price")
plt.show()

##Graph of mileage vs price
train = train[train['mileage'] < 170068]
fig = plt.figure(figsize=(8, 10))
sns.scatterplot(data=train, x='mileage', y=target)
plt.title("Scatter plot between Mileage and Price")
plt.show()

##Split train and validation data to a 90/10 split
train, validate = train_test_split(train, test_size=0.10, random_state=0)

XTrain = train.drop('price', axis=1)
YTrain = train['price']

XValidate = validate.drop('price', axis=1)
YValidate = validate['price']

##Encoding categorical training data to feed to training algorithm
preprocessor = Pipeline([
    ('one_hot', OneHotEncoder(
        variables=category_variables, ignore_format=True)),
    ('scaling', StandardScaler())
])

XTrainTransformed = preprocessor.fit_transform(XTrain)
XValidTransformed = preprocessor.transform(XValidate)

joblib.dump(preprocessor, 'preprocessor.pkl')

print(XTrainTransformed)
print(XValidTransformed)

model = RandomForestRegressor(n_estimators=320, random_state=0)
model.fit(XTrainTransformed, YTrain)

y_pred = model.predict(XValidTransformed)
rmse = mean_squared_error(YValidate, y_pred, squared=False)
r2 = r2_score(YValidate, y_pred)

print(rmse)
print(r2) 
 
sns.regplot(x=YValidate, y=y_pred)
plt.show()

##Can delete
info_df = pd.DataFrame(train.isnull().sum(), columns=['#missing'])
info_df['%missing'] = (info_df['#missing'] / len(train)) * 100
info_df['#unique'] = train.nunique()
info_df['dtype'] = train.dtypes

print(info_df)

joblib.dump(model, 'vehicle_price_predictor_RandomForestRegressor.pkl')



