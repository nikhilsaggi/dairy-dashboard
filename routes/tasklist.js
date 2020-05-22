const TaskDao = require("../models/TaskDao");

class TaskList {
  /**
   * Handles the various APIs for displaying and managing tasks
   * @param {TaskDao} taskDao
   */
  constructor(taskDao, taskDao2) {
    this.taskDao = taskDao;
    this.taskDao2 = taskDao2;
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

  async showBiometrics(req, res) {
    var ARRAYS = ["2714.csv", "26.csv", "86.csv"];
    var keys = ['animal_activity', 'low_pass_over_activity', 'temp_without_drink_cycles']
    var dataList = {};
    for (var i = 0; i < 1; i++) {
      for (var j = 0; j < keys.length; j++) {
        const querySpec = {
          query: "SELECT TOP 200 c.time, c." + keys[j] + " FROM c WHERE c." + keys[j] + " !='' AND c." + keys[j] + "!='0.0' AND c.CowID = '" + ARRAYS[i] + "' ORDER BY c.time DESC"
        };
        //console.log(querySpec.query)
        const items = await this.taskDao.find(querySpec);
        dataList[keys[j]] = items
      }
    }
    console.log(dataList)
    res.render("biometrics", {
      title: "Biometrics",
      tasks: JSON.stringify(dataList),
    });
  }

  async showActivity(req, res) {
    var dataList = {};
    var nameActivity = ['Weightgr', 'RestTimemin', 'Activitystepshr']
    var nameSH = ['totaleating', 'totalrumination', 'totalother']
    for (var j = 0; j < nameActivity.length; j++) {
      var key = nameActivity[j]
      const querySpec = {
        query: "SELECT TOP 200 c." + key + ", c.datets FROM c WHERE c." + key + " != 0 ORDER BY c.datets DESC"
      };
      console.log(querySpec.query);
      const items = await this.taskDao.find(querySpec);
      var keyValues = []
      var times = []
      items.forEach(row => {
        keyValues.push(row[key])
        times.push(row.datets)
      })
      dataList[key] = {}
      dataList[key][key] = keyValues;
      dataList[key].times = times;

    }
    //get data from the SHtable
    for (var j = 0; j < nameSH.length; j++) {
      var key = nameSH[j]
      const querySpec = {
        query: "SELECT TOP 200 c." + key + ", c.datets FROM c WHERE c." + key + " != 0 ORDER BY c.datets DESC"
      };
      console.log(querySpec.query);
      const items = await this.taskDao2.find(querySpec);
      var keyValues = []
      var times = []
      items.forEach(row => {
        keyValues.push(row[key])
        times.push(row.datets)
      })
      dataList[key] = {}
      dataList[key][key] = keyValues;
      dataList[key].times = times;

    }

    console.log(dataList);


    res.render("activity", {
      title: "Activity",
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