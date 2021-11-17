//====================================================================//

const { server, getConnection } = require("./server.js");

let databaseConnection = null;

//==========================SERVER CODE===============================//

server.get("/todos/", async (req, res) => {
  const qp = req.query;
  let response = null;
  let query = null;
  if (qp.status == "TO DO") {
    query = "SELECT * FROM todo WHERE status = 'TO DO'";
  } else if (qp.priority == "HIGH" && qp.status == undefined) {
    query = "SELECT * FROM todo WHERE priority = 'HIGH'";
  } else if (qp.search_q == "Play") {
    query = "SELECT * FROM todo WHERE todo LIKE '%Play%'";
  } else if (qp.status == "IN PROGRESS" && qp.priority == "HIGH") {
    query =
      "SELECT * FROM todo WHERE priority = 'HIGH' AND status = 'IN PROGRESS'";
  }
  response = await databaseConnection.all(query);
  res.send(response);
});

//==========================SERVER CODE===============================//

server.get("/todos/:todoId/", async (req, res) => {
  const qp = req.params;
  let response = null;
  let query = null;
  query = `SELECT * FROM todo WHERE id = ${qp.todoId}`;
  response = await databaseConnection.get(query);
  res.send(response);
});

//==========================SERVER CODE===============================//

server.post("/todos/", async (req, res) => {
  const qp = req.body;
  let response = null;
  let query = null;
  query = `INSERT INTO todo(id,todo,status,priority) VALUES("${qp.id}","${qp.todo}", "${qp.status}", "${qp.priority}")`;
  response = await databaseConnection.run(query);
  res.send("Todo Successfully Added");
});

//==========================SERVER CODE===============================//

server.put("/todos/:todoId/", async (req, res) => {
  const qp = req.body;
  const { todoId } = req.params;
  console.log(qp);
  let response = null;
  let query = null;
  if (qp.status != undefined) {
    query = `UPDATE todo  SET status = '${qp.status}' WHERE id = ${todoId}`;
    await databaseConnection.run(query);
    response = "Status Updated";
  } else if (qp.priority != undefined) {
    query = `UPDATE todo  SET priority = '${qp.priority}' WHERE id = ${todoId}`;
    await databaseConnection.run(query);
    response = "Priority Updated";
  } else if (qp.todo != undefined) {
    query = `UPDATE todo  SET todo = '${qp.todo}' WHERE id = ${todoId}`;
    await databaseConnection.run(query);
    response = "Todo Updated";
  }
  res.send(response);
});

//==========================SERVER CODE===============================//

server.delete("/todos/:todoId/", async (req, res) => {
  const qp = req.params;
  let response = null;
  let query = null;
  query = `DELETE FROM todo WHERE id = ${qp.todoId}`;
  response = await databaseConnection.run(query);
  res.send("Todo Deleted");
});

//==========================SERVER CODE===============================//
getConnection("todoApplication.db").then((connection) => {
  databaseConnection = connection;
});

//====================================================================//

module.exports = server;

//====================================================================//
