// INITIALIZING MODULES

const express = require("express");
const fs = require("fs");
const app = express();
const path = require("path");
const { send } = require("process");
const PORT = 8000; // process.env.PORT || 3000;
console.log(PORT);

// SET UP MIDDLEWARE
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    console.log(req.method);
    console.log(req.url);
    if (Object.keys(req.body).length > 0) {
        console.log('Body:');
        console.log(req.body);
    }
    next();
});

// ROUTES

app.get("/", loadHome);
app.get("/fridges", getFridges);
app.get("/fridges/addFridge", addFridges);

app.post("/fridges", newFridge);
// 1.
function loadHome(req, res) {
    res.set('Content-Type', 'text/html');
    fs.access(path.join(__dirname, 'public/index.html'), (err) => {
        if (err) {
            res.status(404).send("cannot find the file: index.html");
        } else {
            res.sendFile(path.join(__dirname, 'public/index.html'), (err) => {
                if (err) res.status(500).send("500 server error");
            });
        }
    });
}

// 2.
function getFridges(req, res) {
    if (req.accepts("html")) {
        console.log("get view_pickup.html");
        fs.access(path.join(__dirname, 'public/view_pickup.html'), (err) => {
            if (err) {
                res.status(404).send("cannot find the file: view_pickup.html");
            } else {
                res.set('Content-Type', 'text/html');
                res.sendFile(path.join(__dirname, 'public/view_pickup.html'), (err) => {
                    if (err) res.status(500).send("500 server error");
                });
            }
        });
        // 3.        
    } else if (req.accepts("json")) {
        fs.access(path.join(__dirname, 'js/comm-fridge-data.json'), (err) => {
            if (err) {
                res.status(404).send("cannot find the file: comm-fridge-data.json");
            } else {
                res.set('Content-Type', 'application/json');
                res.sendFile(path.join(__dirname, 'js/comm-fridge-data.json'), (err) => {
                    if (err) res.status(500).send("500 server error");
                });
            }
        });
    }
}
// ?? not sure if I need to store fridges to a variable??

// 4.
function addFridges(req, res) {
    console.log("get addFridge.html");
    fs.access(path.join(__dirname, 'public/addFridge.html'), (err) => {
        if (err) {
            res.status(404).send("cannot find the file: addFridge.html");
        } else {
            res.set('Content-Type', 'text/html');
            res.sendFile(path.join(__dirname, 'public/addFridge.html'), (err) => {
                if (err) res.status(500).send("500 server error");
            });
        }
    });
}

//5.
function newFridge(req, res)

app.listen(PORT);
console.log("Server running at http://localhost:" + PORT);