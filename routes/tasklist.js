const TaskDao = require("../models/TaskDao");

 class TaskList {
   /**
    * Handles the various APIs for displaying and managing tasks
    * @param {TaskDao} taskDao
    */
   constructor(taskDao) {
     this.taskDao = taskDao;
   }
   async showTasks(req, res) {
     const querySpec = {
       query: "SELECT c.datesql, c.DIM FROM c WHERE c.GroupID ='6'"
     };

     const items = await this.taskDao.find(querySpec);
     console.log(items)
     const j = {};
     j.contents = items;



     
     res.render("index", {
       title: "MyToDoList",
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