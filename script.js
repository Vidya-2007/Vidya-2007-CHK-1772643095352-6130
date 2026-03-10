// ==========================
// LANGUAGE TRANSLATIONS
// ==========================
const translations = {
  en: {
    title: "Government Scheme Finder",
    login: "Login",
    register: "Register",
    name: "Enter Name",
    phone: "Enter Number",
    password: "Enter Password",
    age: "Age",
    gender: "Gender",
    caste: "Caste",
    location: "Location",
    income: "Income",
    category: "Category",
    male: "Male",
    female: "Female",
    other: "Other",
    student: "Student",
    farmer: "Farmer",
    senior: "Senior Citizen",
    women: "Women",
    orphan: "Orphan",
    pwd: "PWD",
    find: "Find Schemes",
    voice: "Voice Assistant"
  }
};

// ==========================
// SET LANGUAGE
// ==========================
function setLanguage(lang) {
  localStorage.setItem("language", lang);
  window.location.href = "login.html";
}

// ==========================
// APPLY LANGUAGE
// ==========================
function applyLanguage() {
  let lang = localStorage.getItem("language") || "en";
  let t = translations[lang];

  if (document.getElementById("title")) document.getElementById("title").innerText = t.title;
  if (document.getElementById("name")) document.getElementById("name").placeholder = t.name;
  if (document.getElementById("phone")) document.getElementById("phone").placeholder = t.phone;
  if (document.getElementById("password")) document.getElementById("password").placeholder = t.password;
  if (document.getElementById("age")) document.getElementById("age").placeholder = t.age;
  if (document.getElementById("gender")) document.getElementById("gender").placeholder = t.gender;
  if (document.getElementById("caste")) document.getElementById("caste").placeholder = t.caste;
  if (document.getElementById("location")) document.getElementById("location").placeholder = t.location;
  if (document.getElementById("category")) document.getElementById("category").placeholder = t.category;
}

// ==========================
// REGISTER USER
// ==========================
function registerUser() {
  let name = document.getElementById("name").value.trim();
  let phone = document.getElementById("phone").value.trim();
  let password = document.getElementById("password").value.trim();

  if (name === "" || password === "") {
    alert("Please fill all required fields");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];
  let exists = users.find(user => user.name.toLowerCase() === name.toLowerCase());

  if (exists) {
    alert("User already registered");
    return;
  }

  users.push({ name, phone, password });
  localStorage.setItem("users", JSON.stringify(users));
  alert("Registration successful!");
  window.location.href = "login.html";
}

// ==========================
// LOGIN USER
// ==========================
function loginUser() {
  let name = document.getElementById("phone").value.trim(); // login uses phone field as name
  let password = document.getElementById("password").value.trim();

  let users = JSON.parse(localStorage.getItem("users")) || [];
  let validUser = users.find(user => user.name === name && user.password === password);

  if (validUser) window.location.href = "index.html";
  else alert("Wrong Name or Password");
}

// ==========================
// ADMIN LOGIN
// ==========================
function adminLogin() {
  let username = document.getElementById("adminUser").value;
  let password = document.getElementById("adminPass").value;

  if (username === "admin" && password === "admin123") window.location.href = "admin.html";
  else alert("Invalid admin login");
}

// ==========================
// SHOW USERS IN ADMIN PANEL
// ==========================
function showUsers() {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let output = "";

  if (users.length === 0) output = "No users registered";
  else {
    users.forEach(user => {
      output += `
      <div class="scheme">
        <b>Name:</b> ${user.name} <br>
        <b>Number:</b> ${user.phone || "N/A"} <br>
        <b>Password:</b> ${user.password}
      </div>`;
    });
  }

  document.getElementById("userList").innerHTML = output;
}

// ==========================
// VOICE ASSISTANT
// ==========================
function startVoice() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Voice recognition not supported. Use Chrome.");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "en-IN";
  recognition.interimResults = false;

  recognition.onstart = function() {
    document.getElementById("voiceText").innerText = "Listening...";
  };

  recognition.onresult = function(event) {
    let speech = event.results[0][0].transcript.toLowerCase();
    document.getElementById("voiceText").innerText = "You said: " + speech;

    // Fill gender
    if (speech.includes("female")) document.getElementById("gender").value = "female";
    if (speech.includes("male")) document.getElementById("gender").value = "male";

    // Fill category
    if (speech.includes("student")) document.getElementById("category").value = "student";
    if (speech.includes("farmer")) document.getElementById("category").value = "farmer";
    if (speech.includes("senior")) document.getElementById("category").value = "senior";
    if (speech.includes("women")) document.getElementById("category").value = "women";
    if (speech.includes("orphan")) document.getElementById("category").value = "orphan";
    if (speech.includes("pwd")) document.getElementById("category").value = "PWD";

    // Fill numbers
    let numbers = speech.match(/\d+/g);
    if (numbers) {
      if(numbers[0]) document.getElementById("age").value = numbers[0];
      if(numbers[1]) document.getElementById("income").value = numbers[1];
    }

    // Trigger scheme search
    setTimeout(() => { findSchemes(true); }, 500);
  };

  recognition.onerror = function(event) {
    console.error("Voice recognition error:", event.error);
    document.getElementById("voiceText").innerText = "Voice recognition failed.";
  };

  recognition.start();
}

// ==========================
// FIND SCHEMES
// ==========================
async function findSchemes(isVoice=false) {
  let age = document.getElementById("age").value;
  let gender = document.getElementById("gender").value;
  let caste = document.getElementById("caste").value.toLowerCase();
  let location = document.getElementById("location").value.toLowerCase();
  let income = document.getElementById("income").value;
  let category = document.getElementById("category").value.toLowerCase();

  let response;
  try {
    response = await fetch("schemes.json");
  } catch (e) {
    alert("Cannot load schemes.json. Run on a local server.");
    return;
  }

  let schemes = await response.json();
  let resultHTML = "";
  let schemeNames = [];

  schemes.forEach(scheme => {
    if (
      (age === "" || age >= scheme.min_age) &&
      (income === "" || scheme.income_limit === 0 || income <= scheme.income_limit) &&
      (gender === "" || scheme.gender === "all" || scheme.gender === gender) &&
      (category === "" || scheme.category === "all" || scheme.category.toLowerCase() === category) &&
      (location === "" || scheme.state === "all" || scheme.state.toLowerCase() === location)
    ) {
      resultHTML += `
      <div class="scheme">
        <h3>${scheme.name}</h3>
        <p>${scheme.description}</p>
        <p><b>Last Date:</b> ${scheme.lastDate}</p>
        <p><b>Category:</b> ${scheme.category}, <b>Gender:</b> ${scheme.gender}</p>
      </div>`;
      schemeNames.push(scheme.name);
    }
  });

  if (resultHTML === "") resultHTML = "<p>No schemes found</p>";
  document.getElementById("results").innerHTML = resultHTML;

  // Convert text to speech
  if (isVoice && schemeNames.length > 0) {
    let message = "Available schemes are: " + schemeNames.join(", ");
    speakText(message);
  }
}

// ==========================
// TEXT TO SPEECH
// ==========================
function speakText(text) {
  if (!('speechSynthesis' in window)) {
    alert("Text-to-Speech not supported on this browser.");
    return;
  }

  if (speechSynthesis.speaking) speechSynthesis.cancel();

  let utter = new SpeechSynthesisUtterance(text);
  utter.rate = 1;
  utter.pitch = 1;
  utter.volume = 1;

  // Select a proper voice (en-IN if available)
  const voices = speechSynthesis.getVoices();
  utter.voice = voices.find(v => v.lang === 'en-IN') || voices[0];

  speechSynthesis.speak(utter);
}