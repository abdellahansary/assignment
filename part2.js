const http = require("http");
const fs = require("fs");
const path = require("path");

const usersFile = path.join(__dirname, "users.json");

// read users from the json file
function readUsers() {
  if (!fs.existsSync(usersFile)) {
    fs.writeFileSync(usersFile, "[]");
  }
  let data = fs.readFileSync(usersFile, "utf8");
  return JSON.parse(data);
}

// write users back to the json file
function writeUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

// send a json response
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

// get the request body as an object
function getBody(req, callback) {
  let body = "";
  req.on("data", function (chunk) {
    body += chunk;
  });
  req.on("end", function () {
    callback(body ? JSON.parse(body) : {});
  });
}

// add a new user
function addUser(req, res) {
  getBody(req, function (data) {
    let users = readUsers();
    let emailExists = users.some(function (u) {
      return u.email === data.email;
    });

    if (emailExists) {
      sendJSON(res, 400, { message: "Email already exists." });
      return;
    }

    let newUser = {
      id: users.length ? users[users.length - 1].id + 1 : 1,
      name: data.name,
      age: data.age,
      email: data.email,
    };

    users.push(newUser);
    writeUsers(users);
    sendJSON(res, 201, { message: "User added successfully." });
  });
}

// update a user by id
function updateUser(req, res, id) {
  let users = readUsers();
  let index = users.findIndex(function (u) {
    return u.id === id;
  });

  if (index === -1) {
    sendJSON(res, 404, { message: "User ID not found." });
    return;
  }

  getBody(req, function (data) {
    if (data.name !== undefined) users[index].name = data.name;
    if (data.age !== undefined) users[index].age = data.age;
    if (data.email !== undefined) users[index].email = data.email;

    writeUsers(users);
    sendJSON(res, 200, { message: "User age updated successfully." });
  });
}

// delete a user by id
function deleteUser(res, id) {
  let users = readUsers();
  let index = users.findIndex(function (u) {
    return u.id === id;
  });

  if (index === -1) {
    sendJSON(res, 404, { message: "User ID not found." });
    return;
  }

  users.splice(index, 1);
  writeUsers(users);
  sendJSON(res, 200, { message: "User deleted successfully." });
}

// get all users
function getAllUsers(res) {
  let users = readUsers();
  sendJSON(res, 200, users);
}

// get a single user by id
function getUserById(res, id) {
  let users = readUsers();
  let user = users.find(function (u) {
    return u.id === id;
  });

  if (!user) {
    sendJSON(res, 404, { message: "User not found." });
    return;
  }

  sendJSON(res, 200, user);
}

// simple router
const server = http.createServer(function (req, res) {
  let url = new URL(req.url, "http://" + req.headers.host);
  let segments = url.pathname.split("/").filter(Boolean);

  if (segments[0] === "user" && segments.length === 1) {
    if (req.method === "POST") return addUser(req, res);
    if (req.method === "GET") return getAllUsers(res);
  }

  if (segments[0] === "user" && segments.length === 2) {
    let id = Number(segments[1]);
    if (req.method === "GET") return getUserById(res, id);
    if (req.method === "PATCH") return updateUser(req, res, id);
    if (req.method === "DELETE") return deleteUser(res, id);
  }

  sendJSON(res, 404, { message: "Route not found." });
});

server.listen(3000, function () {
  console.log("Server running on http://localhost:3000");
});
