const TaskDao = require("../models/TaskDao");

class TaskList {
  /**
   * Handles the various APIs for displaying and managing tasks
   * @param {TaskDao} taskDao
   */
  constructor(taskDao) {
    this.taskDao = taskDao;
  }
  isValid(item) {

    return item != '-1' && item != '0' && item != ''
  }

  async showEnvData(req, res) {
    var dataList = [];
    const querySpec = {
      query: "SELECT  TOP 14 c[\"DP TH 3097 C L2\"], c[\"RH TH 3090  L2\"], c[\"T T 0432 C L2\"], c[\"T TH 3091 C L2\"], c.datets FROM c ORDER BY c.datets DESC"
    };
    const items = await this.taskDao.find(querySpec);
    console.log(items);
    console.log('Done!');
    items.reverse();

    const j = {};
    items.forEach(row => {
      // console.log(row)

      // Create a new JavaScript Date object based on the timestamp
      // multiplied by 1000 so that the argument is in milliseconds, not seconds.
      var date = new Date(row.datets * 1000);
      row.dates = date;
      Object.keys(row).forEach(key => {
        if (this.isValid(row[key]) && key !== 'datets') {
          if (j[key] == null) {
            j[key] = {};
            var x = []
            x.push(row[key])
            j[key][key] = x
            j[key].time = [row.datets]
          } else {
            j[key][key].push(row[key])
            j[key].time.push(row.datets)
          }
        }
      })
    });
    dataList.push(j);
    res.render("environment", {
      title: "Environment Data",
      tasks: JSON.stringify(dataList),
    });
  }
  async showTasks(req, res) {
    var ARRAYS = ["26", "8", "2714"];
    var dataList = [];
    for (var i = 0; i < ARRAYS.length; i++) {
      const querySpec = {
        query: "SELECT TOP 14 c.DIM, c.Protein, c.Yieldgr, c.Fat, c.Blood, c.datets  FROM c WHERE c.AnimalID = " + ARRAYS[i] + " ORDER BY c.datets DESC"
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

          if (this.isValid(row[key]) && key !== 'datets') {

            if (j[key] == null) {
              j[key] = {};
              var x = []
              x.push(row[key])
              j[key][key] = x
              j[key].time = [row.datets]
            } else {
              j[key][key].push(row[key])
              j[key].time.push(row.datets)
            }
          }
        })
      });
      dataList.push(j);
    }

    console.log("FINAL");
    console.log(dataList);
    // Promise.all(dataList).then(
    res.render("index", {
      title: "Cow Data",
      tasks: JSON.stringify(dataList),
    });
  }

  async showBiometrics(req,res) {
    res.render("biometrics", {
      title: "Biometrics",
      tasks: JSON.stringify(dataList),
    });
  }

  async addTask(req, res) {
    const item = req.body;
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