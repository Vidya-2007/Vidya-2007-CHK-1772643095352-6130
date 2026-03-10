// ==========================
// GLOBAL VOICES
// ==========================

let voices = [];

window.speechSynthesis.onvoiceschanged = function(){
voices = speechSynthesis.getVoices();
};


// ==========================
// SPEAK TEXT FUNCTION
// ==========================

function speakText(text){

if(!text) return;

let msg = new SpeechSynthesisUtterance(text);

msg.lang = "en-IN";
msg.rate = 1;
msg.pitch = 1;

if(voices.length > 0){
msg.voice = voices.find(v => v.lang.includes("en")) || voices[0];
}

speechSynthesis.cancel();
speechSynthesis.speak(msg);

}



// ==========================
// REGISTER USER
// ==========================

function registerUser(){

let phone = document.getElementById("phone").value;

if(phone == ""){
alert("Enter phone number");
return;
}

let users = JSON.parse(localStorage.getItem("users")) || [];

if(users.includes(phone)){
alert("User already registered");
return;
}

users.push(phone);

localStorage.setItem("users", JSON.stringify(users));

alert("Registration successful");

window.location.href = "login.html";

}



// ==========================
// LOGIN USER
// ==========================

function loginUser(){

let phone = document.getElementById("phone").value;

let users = JSON.parse(localStorage.getItem("users")) || [];

if(users.includes(phone)){

alert("Login successful");

window.location.href = "index.html";

}
else{

alert("User not registered");

}

}



// ==========================
// ADMIN LOGIN
// ==========================

function adminLogin(){

let username = document.getElementById("adminUser").value;
let password = document.getElementById("adminPass").value;

if(username === "admin" && password === "admin123"){

window.location.href = "admin.html";

}
else{

alert("Invalid admin login");

}

}



// ==========================
// FIND SCHEMES
// ==========================

async function findSchemes(){

let age = document.getElementById("age").value;
let gender = document.getElementById("gender").value;
let income = document.getElementById("income").value;
let category = document.getElementById("category").value;

let response = await fetch("schemes.json");
let schemes = await response.json();

let result = "";
let schemeNames = [];

schemes.forEach(scheme => {

if(
(age == "" || age >= scheme.min_age) &&
(income == "" || scheme.income_limit == 0 || income <= scheme.income_limit) &&
(gender == "all" || scheme.gender == "all" || scheme.gender == gender) &&
(category == "all" || scheme.category == "all" || scheme.category == category)
){

result += `
<div class="scheme">
<h3>${scheme.name}</h3>
<p>${scheme.description}</p>
<p><b>Last Date:</b> ${scheme.lastDate}</p>
</div>
`;

schemeNames.push(scheme.name);

}

});

if(result === ""){
result = "<p>No schemes found</p>";
}

document.getElementById("results").innerHTML = result;


// ==========================
// VOICE OUTPUT
// ==========================

let message = "";

if(schemeNames.length > 0){
message = "Available schemes are " + schemeNames.join(", ");
}
else{
message = "Sorry, no schemes found.";
}

speakText(message);

}



// ==========================
// VOICE ASSISTANT
// ==========================

function startVoice(){

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if(!SpeechRecognition){
alert("Voice recognition not supported. Please use Google Chrome.");
return;
}

const recognition = new SpeechRecognition();

recognition.lang = "en-IN";

recognition.start();

recognition.onstart = function(){

document.getElementById("voiceText").innerText = "Listening...";

};


recognition.onresult = function(event){

let speech = event.results[0][0].transcript.toLowerCase();

document.getElementById("voiceText").innerText = "You said: " + speech;


// detect keywords

if(speech.includes("student")){
document.getElementById("category").value = "student";
}

if(speech.includes("farmer")){
document.getElementById("category").value = "farmer";
}

if(speech.includes("senior")){
document.getElementById("category").value = "senior";
}

if(speech.includes("women")){
document.getElementById("category").value = "women";
}

if(speech.includes("orphan")){
document.getElementById("category").value = "orphan";
}

if(speech.includes("pwd")){
document.getElementById("category").value = "pwd";
}

if(speech.includes("female") || speech.includes("woman")){
document.getElementById("gender").value = "female";
}

if(speech.includes("male")){
document.getElementById("gender").value = "male";
}


// search schemes

findSchemes();

};

}