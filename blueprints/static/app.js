document.addEventListener('DOMContentLoaded', function(){ //event fires when html is loaded, diif between loaded and load
const forms = document.forms;//stores all form elements
//add get music-------------------------------------------------------------------------------------
let addForm = forms['add_music'];

//query Selector
//const music_upload = document.querySelector("#add_music div");
const list = document.querySelector('#music_list ul')//ul nicht ui, wer lesen kann ist klar im vorteil
addForm.addEventListener('click',function(event) {
event.preventDefault(); //cancels event action pass auf was du abschreibst!!!!
console.log(event.target.className)
if(event.target.className=="add_music"){
  //async
(async() => {
let music_dic = await get_music();
//finding allready dissplayed once
const in_class_play = document.getElementsByClassName("play");
let in_list = []
for(i=0;i<in_class_play.length;i++){
in_list.push(in_class_play[i].value);
};
let new_music_dic = music_dic;
for(i=0;i<in_list.length; i++){
  for(j=0;j<music_dic.length;j++){
  if(in_list[i] == (music_dic[j])){new_music_dic.splice(j,1);};//endif
  };//endfor
};//end for
music_dic=new_music_dic;
if(!music_dic){}
//if dic is not empty
else{
music_dic.forEach((element,index,array)=> {  
const value = element
const li = document.createElement('li'); // li to ui
const playBtn = document.createElement('button');
const playLokalBtn = document.createElement("button");
//add text content
playBtn.textContent = value;
playLokalBtn.textContent="download"
//add classes
playBtn.classList.add('play');
playBtn.setAttribute("onclick","play_on_host(value)");//ohne "" bei der function würde der return der function ausgeben werden
playBtn.setAttribute("value",value);
playLokalBtn.setAttribute("onclick","play_on_local_function(value)");
playLokalBtn.setAttribute("value",value);
//append to DOM
li.appendChild(playLokalBtn);
li.appendChild(playBtn);
list.appendChild(li);
});//end forEach
}//else
})()//ende async
}//end add_music
});//ende_get_music

//login + user
const auth = document.querySelector('#auth div')//ul nicht ui, wer lesen kann ist klar im vorteil//auth = id
auth.addEventListener('click',function(event){
event.preventDefault();
  console.log(event.target.className)
  if(event.target.className == 'login'){
    //login
    const myNode = event.target.parentNode;
      while(myNode.lastElementChild){
        myNode.removeChild(myNode.lastElementChild);
      }
    //make_login_fields
    const login = document.createElement("button");
    const logout = document.createElement("button");
    const username=document.createElement("input");
    const password=document.createElement("input");
    username.setAttribute("id","username");
    username.setAttribute("placeholder","username")
    password.setAttribute("id","password")
    password.setAttribute("placeholder","password")
    login.textContent = "login";
    logout.textContent = "logout";
    login.className="login_function";
    logout.classList="logout";
    //glue
    auth.appendChild(username);
    auth.appendChild(password);
    auth.appendChild(login);
    auth.appendChild(logout);
  }//end login umabu
  if(event.target.className =="login_function"){
    //login_check
    (async() => {
    const bool= await login_function();
    if(bool==true){
      const myNode = event.target.parentNode;
      while(myNode.lastElementChild){
        myNode.removeChild(myNode.lastElementChild);
      }
      //neu
      const logout = document.createElement("button");
      const login = document.createElement("button");
      logout.textContent = "logout";
      login.textContent = "login";
      login.className="login"
      logout.className="logout"

      //glue
      auth.appendChild(login);
      auth.appendChild(logout);
    }//end if 
  })()//end asnc
  }//end loginfunctioon
  else if(event.target.className=="logout"){
    console.log("logout")
    logout_function();
    }else{};
});//end logout

//start User
addForm = forms['users'];
const user_list = document.querySelector("#users_list ul");
addForm.addEventListener("click",function(event){
  event.preventDefault();
  console.log(event.target.className);

  //get_all_users
  if(event.target.className =="get_all_users"){
//start asnyc
 (async()=> {
   //get all users
   let all_user = await get_all_users();
   console.log(all_user);
   all_user = all_user['users'];//[i]
   //keine doppelugen
   const in_class_user = document.getElementsByClassName("public_id");
let in_list = []
for(i=0;i<in_class_user.length;i++){
in_list.push(in_class_user[i].innerText);//inner text weil value nicht funktioniert

};
console.log(in_list);
let new_all_user = all_user;//aus new all user wird gesplict
for(i=0;i<in_list.length; i++){
  for(j=0;j<all_user.length;j++){
  if(in_list[i] == (all_user[j]['public_id'])){new_all_user.splice(j,1);};//endif
  };//endfor
};//end for
all_user = new_all_user;
console.log(all_user);
if(!all_user){console.log("no new user");}//empty dic
else{
//for loop for making list 
   for(i = 0;i<all_user.length;i++){
    user = all_user[i];
    const li = document.createElement("li");
    const name = document.createElement("span");
    const email = document.createElement("span");
    const admin = document.createElement("span");
    const public_id = document.createElement("span");
    const deleteBtn = document.createElement("button");
    const promoteBtn = document.createElement("button");
    //values
    name.textContent = " Name: "+user['name'] +" ";
    email.textContent = " email: "+user['email']+" ";
    admin.textContent=" admin: "+user['admin']+" ";
    public_id.textContent=user['public_id'];
    deleteBtn.textContent="delete_user";
    if(user['admin']==true){ promoteBtn.textContent = "demote"; } else{promoteBtn.textContent = "promote"; };
    //classes_attributes
    li.setAttribute("class","user");
    public_id.setAttribute("class","public_id")
    deleteBtn.setAttribute("class","delet_user");
    deleteBtn.setAttribute("value",i);
    promoteBtn.setAttribute("class","promote");
    promoteBtn.setAttribute("value",i);
    li.appendChild(name);
    li.appendChild(email);
    li.appendChild(admin);
    li.appendChild(public_id);
    li.appendChild(deleteBtn);
    li.appendChild(promoteBtn);
    user_list.appendChild(li);
   }//end for
  }//end for not empty dic
 })()//ende asnyc
  }//end if get all users
  if(event.target.className=="make_user"){
    console.log("make_user_if");
    let new_button = event.target;
    new_button.parentNode.removeChild(new_button);
    //felder
    const div = document.createElement("div");
    const email = document.createElement("input");
    const password1 = document.createElement("input");
    const password2 = document.createElement("input");
    const username = document.createElement("input");
    const make_userBtn = document.createElement("button")
    div.setAttribute("id","make_user")
    email.setAttribute("type","email");
    email.setAttribute("id","make_email");
    email.setAttribute("placeholder","email");
    password1.setAttribute("type","password");
    password1.setAttribute("id","make_password1")
    password1.setAttribute("placeholder","password");
    password2.setAttribute("type","password");
    password2.setAttribute("id","make_password2")
    password2.setAttribute("placeholder","reconfirm_password");
    username.setAttribute("id","make_username")
    username.setAttribute("placeholder","username");
    make_userBtn.setAttribute("class","submit_user");//
    make_userBtn.textContent = "submit_user";
    div.appendChild(email);
    div.appendChild(username);
    div.appendChild(password1);
    div.appendChild(password2);
    div.appendChild(make_userBtn);
    addForm = forms['users'];
    addForm.appendChild(div);
  }//end_make user
  if(event.target.className=="submit_user"){
    console.log("submit_user_if");
    (async()=>{
      check = await make_user_function();
      console.log(check);
      if(check==true){
      let new_button = event.target;
      new_button.parentNode.removeChild(new_button);
      let div = document.getElementById("make_user");
      div.parentNode.removeChild(div);
      const make_userBtn=document.createElement("button");
      make_userBtn.setAttribute("class","make_user");
      make_userBtn.textContent="make_user";
      addForm = forms['users'];
      addForm.appendChild(make_userBtn);
      };//end if true
    })()//end async make_user
  };//end submit_user

});//end user_event

})//end DOM system

//get_music
async function get_music(){
    jwt_token = localStorage.getItem('jwt_token')
    console.log("jwt: "+jwt_token)
    if(!jwt_token){
      document.getElementById("message").innerHTML="no token";
      return ""
    };
    var myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer " +jwt_token);

var requestOptions = {method: 'POST',headers: myHeaders,redirect: 'follow',};
const response = await fetch("http://192.168.2.220/get_music", requestOptions)
let result =await response.text();
document.getElementById("message").innerHTML=result;
result = JSON.parse(result)
result = result.music_info;
return result
}//end get_music
//play_on_host
async function play_on_host(value){
  jwt_token = localStorage.getItem('jwt_token');
  var myHeaders = new Headers();
  myHeaders.append("Authorization","Bearer "+jwt_token);
  var requestOptions = {method:'POST',headers: myHeaders,redirect:'follow',};
  fetch("http://192.168.2.220/static/music/"+value,requestOptions)
  .then(response => response.text())
  .then(result => {document.getElementById("now_playing").innerHTML=value;
  document.getElementById("message").innerHTML=result;})
  .catch(error => {
    document.getElementById("now_playing").innerHTML="None";
    document.getElementById("message").innerHTML=error;
    console.log('error', error);
});
}//end play on host
//login
async function login_function(){
  localStorage.removeItem('jwt_token');
  //var
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  let code = btoa(username +":"+ password)
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Basic " +code);
  var requestOptions = {method: 'GET',headers: myHeaders,redirect: 'follow'};
  //login API
  const response = await fetch('http://192.168.2.220/login', requestOptions)
  //jwt from response
  const result =await response.text();
  if(!result || result=="no login"){
    document.getElementById("message").innerHTML=result;
    return false}
  else{
    document.getElementById("message").innerHTML=result;
  jwt_token =  JSON.parse(result);
  jwt_token = jwt_token.access_csrf
  localStorage.setItem('jwt_token',jwt_token);
  //test
  jwt_token = localStorage.getItem('jwt_token');
  console.log("aus storage: "+ jwt_token);
  return true
  }//end_else
}//end login_function
//logout Function
async function logout_function(){
  jwt_token = localStorage.getItem('jwt_token');
  var myHeaders = new Headers();
  myHeaders.append("Authorization","Bearer "+jwt_token);

  var requestOptions = {method: 'DELETE',headers: myHeaders,redirect: 'follow',};
  
  fetch("http://192.168.2.220/logout", requestOptions)
    .then(response => response.text())
    .then(result => {
      console.log(result);
      localStorage.removeItem('jwt_token');
      document.getElementById("message").innerHTML=result;
      window.location.replace('/');
    }).catch(error => document.getElementById("message").innerHTML=error);
}//end logout
//stop_button
async function stop_music(){
  const jwt_token = localStorage.getItem('jwt_token');
  var myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer "+jwt_token);

var requestOptions = {method: 'POST',headers: myHeaders,redirect: 'follow'};

fetch("http://192.168.2.220/stop_music", requestOptions)
  .then(response => response.text())
  .then(result => {document.getElementById("now_playing").innerHTML = "NONE";
                  document.getElementById("message").innerHTML=result;
    }).catch(error => document.getElementById("message").innerHTML=error);
}//end stop music
//get_all_users
async function get_all_users(){
  const jwt_token = localStorage.getItem('jwt_token');
  var myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer "+jwt_token);
var requestOptions = {method: 'GET',headers: myHeaders,redirect: 'follow'};
const response =await fetch("http://192.168.2.220/user", requestOptions);
let result = await response.json(); //macht json in txt
let message = JSON.stringify(result);
document.getElementById("message").innerHTML= message;
return result;
}//end get all user
//upload_file
async function upload_file(){
  let file = document.getElementById("upload_music").files[0];
  
  jwt_token = localStorage.getItem("jwt_token");
  let myHeaders = new Headers();
  myHeaders.append("Authorization","Bearer "+jwt_token) 
  //form data
  var myFormadata=new FormData();
  myFormadata.append("music",file,file.name);

  var requestOptions = {method:'POST',headers:myHeaders,body:myFormadata ,redirect:'follow'};
  fetch("http://192.168.2.220/upload_music",requestOptions)
  .then(response=>response.text())
  .then(result=>{
    document.getElementById("message").innerHTML = result;
    document.getElementById("upload_music").setAttribute("type","text");
    document.getElementById("upload_music").setAttribute("type","file");//kind of bad....
    document.getElementById("message").innerHTML = result;
  }).catch(error=>document.getElementById("message").innerHTML=error);
}//end upload_music
//start make_user
async function make_user_function(){
  console.log("make_user_function()")
  const username = document.getElementById("make_username").value;
  const email = document.getElementById("make_email").value;
  const password1 = document.getElementById("make_password1").value;
  const password2 = document.getElementById("make_password2").value;
  console.log(username,email,password1,password2);
  if(password1!=password2){return false};
  jwt_token = localStorage.getItem('jwt_token');
  var myHeaders = new Headers();
  myHeaders.append("Authorization","Bearer "+jwt_token);
  myHeaders.append("Content-Type", "application/json");
  var raw =JSON.stringify({"email":email,"password":password1,"name":username});
  var requestOptions={method:'POST',headers:myHeaders,body:raw,redirect:'follow'};
fetch("http://192.168.2.220/user",requestOptions)
.then(response=>response.text())
.then(result=>{document.getElementById("message").innerHTML= result;})
.catch(error =>  document.getElementById("message").innerHTML= error);
  return true;
}//end make_user
//play on lokal
async function play_on_local_function(title){ //title über onclick
jwt_token = localStorage.getItem('jwt_token');

var myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer "+jwt_token);

var requestOptions = {method: 'GET',headers: myHeaders,redirect: 'follow'};//ohne body?


fetch("http://192.168.2.220/static/music/" + title, requestOptions)
  .then(response => response.arrayBuffer())
  .then(result => {
    console.log(result);
    document.getElementById("message").innerHTML = result;
    const speicher = new Blob([result],{type:"audio/wav"});
    console.log(window.URL.createObjectURL(speicher));
    //make audio
    const audio = new Audio;
    const figcaption = document.createElement("figcaption");
    const figure = document.createElement("figure");
    //attri
    audio.controls = true;
    audio.src = window.URL.createObjectURL(speicher);
    audio.setAttribute("id",title);
    figcaption.textContent = title;
    //apend
    const place = document.querySelector("#add_music div");
    figure.appendChild(figcaption);
    figure.appendChild(audio);
    place.appendChild(figure);
}).catch(error => console.log('error', error));
}//end play on lokal
