require("dotenv").config();
const express = require('express');
const jsonServer = require('json-server');
const bodyParser = require('body-parser');
const verifyToken = require("./middlewares/verifyToken");
const jwt = require("jsonwebtoken");
const app = express();
const router = jsonServer.router('db/contacts.json');
const middlewares = jsonServer.defaults();
const fs = require("fs");

const TOKEN_SECRET = "shhfghdfgdcvb";

app.use(bodyParser.json());
app.use(middlewares);
app.use("/contacts", verifyToken);
app.use("/login", (req, res) => {
  const { login, password } = req.body;
  if (login === "root" && password === "Default-123") {
    const token = jwt.sign({ id: 1, nickName: "root", login }, TOKEN_SECRET);
    return res.send({ token });
  }
  if (login === "user" && password === "Password-123") {
    const token = jwt.sign({ id: 2, nickName: "usr1", login }, TOKEN_SECRET);
    return res.send({ token });
  }
  return res.status(401).send({ msg: "Unathorized" });

});

app.use("/me", [verifyToken], (req, res) => {
  const { id, nickName } = req.user;
  return res.send({ id, nickName });
});

app.use("/add", [verifyToken], (req, res) => {
  const { id, nickName } = req.user;
  let contactsJson = fs.readFileSync("db/contacts.json", "utf-8");
  var contactsList = JSON.parse(contactsJson).contacts;
  var newContactObj = {
    id: Math.random(),
    name: req.contact.name,
    phoneNumber: req.contact.phoneNumber,
    user_id: id
  }

  console.log(req.contact);

  contactsList.push(newContactObj);
  let newContactsJson = JSON.stringify(contactsList);
  fs.writeFileSync("db/contacts.json", newContactsJson, "utf-8");
});

app.use("/delete", (req, res) => {
  let contactId = req.contactId;
  let contactsJson = fs.readFileSync("db/contacts.json", "utf-8");
  let contactsList = JSON.parse(contactsJson).contacts;
  let newContactsList = [];

  console.log(contactId);

  for (var i = 0; i < contactsList.length(); i++) {
    if (contactsList[i].id != contactId) {
      newContactsList.push(contactsList[i]);
    }
  }

  console.log(newContactsList);

  let newContactsJson = JSON.stringify(newContactsList);
  fs.writeFileSync("db/contacts.json", newContactsJson, "utf-8");
});

app.use(router);


const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
