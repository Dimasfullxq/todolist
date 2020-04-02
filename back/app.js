const Todo = require('./todo');
const Task = require('./task');
const express = require('express');
const app = express();
const  bodyParser = require('body-parser');
const cors = require("cors");
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const todo = new Todo();
const task = new Task();

/*After recover*/ 
app.get('/favicon.ico', (req, res) => res.status(204));
app.get("/", async function(req,res){
  console.log("Page uploaded!");

  const todolist = await todo.list();
  for(let i = 0;i<todolist.length;i++){
   const tasks = await task.list(todolist[i].id);
   todolist[i].tasks = tasks;  
  }

  res.status(200).json({
    status: "Success",
    todolist: todolist
  });

  
});

/*Creating todolists*/
app.post("/", async function(req, res) {

const data = await todo.create(req.body.text);
  
   res.status(200).json(data);
});

/*Creating tasks*/
app.post("/todo/:todoId/task", async function(req, res) {
 
  const newtask = await task.create(req.body.value,req.params.todoId);
  const value = req.body.value;
  
  if (value.includes("$")) {
    res.status(400).json( {
      error: "$ is disabled"
    });
    return;
  }

  res.status(200).json( {
    status: "Successfully uploaded",
    data: newtask,
  });
 
    
    
});

/*Deleting tasks*/
app.delete("/todo/:todoId/task/:taskId", async function(req, res){

await task.delete(req.params.taskId);

  res.status(200).json({
    status: "Task delete completed",
  });

});

/*Deleting todolists*/
app.delete("/todo/:todoId", async function(req,res){
 
  await todo.delete(req.params.todoId);

  res.status(200).json({
    status: `Project delete completed`,
  })

});

/*Edit tasks*/
app.put("/todo/:todoId/task/:taskId", async function(req,res){


  await task.edit(req.params.taskId,req.body.newlabel);
  
  res.status(200).json({

    status: "Task edit completed!",

  });

});

/*Edit todolists*/
app.put("/todo/:todoId", async function(req,res){
 
  await todo.edit(req.params.todoId,req.body.newlabel);
 

  res.status(200).json({
     
    status: "Project edit completed",

  });
});

/*Finish task*/
app.put("/todo/:todoId/finish/task/:taskId", async function(req,res){
  await task.finish(req.params.taskId);
  res.status(200).json({

   status: "Task finished!",

  });
});

/*Unfinish task*/
app.put("/todo/:todoId/unfinish/task/:taskId", async function(req,res){

    await task.unfinish(req.params.taskId);
  
  res.status(200).json({

    status: "Task is taken from finished!",

  });
});

/*Prior task*/
app.put("/todo/:todoId/prior/task/:taskId", async function(req,res){

  await task.prior(req.params.taskId);

  res.status(200).json({

    status: "Prioritize completed!",

  });
});
/*Cancel prior*/
app.put("/todo/:todoId/cancelprior/task/:taskId", async function(req,res){
  
  await task.unprior(req.params.taskId);
  

res.status(200).json({
  
  status: "Prioritize canceled!",

});
});

app.listen(port, () => {
  console.log("Server is working on 3000");
});