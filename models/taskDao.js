// @ts-check
 const CosmosClient = require('@azure/cosmos').CosmosClient
 const debug = require('debug')('todo:taskDao')
//  if (typeof fetch !== 'function') {
//   global.fetch = require('node-fetch-polyfill');
// }
// var d3 = require("d3");
// const csv = require('d3-fetch').csv;
 // const csv = require('fast-csv');
 // import * as d3 from 'd3';

const csv = require('csv-parser');
const fs = require('fs');
const list = [];
 // For simplicity we'll set a constant partition key
 const partitionKey = undefined
 class TaskDao {
   /**
    * Manages reading, adding, and updating Tasks in Cosmos DB
    * @param {CosmosClient} cosmosClient
    * @param {string} databaseId
    * @param {string} containerId
    */
   constructor(cosmosClient, databaseId, containerId) {
     this.client = cosmosClient
     this.databaseId = databaseId
     this.collectionId = containerId

     this.database = null
     this.container = null
   }

   async init() {
     debug('Setting up the database...')
     this.getList();
     const dbResponse = await this.client.databases.createIfNotExists({
       id: this.databaseId
     })
     this.database = dbResponse.database
     debug('Setting up the database...done!')
     debug('Setting up the container...')
     const coResponse = await this.database.containers.createIfNotExists({
       id: this.collectionId
     })
     this.container = coResponse.container
     debug('Setting up the container...done!')
   }

   async find(querySpec) {
     debug('Querying for items from the database')
     if (!this.container) {
       throw new Error('Collection is not initialized.')
     }
     const { resources } = await this.container.items.query(querySpec).fetchAll()
     return resources
   }

   async addItem(item) {
      console.log(item);
      debug('Adding an item to the database')
      //onst itemDefs = JSON.parse(readFileSync("./Shared/Data/Families.json", "utf8")).Families; 
        for(const el of list) {
          const items = {};
          Object.keys(el).forEach(function(key) {
            console.log()
            items[key] = el[key];
            items.name = "sauce";
          });

          console.log(items);
          await this.container.items.create(items);
          
        }
    
        item.date = Date.now()
        item.completed = false
        item.soda = " me"
        console.log('hmmm');
        const { resource: doc } = await this.container.items.create(item);
        // await Promise.all(itemDefs.map((itemDef: any) => container.items.create(itemDef)));
        console.log("DOC",doc); 
      return doc
   }

   
   async getList () {
    await fs.createReadStream('13_DA Project_8.csv')
    .pipe(csv())
    .on('data', (row) => {
      list.push(row);
      // console.log(row);
     
    })
    .on('end', () => {
      console.log('CSV file successfully processed');
      console.log(list);
    });
   }

  //  function readStream(stream, encoding = "utf8") {
  //     return new Promise((resolve, reject) => {
  //         let data = "";
  //         fs.createReadStream('data.csv')
  //         .pipe(csv())
  //         .on('data', (row) => {
  //           console.log(row);
  //           //item.FirstName = row.Name;
  //           // item.age = row.Age;
  //         })
  //         .on('end', () => {
  //           console.log('CSV file successfully processed');
  //           console.log(item);
  //         });
  //     });
  //   }

   async updateItem(itemId) {
     debug('Update an item in the database')
     const doc = await this.getItem(itemId)
     doc.completed = true

     const { resource: replaced } = await this.container
       .item(itemId, partitionKey)
       .replace(doc)
     return replaced
   }

   async getItem(itemId) {
     debug('Getting an item from the database')
     const { resource } = await this.container.item(itemId, partitionKey).read()
     return resource
   }
 }

 module.exports = TaskDao
