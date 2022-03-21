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


let fridgeData = {};
let itemData = {};
let nextID = 0;

let returnInfo = 0;
// const noInfo =0;
// const updatedInfo = 8;
// const addedItem = 9;
// const addedFridge = 5;


// ROUTES
// 1.
app.get("/", loadHome);
// 2. 3.
app.get("/fridges", getFridges);
// 4.
app.get("/fridges/addFridge", addFridges);
// 5.
app.post("/fridges", validateNewFridge, addNewFridge, writeFile);
// 7.  swape with 6 to separate routes
app.get("/fridges/editFridge", loadEditFridge);
// 6.
app.get("/fridges/:fridgeID", retrieveFridge);
// 8. 
app.put("/fridges/:fridgeID", validateID, validateNewFridge, editFridge, writeFile);
// 9.
app.post("/fridges/:fridgeID/items", validateID, validateItem, addItem2Fridge, writeFile);
// 11.  swape with 10 to separate routes
app.delete("/fridges/:fridgeID/items", validateID, validateDeleteQuery);
// 10.
app.delete("/fridges/:fridgeID/:itemID", validateID, validateDeleteItem, deleteFridgeItem, writeFile);



// default
app.put("*", (req, res) => {
    res.status(400).send("bad request");
});
// this does not work for separate bad post requests
// localhost:8000/fridges/fg-1/items/?11&2&6&7
app.post("*", (req, res) => {
    res.status(400).send("bad request");
});

app.get("*", (req, res) => {
    res.status(400).send("bad request");
});
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
                res.json(fridgeData);
                // res.sendFile(path.join(__dirname, 'js/comm-fridge-data.json'), (err) => {
                //     if (err) res.status(500).send("500 server error");
                // });
            }
        });
    } else {
        res.status(500).send("500 server error");
    }
}

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
function validateNewFridge(req, res, next) {
    console.log("validateNewFridge");
    returnInfo = 1;
    if (req.body.name === undefined || req.body.name === "" || req.body.can_accept_items === undefined || req.body.can_accept_items === ""
        || req.body.accepted_types === undefined || req.body.accepted_types.length === 0 ||
        req.body.contact_person === undefined || req.body.contact_person === "" || req.body.contact_phone === undefined ||
        req.body.contact_phone === "" || req.body.address === undefined || Object.keys(req.body.address).length < 4 ||
        req.body.address.street === "" || req.body.address.postal_code === "" ||
        req.body.address.city === "" || req.body.address.province === "") {
        return res.status(400).send("missing fields in the POST body")
    }
    next();
}

function addNewFridge(req, res, next) {
    console.log("POST : Add new fridge into the json");
    for (let f of fridgeData) {
        if (parseInt(f.id.slice(-1)) > nextID) {
            nextID = parseInt(f.id.slice(-1));
        }
    }
    let id = "fg-" + (++nextID);
    let newFridge = {
        id: id,
        name: req.body.name,
        num_items_accepted: 0,
        can_accept_items: req.body.can_accept_items,
        accepted_types: req.body.accepted_types,
        contact_person: req.body.contact_person,
        contact_phone: req.body.contact_phone,
        address: req.body.address,
        items: []
    }
    newFridge.address.country = "Canada";
    console.log(newFridge);
    fridgeData.push(newFridge);
    returnInfo = 1;
    next();

}



// 6. retrieve fridge by id
// todo 400 and 500

function retrieveFridge(req, res) {
    console.log("GET:retrieveFridge");
    console.log(req.params.fridgeID);
    // console.log(fridgeData.hasOwnProperty(req.params.fridgeID));
    // if (!fridgeData.hasOwnProperty(req.params.fridgeID)) {
    //     return res.status(404).send();
    // } else {



    if (req.params.fridgeID === "") {
        return res.status(400).send();
    }
    // redirect to part 7 
    // if (req.params.fridgeID === "editFridge") {
    //     loadEditFridge(req, res);
    //     return;
    // }
    let fridge;
    try {
        fridge = fridgeData.filter(
            function findFridge(fri) {
                return fri.id == req.params.fridgeID;
            });
    }
    catch (err) {
        return res.status(500).send();
    }
    if (fridge === undefined || fridge.length === 0) {
        return res.status(404).send();
    }
    console.log(fridge);
    return res.status(200).send(fridge[0]); // return the first fridge of the array
    // }
}

// 7.
function loadEditFridge(req, res) {
    res.set('Content-Type', 'text/html');
    fs.access(path.join(__dirname, 'public/editFridge.html'), (err) => {
        if (err) {
            res.status(404).send("cannot find the file: editFridge.html");
        } else {
            res.sendFile(path.join(__dirname, 'public/editFridge.html'), (err) => {
                if (err) res.status(500).send("500 server error");
            });
        }
    });
}


// 8. PUT to update a fridge

function validateID(req, res, next) {
    console.log("validateFridgeID");
    returnInfo = 1;
    let fridge = fridgeData.filter(
        function findFridge(fri) {
            return fri.id == req.params.fridgeID;
        });
    // console.log(req.params.fridgeID);
    // console.log(fridge);
    if (fridge === undefined || fridge.length === 0) {
        return res.status(404).send("fridgeID not found");
    } else {
        next();
    }
}


function editFridge(req, res, next) {
    console.log("PUT : Edit fridge data");
    let target = fridgeData.find(
        function findFridge(fri) {
            return fri.id == req.params.fridgeID
        }
    )
    if (target !== undefined) {
        target.name = req.body.name;
        target.can_accept_items = parseInt(req.body.can_accept_items);
        target.accepted_types = req.body.accepted_types;
        target.contact_person = req.body.contact_person;
        target.contact_phone = req.body.contact_phone;
        target.address = req.body.address;
    }
    next();

}

// 9.
function validateItem(req, res, next) {
    console.log("POST validate item");
    console.log(itemData);
    if (!itemData.hasOwnProperty(req.body.id)) {
        return res.status(404).send("itemID not found");
    } else if (isNaN(req.body.quantity) || parseInt(req.body.quantity) < 0) {
        return res.status(400).send("quantity is not valid");
    } else {
        next();
    }
    // console.log();
}

function addItem2Fridge(req, res, next) {
    console.log("insert new item data to fridge");
    let target = fridgeData.find(
        function findFridge(fri) {
            return fri.id == req.params.fridgeID
        }
    )
    // check if the item is already present in target fridge
    let item = target.items.find(function findItem(itm) {
        return itm.id == req.body.id
    });
    console.log("===item " + item);
    if (item !== undefined) {
        return res.status(409).send("itemID existed");
    }
    else {
        let newItem = {
            id: req.body.id.toString(),
            quantity: parseInt(req.body.quantity)
        }
        target.items.push(newItem);
        // redirect to writeFile
        returnInfo = 1;
        next();
    }

}

// 10. 

function validateDeleteItem(req, res, next) {
    console.log("Delete validate item");
    console.log(req.params.itemID);
    // redirect to part 11
    // if (req.params.itemID === "items") {
    //     validateDeleteQuery(req, res);
    //     return;  // this is necessary
    // }
    //
    if (!itemData.hasOwnProperty(req.params.itemID)) {
        return res.status(404).send("itemID not found");
    } else {
        next();
        // move on to delete
    }
    // console.log();
}

function deleteFridgeItem(req, res, next) {
    console.log("Delete item");
    let target = fridgeData.find(
        function findFridge(fri) {
            return fri.id == req.params.fridgeID
        }
    )
    if (target !== undefined) { }
    let itemIndex = target.items.findIndex(object => {
        return object.id == req.params.itemID;
    });//better than indexOf(req.params.itemID);
    console.log("itemIndex: " + itemIndex);
    if (itemIndex === -1) {
        return res.status(404).send("itemID not found in the fridge");
    }
    // remove 1 item at itemIndex
    target.items.splice(itemIndex, 1);
    console.log(target);
    returnInfo = 0;   //hide 200 return message
    next();
    // move on to write
}


// 11.
function validateDeleteQuery(req, res, next) {
    console.log("validateDeleteQuery");
    let query = req.query;
    let target = fridgeData.find(
        function findFridge(fri) {
            return fri.id == req.params.fridgeID
        }
    )
    // console.log(query);
    // delete everything in the;
    if (Object.keys(query).length == 0) {
        target.items = [];
        returnInfo =0;
        writeFile(req, res);
        return;
    }
    let itemIds = Object.keys(query);
    // console.log(itemIds);
    let foundAny = 0;
    for (let id of itemIds) {
        let itemIndex = target.items.findIndex(object => {
            return object.id == id;
        });
        console.log("itemIndex: " + itemIndex);
        if (itemIndex !== -1) {
            foundAny++;
            // delete at index
            target.items.splice(itemIndex, 1);
        }

    }
    if (foundAny === 0) {
        return res.status(404).send("itemID not found in the fridge");
    } else {
        returnInfo = 0; // hide info
        writeFile(req, res);
        // console.log("ever run here");
        return;
    }
    // console.log(Object.keys(query).length);
}


function writeFile(req, res, next) {
    fs.writeFile(path.join(__dirname, "js/comm-fridge-data.json"), JSON.stringify(fridgeData), (err, data) => {
        if (err) {
            return res.status(500).send("Database error: write to json")
        }
        console.log(req.params);
        console.log(req.body);
        if (returnInfo > 0) {
            console.log("return with indo");
            return res.status(200).send(req.body);
        }
        else {
            return res.status(200).send();
        }

    })
    console.log("saving comm-fridge-data.json");
}

// load file when server starts
fs.readFile(path.join(__dirname, "js/comm-fridge-data.json"), (err, data) => {
    if (err) throw err;
    fridgeData = JSON.parse(data);
    fs.readFile(path.join(__dirname, "js/comm-fridge-items.json"), (err, data) => {
        if (err) throw err;
        itemData = JSON.parse(data);
    });
    app.listen(PORT, () => console.log("Server running at http://localhost:" + PORT));
});
