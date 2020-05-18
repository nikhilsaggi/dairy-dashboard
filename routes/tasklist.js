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
     const querySpec = {
       query: "SELECT TOP 14 c.DIM, c.Protein, c.Yieldgr, c.Fat, c.Blood, c.datets  FROM c WHERE c.AnimalID = 26 ORDER BY c.datets DESC"
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
      row.datets = date.toLocaleDateString();

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


    //  console.log(j);
     res.render("index", {
       title: "Cow Data",
       tasks: JSON.stringify(j),

     });
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