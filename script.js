// ==========================
// LANGUAGE TRANSLATIONS
// ==========================

const translations = {

en:{
title:"Government Scheme Finder",
login:"Login",
register:"Register",
phone:"Enter Phone Number",
age:"Age",
gender:"Gender",
income:"Income",
category:"Category",

male:"Male",
female:"Female",
other:"Other",

student:"Student",
farmer:"Farmer",
senior:"Senior Citizen",
women:"Women",
orphan:"Orphan",
pwd:"PWD",

find:"Find Schemes",
voice:"Voice Assistant"
},

hi:{
title:"सरकारी योजना खोजक",
login:"लॉगिन",
register:"पंजीकरण",
phone:"फोन नंबर दर्ज करें",
age:"आयु",
gender:"लिंग",
income:"आय",
category:"श्रेणी",

male:"पुरुष",
female:"महिला",
other:"अन्य",

student:"छात्र",
farmer:"किसान",
senior:"वरिष्ठ नागरिक",
women:"महिला",
orphan:"अनाथ",
pwd:"दिव्यांग",

find:"योजना खोजें",
voice:"वॉइस सहायक"
},

mr:{
title:"सरकारी योजना शोधक",
login:"लॉगिन",
register:"नोंदणी",
phone:"फोन नंबर टाका",
age:"वय",
gender:"लिंग",
income:"उत्पन्न",
category:"श्रेणी",

male:"पुरुष",
female:"महिला",
other:"इतर",

student:"विद्यार्थी",
farmer:"शेतकरी",
senior:"ज्येष्ठ नागरिक",
women:"महिला",
orphan:"अनाथ",
pwd:"दिव्यांग",

find:"योजना शोधा",
voice:"व्हॉइस सहाय्यक"
}

};


// ==========================
// SET LANGUAGE
// ==========================

function setLanguage(lang){

localStorage.setItem("language",lang);

window.location.href="login.html";

}


// ==========================
// APPLY LANGUAGE
// ==========================

function applyLanguage(){

let lang = localStorage.getItem("language") || "en";

let t = translations[lang];

if(document.getElementById("title"))
document.getElementById("title").innerText=t.title;

if(document.getElementById("loginText"))
document.getElementById("loginText").innerText=t.login;

if(document.getElementById("registerText"))
document.getElementById("registerText").innerText=t.register;

if(document.getElementById("phone"))
document.getElementById("phone").placeholder=t.phone;

if(document.getElementById("ageLabel"))
document.getElementById("ageLabel").innerText=t.age;

if(document.getElementById("genderLabel"))
document.getElementById("genderLabel").innerText=t.gender;

if(document.getElementById("incomeLabel"))
document.getElementById("incomeLabel").innerText=t.income;

if(document.getElementById("categoryLabel"))
document.getElementById("categoryLabel").innerText=t.category;

if(document.getElementById("findBtn"))
document.getElementById("findBtn").innerText=t.find;

if(document.getElementById("voiceBtn"))
document.getElementById("voiceBtn").innerText=t.voice;


// gender dropdown

if(document.getElementById("gender")){

document.getElementById("gender").innerHTML=`
<option value="all">All</option>
<option value="male">${t.male}</option>
<option value="female">${t.female}</option>
<option value="other">${t.other}</option>
`;

}


// category dropdown

if(document.getElementById("category")){

document.getElementById("category").innerHTML=`
<option value="all">All</option>
<option value="student">${t.student}</option>
<option value="farmer">${t.farmer}</option>
<option value="senior">${t.senior}</option>
<option value="women">${t.women}</option>
<option value="orphan">${t.orphan}</option>
<option value="pwd">${t.pwd}</option>
`;

}

}


// ==========================
// REGISTER USER
// ==========================

function registerUser(){

let phone=document.getElementById("phone").value;

if(phone==""){
alert("Enter phone number");
return;
}

let users=JSON.parse(localStorage.getItem("users")) || [];

if(users.includes(phone)){
alert("User already registered");
return;
}

users.push(phone);

localStorage.setItem("users",JSON.stringify(users));

alert("Registration successful");

window.location.href="login.html";

}


// ==========================
// LOGIN USER
// ==========================

function loginUser(){

let phone=document.getElementById("phone").value;

let users=JSON.parse(localStorage.getItem("users")) || [];

if(users.includes(phone)){

alert("Login successful");

window.location.href="index.html";

}
else{

alert("User not registered");

}

}


// ==========================
// SPEAK TEXT
// ==========================

function speakText(text){

let msg=new SpeechSynthesisUtterance(text);

msg.lang="en-IN";

speechSynthesis.cancel();
speechSynthesis.speak(msg);

}


// ==========================
// FIND SCHEMES
// ==========================

async function findSchemes(){

let age=document.getElementById("age").value;
let gender=document.getElementById("gender").value;
let income=document.getElementById("income").value;
let category=document.getElementById("category").value;

let response=await fetch("schemes.json");
let schemes=await response.json();

let result="";
let names=[];

schemes.forEach(scheme=>{

if(
(age=="" || age>=scheme.min_age) &&
(income=="" || scheme.income_limit==0 || income<=scheme.income_limit) &&
(gender=="all" || scheme.gender=="all" || scheme.gender==gender) &&
(category=="all" || scheme.category=="all" || scheme.category==category)
){

result+=`
<div class="scheme">
<h3>${scheme.name}</h3>
<p>${scheme.description}</p>
<p><b>Last Date:</b> ${scheme.lastDate}</p>
</div>
`;

names.push(scheme.name);

}

});

if(result==""){
result="<p>No schemes found</p>";
}

document.getElementById("results").innerHTML=result;


// voice output

let message="";

if(names.length>0){
message="Available schemes are "+names.join(", ");
}
else{
message="Sorry no schemes found";
}

speakText(message);

}


// ==========================
// VOICE ASSISTANT
// ==========================

function startVoice(){

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if(!SpeechRecognition){
alert("Voice recognition not supported. Use Chrome.");
return;
}

const recognition=new SpeechRecognition();

recognition.lang="en-IN";

recognition.start();

recognition.onstart=function(){

document.getElementById("voiceText").innerText="Listening...";

};

recognition.onresult=function(event){

let speech=event.results[0][0].transcript.toLowerCase();

document.getElementById("voiceText").innerText="You said: "+speech;


if(speech.includes("student"))
document.getElementById("category").value="student";

if(speech.includes("farmer"))
document.getElementById("category").value="farmer";

if(speech.includes("senior"))
document.getElementById("category").value="senior";

if(speech.includes("women"))
document.getElementById("category").value="women";

if(speech.includes("orphan"))
document.getElementById("category").value="orphan";

if(speech.includes("pwd"))
document.getElementById("category").value="pwd";

if(speech.includes("female"))
document.getElementById("gender").value="female";

if(speech.includes("male"))
document.getElementById("gender").value="male";


findSchemes();

};

}