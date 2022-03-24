window.onload = function initializePage() {
  let items = document.querySelectorAll("input");
  let submitButton = document.querySelector("#btnSubmit");
  let querystring = window.location.search.substring(1)
  console.log(querystring);
  fridgeID = querystring.slice(-4);
  console.log("Modifying fridge:"+ fridgeID);

  // add an event listener to all of the text fields
  for (let i = 0; i < items.length - 1; i++) {
    items[i].addEventListener("input", checkTextField);
  }
  // add an event listener to the submit submitButton
  submitButton.addEventListener("click", processForm);

  retrieveItemData();
  // console.log(students);
};

let fridgeID ="";
// TODO: function makes an AJAX call to our localhost to retrieve data from the students.json file
// Make changes to the following code so that the URL http://localhost:8000/students is requested from the server with an accept header of type JSON
// this function should call the processStudentData callback function to process the data
function retrieveItemData() {
  xhttp = new XMLHttpRequest(); // create a new XMLHttpRequest object
  xhttp.onreadystatechange = processItemData; // specify what should happen when the server sends a response

  // TODO: set the URL to be http://localhost:8000/students
  xhttp.open("GET", "http://localhost:8000/items", true); // open a connection to the server using the GET protocol

  // TODO: add an application/json Accept request header for the request
  xhttp.setRequestHeader("Accept", "application/json");

  xhttp.send(); // send the request to the server
}
let types = [];
let data;
// process the response from the AJAX call. Specifically, use the JSON data retrieved to populate the table in the HTML page
function processItemData() {
  if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {
    data = JSON.parse(xhttp.responseText);
    console.log("=============");
    // console.log(data);
    // for (let element in data){
    //   types.add(element.type);
    // }
    // console.log(types);
    for (let [key, value] of Object.entries(data)) {
      if (!types.includes(value.type)) {
        types.push(value.type);
      }
    }
    console.log(types);
    populateSelect(data);
  }
  else {
    console.log("There was a problem with the request.");
  }
}

// check if fridge name is valid
function onlyLettersAndSpaces(str) {
  return /^[A-Za-z\s]*$/.test(str);
}

// check if the text entered in the text field is valid
function checkTextField(event) {
  let element = event.target;
  let items = document.querySelectorAll("input");

  if (element.id == "numItemsAccepted") {
    if (isNaN(element.value)) {
      element.classList.add("error");
      element.classList.remove("valid");
    }
    else {
      element.classList.add("valid");
      element.classList.remove("error");
    }
  }

  if (element.id == "fridgeName") {
    if (onlyLettersAndSpaces(element.value)) {
      element.classList.add("valid");
      element.classList.remove("error");
    }
    else {
      element.classList.add("error");
      element.classList.remove("valid");
    }
  }
  // check if all the fields are filled
  let numFilled = 0;

  for (let i = 0; i < items.length - 1; i++) {
    if (items[i].value.length > 0 && !items[i].classList.contains("error")) {
      numFilled++;
    }
  }
  if (numFilled == 8) {
    document.querySelector("#btnSubmit").disabled = false;
  }
  else {
    document.querySelector("#btnSubmit").disabled = true;
  }
}

// function populateForm(event) {
//   let items = document.querySelectorAll("input");
//   let tableCells = event.currentTarget.children;

//   for (let i = 0; i < tableCells.length; i++) {
//     items[i].value = tableCells[i].textContent;
//   }
//   document.querySelector("#btnSubmit").disabled = false;
// }

function processForm(event) {
  event.preventDefault();
  // retrieve the values from the text fields on the form
  let fridgeName = document.getElementById("fridgeName").value;
  let numItemsAccepted = parseInt(document.getElementById("numItemsAccepted").value);
  // let acceptedTypes = document.getElementById("acceptedTypes").value;
  let selected = document.querySelectorAll('#acceptedTypes option:checked');
  let acceptedTypes = Array.from(selected).map(el => el.value);
  let contactPerson = document.getElementById("contactPerson").value;
  let contactPhone = document.getElementById("contactPhone").value;
  let streetName = document.getElementById("streetName").value;
  let postalCode = document.getElementById("postalCode").value;
  let City = document.getElementById("city").value;
  let Province = document.getElementById("province").value;
  console.log("acceptedTypes:" + acceptedTypes);
  // prepare the body for the PUT request. The fields of the object in the request body should match those that the server is expecting
  let requestBody = {
    name: fridgeName,
    can_accept_items: numItemsAccepted,
    accepted_types: acceptedTypes,
    contact_person: contactPerson,
    contact_phone: contactPhone,
    address: {
      street: streetName,
      postal_code: postalCode,
      city: City,
      province: Province
    },

  };
  // console.log(requestBody);

  xhttp = new XMLHttpRequest(); // create a new XMLHttpRequest object

  // specify what should happen when the server sends a response back
  xhttp.onreadystatechange = function () {
    if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {
      let data = JSON.parse(xhttp.responseText);
      console.log(data);
      console.log("==============================");
      // populateStudents();
      console.log("The category data was successfully updated!");
      console.log(xhttp.responseText);
      let message = document.querySelector("#respArea");
      message.innerHTML = "Fridge "+ fridgeID+ " edited successfully";
      message.classList.remove("hidden");
      setTimeout(() => {
        message.classList.add("hidden");
      }, 3000);
    }
    else {
      let message = document.querySelector("#respArea");
      message.innerHTML = "Failed to edit fridge, check console for errors";
      message.classList.remove("hidden");
      setTimeout(() => {
        message.classList.add("hidden");
      }, 3000);
      console.log(xhttp.responseText);
    }
  };
  // let fridgeID = "fg-1";
  let url = "http://localhost:8000/fridges/"+fridgeID;
  console.log("url: " + url);
  console.log(requestBody);

  xhttp.open("PUT", url, true);
  // *** important: both POST and PUT expect a content-type to be set for the content. If this is missing, then the data will not be received on the server-side
  xhttp.setRequestHeader("Content-type", "application/json");

  // *** important: if this header is not set, then the server would not be able to use the "Accept" header value to determine the type of resources to respond with
  xhttp.setRequestHeader("Accept", "application/json");

  // *** important: the JSON object must be stringified before it is sent in the body of the response
  xhttp.send(JSON.stringify(requestBody)); // send the request to the server
}

// populate the table with student data from students.js file. We're reading information
// from an on object and using that to populate the table
function populateSelect(students) {
  let list = document.getElementById("acceptedTypes");
  console.log(list);
  // while (table.rows.length > 1) {
  //   table.deleteRow(1);
  // }
  // iterate through all the objects in the students array
  for (let type of types) {
    let opt = document.createElement("option");
    opt.value = type;
    opt.innerHTML = type;
    list.appendChild(opt);
  }
}
