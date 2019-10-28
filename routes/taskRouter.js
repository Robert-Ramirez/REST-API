//routers
app.get("/api/v0/tasks/", (req, res) => {
    res.status(200).json({
      data: {
        tasks
      }
    });
  });
  
  app.get("/api/v0/tasks/:id", (req, res) => {
    const id = req.params.id * 1;
    const task = tasks.find(el => el.id === id);
    res.status(200).json({
      data: {
        task
      }
    });
  });
  
  app.post("/api/v0/tasks/", (req, res) => {
    const newId = tasks[tasks.length - 1].id + 1;
    const newTask = Object.assign({ id: newId }, req.body);
    tasks.push(newTask);
    fs.writeFile(`${__dirname}/data/tasks.json`, JSON.stringify(tasks), err => {
      res.status(201).json();
    });
  });
  
  app.patch("/api/v0/tasks/:id", (req, res) => {
    const id = req.params.id * 1;
    let task = tasks.filter(el => el.id !== id);
    const newTask = Object.assign({ id: id }, req.body);
    task.push(newTask);
    task.sort((a, b) => {
      return a.id - b.id;
    });
    fs.writeFile(`${__dirname}/data/tasks.json`, JSON.stringify(task), err => {
      res.status(201).json();
    });
  });
  
  app.delete("/api/v0/tasks/:id", (req, res) => {
    const id = req.params.id * 1;
    let task = tasks.filter(el => el.id !== id);
    task.sort((a, b) => {
      return a.id - b.id;
    });
    fs.writeFile(`${__dirname}/data/tasks.json`, JSON.stringify(task), err => {
      res.status(204).json();
    });
  });


  module.exports = taskRouter;