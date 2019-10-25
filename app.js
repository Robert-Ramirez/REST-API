var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var methodOverride = require("method-override");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));

var id = 2;
var tasks = [ {id: 0, name: "school"}, {id: 1, name: "test"} ];


app.get("/", function(req, res){
    res.render("tasks", {tasks:tasks});
});

app.get("/tasks", function(req, res){
    res.render("tasks", {tasks:tasks});
});

// CREATE Task
app.post("/tasks", function(req, res){
    // get data from form and add to tasks array
    var name = req.body.name;
    var newTask = {id:id, name: name};
    id++;
    tasks.push(newTask);
    //redirect back to tasks page
    res.redirect("/tasks");
});

app.listen(process.env.PORT, process.env.IP);