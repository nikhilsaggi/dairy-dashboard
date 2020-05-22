const CosmosClient = require('@azure/cosmos').CosmosClient
const config = require('./config')
const TaskList = require('./routes/tasklist')
const TaskDao = require('./models/taskDao')

const express = require('express')
const path = require('path')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
var multer = require('multer');

const app = express()

// view engine setup
//  app.engine('html', require('ejs').renderFile);
//  app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

//Todo App:
const cosmosClient = new CosmosClient({
  endpoint: config.host,
  key: config.authKey
})

//set up Daily Data  DB
const taskDao = new TaskDao(cosmosClient, config.databaseId, "DailyData")
const taskDaoActivity = new TaskDao(cosmosClient, config.databaseId, "SHData")
const taskList = new TaskList(taskDao, taskDaoActivity)
taskDao
  .init(err => {
    console.error(err)
  })
  .catch(err => {
    console.error(err)
    console.error(
      'Shutting down because there was an error settinig up the database.'
    )
    process.exit(1)
  })
  taskDaoActivity
    .init(err => {
      console.error(err)
    })
    .catch(err => {
      console.error(err)
      console.error(
        'Shutting down because there was an error settinig up the database.'
      )
      process.exit(1)
    })


///Set up the Environment DB
const taskDaoEn = new TaskDao(cosmosClient, config.databaseId, "EnvData")
const taskListEn = new TaskList(taskDaoEn)

taskDaoEn
  .init(err => {
    console.error(err)
  })
  .catch(err => {
    console.error(err)
    console.error(
      'Shutting down because there was an error settinig up the database.'
    )
    process.exit(1)
  })

  //set up herd dataDB
  const taskDaoHerd = new TaskDao(cosmosClient, config.databaseId, "214_all")
  const taskListHerd = new TaskList(taskDaoHerd)

  taskDaoHerd
    .init(err => {
      console.error(err)
    })
    .catch(err => {
      console.error(err)
      console.error(
        'Shutting down because there was an error settinig up the database.'
      )
      process.exit(1)
    })


///Endpoints
app.get('/', (req, res, next) => {
  taskList.showTasks(req, res).catch(next)
})
app.get('/environment', (req, res, next) => {
  taskListEn.showEnvData(req, res).catch(next)
})
app.get('/biometrics', (req, res, next) => {
  taskListHerd.showBiometrics(req,res).catch(next)
})

app.get('/activity', (req, res, next) => {
  taskList.showActivity(req,res).catch(next)
})

app.get('/upload', (req, res, next) => {
  var dataList = [];
  res.render("upload", {
    title: "Upload Data",
    tasks: JSON.stringify(dataList),
  });
})

app.post('/addtask', (req, res, next) => taskList.addTask(req, res).catch(next))

app.post('/completetask', (req, res, next) =>
  taskList.completeTask(req, res).catch(next)
)


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app