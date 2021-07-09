
const fs = require('fs')
const csv = require('csv-parser')

let resultFileContent = "PhenomenonTime,ingestedTime,gap";

fs.createReadStream('movement2.csv')
  .pipe(csv())
  .on('data', (data) => {
    const PhenomenonTime = parseInt(JSON.parse(data["device_data1 (M)"])["PhenomenonTime"].N);
    const recivedTime = parseInt(data["timestamp (N)"]);
    resultFileContent+=`\n${PhenomenonTime},${recivedTime},${recivedTime-PhenomenonTime}`;
  })
  .on('end', () => {
    fs.writeFile("result.txt", resultFileContent, (err) => {
      if (err) console.log(err);
      console.log("Successfully Written to File.");
    });
  });
