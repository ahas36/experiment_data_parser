# How to use the core

## Convert AWS json to csv

`npm run csv-parser`

This will create a csv file in the current folder for you.

You can set the file location by changing the `filePath` variable in `src/dataParser.js` file.

## Execute monogo extractor

`npm run monogo-extractor`

This will create a csv and a json file in the current folder for you.

You can set the connection, db name, and collection name by changing their corresponding variables in `src/monogClient.js` file.

You can also modify the mongodb query (line 22).

## Fiware rule based query evaluation

`npm run fiware-listener`

The server first setup the expriment by

1. Connecting to a monogdb
2. Create new collection called event
3. Clear the orion subscription collection
4. Create a new subscription (check teh `sendSubscriptionQuery` method and modify it based on your usecase) 

This will start an express server on port 1028, which has 2 main rest method:

1. `localhost:1028/event` A http post method, which is a callback listener for Fiware Orion subscriptions. When a subscription is triggred, orion will send an event to this method. Then, this method add the current time as event detected time, and store the data in mongodb.

2. `localhost:1028/export` A http get method that query the mongodb event collection, extract the data, and generate a csv file that has entity id, event detection time, observation time, and the dealy.

