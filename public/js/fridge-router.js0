const express = require('express');
const path = require('path');
let router = express.Router();
const app = express();

app.use(express.json()); // body-parser middleware

const fridgeMod = require('./fridgeMod.js'); // custom fridge module

router.get('/', function (req, res, next) {
    console.log("Inside the GET /");
});