import csv 
from object.make import Make
from object.model import Model

##allMakes contains a map of all brands and models associated with each brand.
allMakes = {}

with open('C:/Users/jiheo/code/price-predictioon-backend/data/train.csv', mode='r') as file:
    csv_reader = csv.reader(file)
    next(csv_reader)
    for row in csv_reader:
        columns = [row[0], row[1], row[2], row[3], row[4],  row[6], row[9], row[10], row[11], row[12], row[13], row[14], row[15], row[17], row[18], row[19], row[20], row[21], row[22], row[23], row[26], row[27], row[29], row[30], row[31], row[32], row[35]]
        
        ##Skips row if not all columns are filled out
        if not all(columns):
            continue

        ##Create new make if they don't exist 
        if not row[0] in allMakes:
            make = Make(row[0])
            allMakes[row[0]] = make
    
        ##Retrieve current make
        currMake = allMakes[row[0]]
        
        ##if the model is not in the make's list of models, create a new model and add it to the make's list of models
        if not row[1] in currMake.models:
            model = Model(row[1])
            currMake.models[row[1]] = model
        
        ##Retrieves the current model from the current brand
        currModel = currMake.models[row[1]]
        year = row[2]
        engine = row[4]
        transmission = row[6]
        drivetrain = row[9]

        ##Checks models year
        if not year in currModel.years:
            currModel.years.add(year)
        ##Checks models engine
        if not engine in currModel.engines:
            currModel.engines.add(engine)
        ##Checks models transmission
        if not transmission in currModel.transmissions:
            currModel.transmissions.add(transmission)
        ##Checks models drivetrain
        if not drivetrain in currModel.drivetrains:
            currModel.drivetrains.add(drivetrain)
