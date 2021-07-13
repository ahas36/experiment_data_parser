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