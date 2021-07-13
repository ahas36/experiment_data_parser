
const fs = require('fs')
const csv = require('csv-parser')

const filePath = 'movement2.csv';

let resultFileContent = "PhenomenonTime,ingestedTime,gap";

fs.createReadStream(filePath)
  .pipe(csv())
  .on('data', (data) => {
    const PhenomenonTime = parseInt(JSON.parse(data["device_data1 (M)"])["PhenomenonTime"].N);
    const recivedTime = parseInt(data["timestamp (N)"]);
    resultFileContent += `\n${PhenomenonTime},${recivedTime},${recivedTime - PhenomenonTime}`;
  })
  .on('end', () => {
    fs.writeFile("result-" + new Date().getTime() + ".csv", resultFileContent, (err) => {
      if (err) console.log(err);
      console.log("Successfully Written to File.");
    });
  });
