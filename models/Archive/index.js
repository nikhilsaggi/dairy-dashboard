// #!/usr/bin/env node


// const storage = require('azure-storage');
// const connectionString = "DefaultEndpointsProtocol=https;AccountName=cow;AccountKey=6jebuPASXyjFsZYFyvU0MqmcrTaCeVl27w19902LZjP5FMGMDBvZS7iSaBdW5fqS71hgBKj9JYTj3j3iH8GAEw==;TableEndpoint=https://cow.table.cosmos.azure.com:443/;";
// const storageClient = storage.createTableService(connectionString);


// require('dotenv').config();
const util = require('util');
var azure = require('azure-storage');


var tableSvc = azure.createTableService('cowddata', 'Q4Go929jTeOVFwQF10nZvC37XOJoNEpxTr7wbCtcPzQ+78ReccFGL+TAScOVT0ubXkNbQVngdAmUxBCZduT8kw==');

var task = {
    PartitionKey: {'_':'hometasksl'},
    RowKey: {'_': '1'},
    description: {'_':'take out the trashl'},
    dueDate: {'_':new Date(2015, 6, 20), '$':'Edm.DateTime'}
  };


//   tableSvc.insertEntity('test',task, function (error, result, response) {
//     if(!error){
//         console.log(error, response+ "hi " + result);
//       // Entity inserted
//     }
//     console.log(error, response+ " " + result);
//   });


// // TX2ukayhX77pKXc5WUekUxQ5NMEv1nU6ti8q5fq2GOncBNWtA6Fy1yG/9n38O0VPDu1EWcPTvnSsZ2n8cQ1Yzw==


// // const blobService = storage.createBlobService();

// // const containerName = 'photoblobs';
// // const createContainerAsync = util.promisify(blobService.createContainerIfNotExists).bind(blobService);


// // async function main() {
// //     try {
// //         var result = await createContainerAsync(containerName);
// //         if (result.created) {
// //             console.log(`Blob container ${containerName} created`);
// //         }
// //         else {
// //             console.log(`Blob container ${containerName} already exists.`);
// //         }
// //     }
// //     catch (err) {
// //         console.log(err.message);
// //     }
// // }

// // main();
