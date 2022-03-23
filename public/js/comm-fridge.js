window.onload = function () {
	let pageId = document.getElementsByTagName("body")[0].id;
	// retriveItemData();
	console.log("=========");
	if (pageId != null && pageId == "view_items") {

		retriveFridgeData();
		// retriveItemData();
		// displayFridges(pageId);
		//   xhttp get request for /js/comm-fridge-data.json
		//   xhttp get request for /js/comm-fridge-items.json
	}
}
let fridges;
let items;

function retriveFridgeData() {
	xhttp = new XMLHttpRequest(); // create a new XMLHttpRequest object
	xhttp.onreadystatechange = processFridgeData; // specify what should happen when the server sends a response

	// TODO: set the URL to be http://localhost:8000/students
	xhttp.open("GET", "http://localhost:8000/fridges", true); // open a connection to the server using the GET protocol

	// TODO: add an application/json Accept request header for the request
	xhttp.setRequestHeader("Accept", "application/json");

	xhttp.send(); // send the request to the server
}

// process the response from the AJAX call. Specifically, use the JSON data retrieved to populate the table in the HTML page
function processFridgeData() {
	if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {
		fridges = JSON.parse(xhttp.responseText);
		console.log(fridges);
		retriveItemData();
		//   displayFridges(); 
		//   populateStudents(data);
	}
	else {
		console.log("There was a problem with the request.");
	}
}


function retriveItemData() {
	xhttp = new XMLHttpRequest(); // create a new XMLHttpRequest object
	xhttp.onreadystatechange = processItemData; // specify what should happen when the server sends a response

	// TODO: set the URL to be http://localhost:8000/students
	xhttp.open("GET", "http://localhost:8000/items", true); // open a connection to the server using the GET protocol

	// TODO: add an application/json Accept request header for the request
	xhttp.setRequestHeader("Accept", "application/json");

	xhttp.send(); // send the request to the server
}

// process the response from the AJAX call. Specifically, use the JSON data retrieved to populate the table in the HTML page
function processItemData() {
	if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {
		items = JSON.parse(xhttp.responseText);
		console.log(items);
		//   displayFridges();
		displayFridges();
		//   populateStudents(data);
	}
	else {
		console.log("There was a problem with the request.");
	}
}

function displayFridges(pageId) {
	let fridgesSection = document.getElementById("fridges");
	let header = document.createElement("h1");
	header.textContent = "Available fridges";
	fridgesSection.appendChild(header);

	for (let i = 0; i < fridges.length; i++) {
		let fridgeData = document.createElement("div");
		fridgeData.id = "fridge_" + i;

		let fridgeContent = "<img src='images/fridge.svg'></span>";
		fridgeContent += "<span><strong>" + fridges[i].name + "</strong></span>";
		fridgeContent += "<span>" + fridges[i].address.street + "</span>";
		fridgeContent += "<span>" + fridges[i].contact_phone + "</span>"

		fridgeData.innerHTML = fridgeContent;

		fridgeData.addEventListener("click", function (event) {
			let fridgeID = event.currentTarget.id.split("_")[1];
			displayFridgeContents(parseInt(fridgeID));
		});
		var button = document.createElement("BUTTON");
		button.innerHTML = "Edit";
		button.addEventListener('click', function (event) {
			event.preventDefault();
			window.location = 'fridges/editFridge?fridgeID=fg-' + i;
		});
		// 	appendTo.appendChild(b);
		//   }
		fridgeData.appendChild(button);

		fridgesSection.appendChild(fridgeData);
	}
}

let currentFridgeID;
function displayFridgeContents(fridgeID) {
	// retriveItemData();
	currentFridgeID = parseInt(fridgeID)+1;
	document.getElementById("frigeHeading").innerHTML = "Items in the " + fridges[fridgeID].name;
	let bioInformation = "<span id='fridge_name'>" + fridges[fridgeID].name + "</span><br />" + fridges[fridgeID].address.street + "<br />" + fridges[fridgeID].contact_phone;

	document.getElementById("left-column").firstElementChild.innerHTML = bioInformation;
	let capacity = ((fridges[fridgeID].items.length) / (parseInt(fridges[fridgeID].can_accept_items)));
	capacity = Math.round(capacity * 100);

	document.getElementById("meter").innerHTML = "<span style='width: " + (capacity + 14.2) + "%'>" + capacity + "%</span>";

	populateLeftMenu(fridgeID);

	let middleColumn = document.getElementById("middle-column");
	console.log(fridgeID);

	for (let element of fridges[fridgeID].items) {
		let itemID = parseInt(element.id);
		let item = items[itemID];

		let mdItem = document.createElement("div");
		mdItem.className = "item " + item.type;
		mdItem.id = "item-" + itemID;
		mdItem.innerHTML = "<img src='" + item.img + "' width='100px' height='100px'; />";

		let itemDetails = document.createElement("div");
		itemDetails.id = "item_details";
		itemDetails.innerHTML = "<p id='nm-" + itemID + "'>" + item.name + "</p><p>Quantity: <span id='qt-" + itemID + "'>" + element.quantity + "</span></p><p>Pickup item:</p>";

		let buttonsArea = document.createElement("div");
		buttonsArea.className = "pick_button";
		buttonsArea.id = "pickbtn-" + itemID;

		let increaseButton = document.createElement("button");
		increaseButton.className = "button-plus";
		increaseButton.innerHTML = "<i class='fas fa-plus'></i>";
		increaseButton.addEventListener("click", processIncrease);

		let decreaseButton = document.createElement("button");
		decreaseButton.className = "button-minus";
		decreaseButton.innerHTML = "<i class='fas fa-minus'></i>";
		decreaseButton.addEventListener("click", processDecrease);

		let amount = document.createElement("span");
		amount.className = "amount";
		amount.id = "amount-" + itemID;
		amount.textContent = "0";

		buttonsArea.appendChild(increaseButton);
		buttonsArea.appendChild(amount);
		buttonsArea.appendChild(decreaseButton);

		itemDetails.appendChild(buttonsArea);
		mdItem.appendChild(itemDetails);
		middleColumn.appendChild(mdItem);
	}
	document.getElementById("fridges").classList.add("hidden");
	document.getElementById("fridge_details").classList.remove("hidden");
}

function processIncrease(event) {
	let elementId = event.currentTarget.parentElement.id;
	let numID = elementId.split("-")[1];
	let amount = parseInt(document.getElementById("amount-" + numID).textContent);
	let quantity = parseInt(document.getElementById("qt-" + numID).textContent);
	let name = document.getElementById("nm-" + numID).textContent;

	let elementExists = document.getElementById("pk-item-" + numID);

	if (amount < quantity) {
		document.getElementById("amount-" + numID).innerHTML = amount + 1;

		if (elementExists == null) {
			let li = document.createElement("li");
			li.setAttribute("id", "pk-item-" + numID);
			li.innerHTML = "<span>" + (amount + 1) + "</span> x " + name;
			document.getElementById("items_picked").appendChild(li);
		}
		else {
			document.getElementById("pk-item-" + numID).innerHTML = "<span>" + (amount + 1) + "</span> x " + name;
		}
	}
	let picked_count = document.getElementById("items_picked").childElementCount;
	let button = document.querySelector("#submmit_btn");
	if (picked_count > 0) {
		button.classList.remove("hidden");
	} else {
		button.classList.add("hidden");
	}
}
function processDecrease(event) {
	let elementId = event.currentTarget.parentElement.id;
	let numID = elementId.split("-")[1];

	let amount = parseInt(document.getElementById("amount-" + numID).textContent);
	let quantity = parseInt(document.getElementById("qt-" + numID).textContent);
	let elementExists = document.getElementById("pk-item-" + numID);
	let name = document.getElementById("nm-" + numID).textContent;

	if (amount > 0) {
		document.getElementById("amount-" + numID).innerHTML = parseInt(amount) - 1;
		if (elementExists == null) {
			let li = document.createElement("li");
			li.setAttribute("id", "pk-item-" + numID);
			li.innerHTML = "<span>" + parseInt(amount) - 1 + "</span> x " + name;
			document.getElementById("items_picked").appendChild(li);
		}
		else {
			if (amount == 1) {
				let item = document.getElementById("pk-item-" + numID);
				console.log("item-" + numID)
				item.remove();
			}
			else {
				document.getElementById("pk-item-" + numID).innerHTML = "<span>" + (amount - 1) + "</span> x " + name;
			}
		}
	}
	let picked_count = document.getElementById("items_picked").childElementCount;
	let button = document.querySelector("#submmit_btn");
	if (picked_count > 0) {
		button.classList.remove("hidden");
	} else {
		button.classList.add("hidden");
	}
}

function sendDelete() {
	let picked = document.getElementById("items_picked").children;
	let fridgeID = "fg-" + currentFridgeID;
	console.log("FridgeID:" + fridgeID);
	let url = "http://localhost:8000/fridges/"+fridgeID+"/items/?";
	for (let itm of picked) {
		let itmID = itm.id.substring(8);
		
		url+=itmID;
		url+= "&";
		console.log("URL:" + url);
		// pk-item-
	}
	


	xhttp = new XMLHttpRequest(); // create a new XMLHttpRequest object

	// specify what should happen when the server sends a response back
	xhttp.onreadystatechange = function () {
		if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {
			// let data = JSON.parse(xhttp.responseText);
			// console.log(data);
			console.log("==============================");
			// populateStudents();
			console.log("The category data was successfully updated!");
			console.log(xhttp.responseText);
			let message = document.querySelector("#respArea");
			message.innerHTML = "Items picked up successfully";
			message.classList.remove("hidden");
			setTimeout(() => {
				message.classList.add("hidden");
			}, 3000);
		}
		else {
			let message = document.querySelector("#respArea");
			message.innerHTML = "Failed to pickup, check console for errors";
			message.classList.remove("hidden");
			setTimeout(() => {
				message.classList.add("hidden");
			}, 3000);
			console.log(xhttp.responseText);
		}
	};
	
	console.log("url: " + url);
	xhttp.open("DELETE", url, true);
	// *** important: both POST and PUT expect a content-type to be set for the content. If this is missing, then the data will not be received on the server-side
	//xhttp.setRequestHeader("Content-type", "application/json");

	// *** important: if this header is not set, then the server would not be able to use the "Accept" header value to determine the type of resources to respond with
	//xhttp.setRequestHeader("Accept", "application/json");

	// *** important: the JSON object must be stringified before it is sent in the body of the response
	xhttp.send(); // send the request to the server
}


function populateLeftMenu(fridgeID) {
	let categories = {};
	// retriveItemData();
	for (let element of fridges[fridgeID].items) {
		//console.log(element);
		let itemID = parseInt(element.id);
		let item = items[itemID];

		let type = item.type;
		if (type in categories == false) {
			categories[type] = 1;
		}
		else {
			categories[type]++;
		}
	}

	let leftMenu = document.getElementById("categories");
	for (const [key, value] of Object.entries(categories)) {
		let label = key.charAt(0).toUpperCase() + key.slice(1);
		let listItem = document.createElement("li");
		listItem.id = key;
		listItem.className = "category";
		listItem.textContent = label + " (" + value + ")";

		listItem.addEventListener("click", filterMiddleView);
		leftMenu.appendChild(listItem);
	}
}

function filterMiddleView(event) {
	let elements = document.getElementById("middle-column").children;
	let category = event.target.id;

	for (let i = 0; i < elements.length; i++) {
		let item = elements[i];
		if (!item.classList.contains(category)) {
			item.classList.add("hidden");
		}
		else {
			item.classList.remove("hidden");
		}
	}
}
