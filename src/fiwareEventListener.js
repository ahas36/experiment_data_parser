const express = require('express')
var axios = require('axios');
const app = express()
app.use(express.json())

const port = 1028
const { MongoClient } = require('mongodb')
const fs = require('fs')

// Connection URL
const url = 'mongodb://localhost:27018'
const client = new MongoClient(url)

// Database Name
const dbName = 'orion'

// Collection Name
const collectionName = 'events'

process.on('exit', function () {
    client.close();
});

async function main() {
    // Use connect method to connect to the server
    await client.connect()
    console.log('Connected successfully to server')
    const db = client.db(dbName)

    //get list of all collections
    let collections = await db.listCollections().toArray();

    //if the events collection exsist, drop it
    if (collections.map(c => c.name).includes(collectionName)) {
        await db.dropCollection(collectionName);
    }


    //create a events collection
    await db.createCollection(collectionName);

    //get an instance of events collection
    let collection = db.collection(collectionName)

    // if subscription collection exsists, drop it
    if (collections.map(c => c.name).includes('csubs')) {
        await db.dropCollection('csubs');
    }

    //sebscribe to entity changes
    sendSubscriptionQuery();

    //this flag is to skip storing the events based on the data which is already in the db
    let isFirst = true;

    
    //for testing
    app.get('/version', (req, res) => {
        res.send(JSON.stringify({v:'0.0.1'}))
    })


    //This method will export the result as csv
    app.get('/export', (req, res) => {
        const exp = async () => {
            const findResult = await collection.aggregate([{
                '$project': {
                    'id': 1,
                    'eventRecivedTime': 1,
                    'oT': '$PhenomenonTime.value',
                    'delay': {
                        '$subtract': ['$eventRecivedTime', '$PhenomenonTime.value']
                    }
                }
            }]).toArray();

            let csv = "id,rT,oT,delay"
            for (let obj of findResult) {
                csv += `\n${obj.id},${obj.eventRecivedTime},${obj.oT},${obj.delay}`;
            }

            res.send(csv);
        }

        exp();

    })


    //Callback method for fiware orion
    app.post('/event', (req, res) => {
        if(isFirst){
            isFirst=false;
            res.sendStatus(200);
        }else{
            console.log('Got body:', req.body);
            for (let d of req.body.data) {
                // add current timea as eventRecivedTime
                d.eventRecivedTime = new Date().getTime();
                collection.insertOne(d)
            }
            res.sendStatus(200);
        }
        
    })

    //start the express server
    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`)
    });


}

//this method is used to subscribe to entity changes
const sendSubscriptionQuery = () => {
    //ToDo change the entity name, attribute, and expression
    var query = JSON.stringify(
        {
            "description": "Notify me when x value is more than 10",
            "subject": {
                "entities": [{ "idPattern": ".*", "type": "Room" }],
                "condition": {
                    "attrs": ["temperature"],
                    "expression": { "q": "temperature<10" }
                }
            },
            "notification": {
                "http": {
                    "url": "http://host.docker.internal:1028/event"
                }
            }
        });

    var config = {
        method: 'post',
        url: 'http://localhost:1026/v2/subscriptions',
        headers: {
            'Content-Type': 'application/json'
        },
        data: query
    };
    

    axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
            console.log(error);
        });
}

main()
    .catch(console.error)
    .finally();