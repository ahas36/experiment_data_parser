const { MongoClient } = require('mongodb')
const fs = require('fs')

// Connection URL
const url = 'mongodb://localhost:27018'
const client = new MongoClient(url)

// Database Name
const dbName = 'orion'

// Collection Name
const collectionName = 'entities'

async function main() {
    // Use connect method to connect to the server
    await client.connect()
    console.log('Connected successfully to server')
    const db = client.db(dbName)
    const collection = db.collection(collectionName)

    // MongoDb Query
    const findResult = await collection.aggregate([{
        '$project': {
            'rT': '$creDate',
            'oT': '$attrs.PhenomenonTime.value',
            'delay': {
                '$subtract': ['$creDate', '$attrs.PhenomenonTime.value']
            }
        }
    }]).toArray();

    // the following code examples can be pasted here...

    const dateExt = new Date().getTime();

    fs.writeFile("monog-result-" + dateExt + ".json", JSON.stringify(findResult, null, 4), (err) => {
        if (err) console.log(err);
        console.log("Successfully Written to File.");
    });

    let csv = "id,rT,oT,delay"
    for(let obj of findResult){
        csv+=`\n${obj._id.id},${obj.rT},${obj.oT},${obj.delay}`;
    }


    fs.writeFile("monog-result-" + dateExt + ".csv", csv, (err) => {
        if (err) console.log(err);
        console.log("Successfully Written to File.");
    });
}


main()
    .catch(console.error)
    .finally(() => client.close());