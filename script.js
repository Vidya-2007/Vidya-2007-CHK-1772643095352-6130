// LANGUAGE SELECTION

function setLanguage(lang){

localStorage.setItem("language", lang)

window.location.href="login.html"

}



// REGISTER SYSTEM

let generatedOTP=""

function sendOTP(){

let mobile=document.getElementById("mobile").value

if(mobile.length!==10){
alert("Enter valid mobile number")
return
}

generatedOTP=Math.floor(1000+Math.random()*9000)

alert("Demo OTP: "+generatedOTP)

}



function register(){

let mobile=document.getElementById("mobile").value
let otp=document.getElementById("otp").value
let password=document.getElementById("password").value

let message=document.getElementById("registerMessage")

if(otp==generatedOTP){

localStorage.setItem("userMobile",mobile)
localStorage.setItem("userPassword",password)

message.innerHTML="Registration successful"

setTimeout(()=>{
window.location.href="login.html"
},1000)

}
else{

message.innerHTML="Invalid OTP"

}

}



// LOGIN SYSTEM

function login(){

let mobile=document.getElementById("loginMobile").value
let password=document.getElementById("loginPassword").value

let savedMobile=localStorage.getItem("userMobile")
let savedPassword=localStorage.getItem("userPassword")

let message=document.getElementById("loginMessage")

if(mobile===savedMobile && password===savedPassword){

window.location.href="index.html"

}
else{

message.innerHTML="Invalid login"

}

}



// AADHAAR VERIFICATION

function verifyAadhaar(){

let aadhaar=document.getElementById("aadhaar").value
let status=document.getElementById("aadhaarStatus")

if(aadhaar.length===12){
status.innerHTML="Aadhaar Verified (Demo)"
}
else{
status.innerHTML="Invalid Aadhaar Number"
}

}



// BANK VERIFICATION

function verifyBank(){

let acc=document.getElementById("bank").value
let ifsc=document.getElementById("ifsc").value
let status=document.getElementById("bankStatus")

if(acc.length>8 && ifsc.length===11){
status.innerHTML="Bank Account Verified (Demo)"
}
else{
status.innerHTML="Invalid Bank Details"
}

}



// SCHEME FINDER

async function findSchemes(){

let age=document.getElementById("age").value
let gender=document.getElementById("gender").value
let income=document.getElementById("income").value
let category=document.getElementById("category").value

let results=document.getElementById("results")

// CATEGORY VALIDATION

if(category==="senior" && age<60){
results.innerHTML="Error: Senior citizen schemes require age 60 or above."
return
}

if(category==="student" && age<5){
results.innerHTML="Error: Invalid age for student category."
return
}

if(category==="farmer" && age<18){
results.innerHTML="Error: Farmer schemes require age 18 or above."
return
}

results.innerHTML="Loading..."

try{

let response=await fetch("schemes.json")
let schemes=await response.json()

let output=""

schemes.forEach(scheme=>{

if(
age>=scheme.min_age &&
income<=scheme.income_limit &&
(scheme.gender==="all" || scheme.gender===gender) &&
(scheme.category==="all" || scheme.category===category)
){

output+=`
<div class="scheme">
<h3>${scheme.name}</h3>
<p>${scheme.description}</p>
</div>
`

}

})

if(output===""){
results.innerHTML="No eligible schemes found."
}
else{
results.innerHTML=output
}

}
catch(error){

results.innerHTML="Error loading data"

}

}