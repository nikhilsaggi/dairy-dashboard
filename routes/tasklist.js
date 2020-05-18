const TaskDao = require("../models/TaskDao");

 class TaskList {
   /**
    * Handles the various APIs for displaying and managing tasks
    * @param {TaskDao} taskDao
    */
   constructor(taskDao) {
     this.taskDao = taskDao;
   }
   isValid(item){

     return item != '-1' && item != '0' && item != ''
   }

   async showTasks(req, res) {
    var ARRAYS = [26, 86, 2714];
    var dataList = new Array();

    

    // ARRAYS.forEach(async (id) => {

      const querySpec = {
        query: "SELECT TOP 14 c.DIM, c.Protein, c.Yieldgr, c.Fat, c.Blood, c.datets  FROM c WHERE c.AnimalID = 26 ORDER BY c.datets DESC"
        // query: "SELECT c.DIM, c.Protein, c.Yieldgr, c.Fat, c.Blood, c.datets  FROM c WHERE c.AnimalID = ${id} ORDER BY c.datets DESC"
      };

      const items = await this.taskDao.find(querySpec);
      items.reverse();

      //Create the arrays for the charts 
      const j = {};
      items.forEach(row => {
        // console.log(row)

        // Create a new JavaScript Date object based on the timestamp
        // multiplied by 1000 so that the argument is in milliseconds, not seconds.
        var date = new Date(row.datets * 1000);
        row.dates = date;

        Object.keys(row).forEach(key => {

          if(this.isValid(row[key]) && key !== 'datets') {

            if(j[key] == null){
              j[key] = {};
              var x = []
              x.push(row[key])
              j[key][key] = x
              j[key].time = [row.datets]
            }else{
              j[key][key].push(row[key])
              j[key].time.push(row.datets)
            }  
          }
        })
      });

      dataList.push(j);
    // });

      


    const querySpec2 = {
      query: "SELECT TOP 14 c.DIM, c.Protein, c.Yieldgr, c.Fat, c.Blood, c.datets  FROM c WHERE c.AnimalID = 26 ORDER BY c.datets DESC"
      // query: "SELECT c.DIM, c.Protein, c.Yieldgr, c.Fat, c.Blood, c.datets  FROM c WHERE c.AnimalID = ${id} ORDER BY c.datets DESC"
    };

    const items2 = await this.taskDao.find(querySpec2);
    items2.reverse();

    //Create the arrays for the charts 
    const j2 = {};
    items2.forEach(row => {
      // console.log(row)

      // Create a new JavaScript Date object based on the timestamp
      // multiplied by 1000 so that the argument is in milliseconds, not seconds.
      var date = new Date(row.datets * 1000);
      row.dates = date;

      Object.keys(row).forEach(key => {

        if(this.isValid(row[key]) && key !== 'datets') {

          if(j2[key] == null){
            j2[key] = {};
            var x = []
            x.push(row[key])
            j2[key] = x
            j2[key].time = [row.datets]
          }else{
            j2[key].push(row[key])
            j2[key].time.push(row.datets)
          }  
        }
      })
    });

    dataList.push(j2);







    const querySpec3 = {
      query: "SELECT TOP 14 c.DIM, c.Protein, c.Yieldgr, c.Fat, c.Blood, c.datets  FROM c WHERE c.AnimalID = 26 ORDER BY c.datets DESC"
      // query: "SELECT c.DIM, c.Protein, c.Yieldgr, c.Fat, c.Blood, c.datets  FROM c WHERE c.AnimalID = ${id} ORDER BY c.datets DESC"
    };

    const items3 = await this.taskDao.find(querySpec3);
    items3.reverse();

    //Create the arrays for the charts 
    const j3 = {};
    items3.forEach(row => {
      // console.log(row)

      // Create a new JavaScript Date object based on the timestamp
      // multiplied by 1000 so that the argument is in milliseconds, not seconds.
      var date = new Date(row.datets * 1000);
      row.dates = date;

      Object.keys(row).forEach(key => {

        if(this.isValid(row[key]) && key !== 'datets') {

          if(j3[key] == null){
            j3[key] = {};
            var x = []
            x.push(row[key])
            j3[key][key] = x
            j3[key].time = [row.datets]
          }else{
            j3[key][key].push(row[key])
            j3[key].time.push(row.datets)
          }  
        }
      })
    });

    dataList.push(j3);











    console.log("FINAL");
    console.log(dataList);
    // Promise.all(dataList).then(
     res.render("index", {
       title: "Cow Data",
       tasks: JSON.stringify(dataList),

     });
    // );
   }

   async addTask(req, res) {
     const item = req.body;

     console.log(item);
     await this.taskDao.addItem(item);
     res.redirect("/");
   }

   async completeTask(req, res) {
     const completedTasks = Object.keys(req.body);
     const tasks = [];

     completedTasks.forEach(task => {
       tasks.push(this.taskDao.updateItem(task));
     });

     await Promise.all(tasks);

     res.redirect("/");
   }
 }

 module.exports = TaskList;