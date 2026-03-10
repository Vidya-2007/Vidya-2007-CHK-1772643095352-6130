// ==========================
// LANGUAGE TRANSLATIONS
// ==========================

const translations = {

en:{
title:"Government Scheme Finder",
login:"Login",
register:"Register",
name:"Enter Name",
phone:"Enter Number",
password:"Enter Password",
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
name:"नाम दर्ज करें",
phone:"मोबाइल नंबर दर्ज करें",
password:"पासवर्ड दर्ज करें",
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
name:"नाव टाका",
phone:"मोबाइल नंबर टाका",
password:"पासवर्ड टाका",
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
// ==========================
// APPLY LANGUAGE
// ==========================
function applyLanguage() {
    let lang = localStorage.getItem("language") || "en";
    let t = translations[lang];

    if (document.getElementById("title")) document.getElementById("title").innerText = t.title;

    // Login page
    if (document.getElementById("phone")) document.getElementById("phone").placeholder = t.name; // <-- Enter Name
    if (document.getElementById("password")) document.getElementById("password").placeholder = t.password;

    // Registration page
    if (document.getElementById("name")) document.getElementById("name").placeholder = t.name; 
    if (document.getElementById("phone") && window.location.href.includes("register.html")) {
        document.getElementById("phone").placeholder = t.phone; // Registration number field
    }
}

// ==========================
// REGISTER USER
// ==========================

function registerUser(){
    let name = document.getElementById("name").value.trim();
    let phone = document.getElementById("phone").value.trim();
    let password = document.getElementById("password").value.trim();

    if(name=="" || password==""){
        alert("Please fill all required fields");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    let exists = users.find(user => user.name.toLowerCase() === name.toLowerCase());

    if(exists){
        alert("User already registered");
        return;
    }

    // Store name + number + password
    users.push({
        name:name,
        phone:phone,
        password:password
    });

    localStorage.setItem("users",JSON.stringify(users));
    alert("Registration successful!");
    window.location.href="login.html";
}


// ==========================
// LOGIN USER (NAME + PASSWORD)
// ==========================

function loginUser(){
    let name = document.getElementById("phone").value.trim(); // login still uses phone field as name
    let password = document.getElementById("password").value.trim();

    let users = JSON.parse(localStorage.getItem("users")) || [];

    let validUser = users.find(user => user.name===name && user.password===password);

    if(validUser){
        window.location.href="index.html";
    } else {
        alert("Wrong Name or Password");
    }
}


// ==========================
// ADMIN LOGIN
// ==========================

function adminLogin(){
    let username = document.getElementById("adminUser").value;
    let password = document.getElementById("adminPass").value;

    if(username==="admin" && password==="admin123"){
        window.location.href="admin.html";
    } else {
        alert("Invalid admin login");
    }
}


// ==========================
// SHOW USERS IN ADMIN PANEL
// ==========================

function showUsers(){
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let output="";

    if(users.length===0){
        output="No users registered";
    } else {
        users.forEach(function(user){
            output+=`
            <div class="scheme">
                <b>Name:</b> ${user.name} <br>
                <b>Number:</b> ${user.phone || "N/A"} <br>
                <b>Password:</b> ${user.password}
            </div>
            `;
        });
    }

    document.getElementById("userList").innerHTML=output;
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

    let result="";
    let schemeNames=[];

    schemes.forEach(function(scheme){
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
            schemeNames.push(scheme.name);
        }
    });

    if(result==="") result="<p>No schemes found</p>";

    document.getElementById("results").innerHTML=result;

    let message = schemeNames.length>0 ? "Available schemes are "+schemeNames.join(", ") : "Sorry no schemes found";
    speakText(message);
}


// ==========================
// TEXT TO SPEECH
// ==========================

function speakText(text){
    let msg = new SpeechSynthesisUtterance(text);
    msg.lang="en-IN";
    speechSynthesis.cancel();
    speechSynthesis.speak(msg);
}