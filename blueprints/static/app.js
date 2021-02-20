document.addEventListener('DOMContentLoaded', function(){ //event fires when html is loaded, diif between loaded and load
const forms = document.forms;//stores all form elements
//add get music-------------------------------------------------------------------------------------
const list = document.querySelector('#music_list ul')//ul nicht ui, wer lesen kann ist klar im vorteil
let addForm = forms['add_music'];
addForm.addEventListener('click',function(event) {
event.preventDefault(); //cancels event action pass auf was du abschreibst!!!!
get_current_user_function();
console.log("event: ",event.target.className)
if(event.target.className=="add_music"){
(async() => {
let music_dic = await get_music();
console.log("list");
console.log(list);
while(list.lastElementChild){
  let child = list.lastElementChild;
  child.parentNode.removeChild(child);
}//end clean

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
list.appendChild(document.createElement("hr"));
//delete db button
const response = await get_current_user_function();
const result = response['msg'];
if(result=="admin"){
if(!document.getElementById("delete_music_in_db") && !document.getElementById("end_db_delete")){
const delete_dbBtn = document.createElement("button");
delete_dbBtn.setAttribute("class","delete_music_db");
delete_dbBtn.setAttribute("id","delete_music_in_db");
delete_dbBtn.textContent="delete_music_in_db";
addForm = forms['add_music'];
console.log(addForm);
addForm.prepend(delete_dbBtn);
}//end uniue check
}//end admin check
})()//ende async
if(!document.getElementById("stop_music_id")){
const pfad = document.getElementById("add_music");
const p = document.createElement("p");
const span = document.createElement("span");
const button = document.createElement("button");
//arti
p.textContent="now Playing: ";
span.setAttribute("id","now_playing");
span.textContent="None";
button.setAttribute("id","stop_music_id");
button.setAttribute("onclick","stop_music()");
button.textContent="STOP";
//anhängen
p.appendChild(span);
p.appendChild(button);
pfad.appendChild(p);
};//end stop muisc einfügen
      //upload_div
      if(!document.getElementById("upload_music")){
        const path = document.getElementById("upload_div");
        const input = document.createElement("input");
        const button = document.createElement("button");
        const hr = document.createElement("hr");
        //atri
        input.setAttribute("type","file");
        input.setAttribute("id","upload_music");
        button.setAttribute("class","upload_muisc");
        button.setAttribute("for","upload_music");
        button.setAttribute("onclick","upload_file()");
        button.textContent="upload"
        //add
        path.appendChild(input);
        path.appendChild(button);
        path.appendChild(hr);
      }//end upload_div

}//end add_music
//delet music
if(event.target.className== "delete_music_db"){
  console.log("delete_music_db_if");
  let place = event.target;
  place.parentNode.removeChild(place);
  //neu
  addForm = document.querySelector('#add_music div')
  const div = document.createElement("div");
  const endBtn = document.createElement("button");
  endBtn.textContent= "return";
  endBtn.setAttribute("class","end_db_delete");
  endBtn.setAttribute("id","end_db_delete");
  div.appendChild(endBtn);
  div.appendChild(document.createElement("hr"));
  (async() => { 
  let music_dic = await get_music();
  console.log(music_dic);
  music_dic.forEach((element,index,array) =>{
    const delete_dbBtn = document.createElement("button");
    delete_dbBtn.textContent = element;
    delete_dbBtn.setAttribute("class","sub_db_deleteBtn");
    delete_dbBtn.setAttribute("value",element);
    div.appendChild(delete_dbBtn);
  })//end for each
  div.appendChild(document.createElement("hr"));
  addForm.prepend(div);
  })()//end asnyc
}//end if delete_music_db
if(event.target.className=="end_db_delete"){
  console.log("end_db_delete_if");
  const place = event.target.parentNode;
  place.parentNode.removeChild(place);
}//end_db_delete if
if(event.target.className=="sub_db_deleteBtn"){
  console.log("sub_db_deleteBtn_if");
  const value = event.target.value;
delete_muisc_function(value);
const place = event.target;
place.parentNode.removeChild(place);
}//sub_db_delete if
});//ende_get_music
//----------------------------------------------------------------------------------------------------------------------------
//login
const auth = document.querySelector('#auth div')//ul nicht ui, wer lesen kann ist klar im vorteil//auth = id
auth.addEventListener('click',function(event){
event.preventDefault();
get_current_user_function();
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
      //make new fields
      //add_muisc
      if(!document.getElementById("add_music_button")){
        const pfad = document.getElementById("add_music");
        const button = document.createElement("button");
        //atri
        button.setAttribute("class","add_music");
        button.setAttribute("id","add_music_button");
        button.textContent = "add_music";
        pfad.prepend(document.createElement("hr"));
        pfad.prepend(button);
      }//end if add music  
          const response = await get_current_user_function();
          console.log("response");
          console.log(response);
          const result = response["msg"];
          console.log("result");
          console.log(result);
          if(result=="admin"){
            //get user und add user 
           // <button class="make_user">make_user</button>
            if(!document.getElementById("get_all_users")){
            const pfad = document.getElementById("users");
            const button = document.createElement("button");
            const makeBtn = document.createElement("button");
            //attri
            button.setAttribute("class","get_all_users");
            button.setAttribute("id","get_all_users");
            button.textContent="get_USERS";
            makeBtn.setAttribute("class","make_user");
            makeBtn.textContent="make_new_user";
            //glue
            pfad.prepend(document.createElement("hr"));
            pfad.prepend(makeBtn);
            pfad.prepend(button);
          }//end getuser btn 
      }//admin check
    }//end if true
  })()//end async
  }//end loginfunctioon
  else if(event.target.className=="logout"){
    console.log("logout")
    logout_function();
    }else{};
});//end auth
//-----------------------------------------------------------------------------------------------------------------
//start User_list
addForm = forms['users'];
const user_list = document.querySelector("#users_list ul");
addForm.addEventListener("click",function(event){
  event.preventDefault();
  get_current_user_function();
  console.log(event.target.className);
  //get_all_users
  if(event.target.className =="get_all_users"){
//start asnyc
 (async()=> {
   //get all users
   let all_user = await get_all_users();
   console.log(all_user);
   all_user = all_user['users'];//[i]

   while(user_list.lastElementChild){
    let child = user_list.lastElementChild;
    child.parentNode.removeChild(child);
  }//end clean

if(!all_user){console.log("no new user");}//empty dic
else{
//for loop for making list 
   for(i = 0;i<all_user.length;i++){
    user = all_user[i];
    const li = document.createElement("li");
    const name = document.createElement("span");
    const email = document.createElement("span");
    const admin = document.createElement("span");
    const deleteBtn = document.createElement("button");
    const promoteBtn = document.createElement("button");
    //values
    name.textContent = " Name: "+user['name'] +" ";
    email.textContent = " email: "+user['email']+" ";
    admin.textContent=" admin: "+user['admin']+" ";
    deleteBtn.textContent="delete_user";
    if(user['admin']==true){ promoteBtn.textContent = "demote"; } else{promoteBtn.textContent = "promote"; };
    //classes_attributes
    li.setAttribute("class","user");
    admin.setAttribute("id",user['public_id']);
    deleteBtn.setAttribute("class","delete_user");
    deleteBtn.setAttribute("value",user['public_id']);
    promoteBtn.setAttribute("class","promote");
    promoteBtn.setAttribute("value",user['public_id']);
    li.appendChild(name);
    li.appendChild(email);
    li.appendChild(admin);
    li.appendChild(deleteBtn);
    li.appendChild(promoteBtn);
    user_list.appendChild(li);
   }//end for
   user_list.appendChild(document.createElement("hr"));
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
    addForm.prepend(div);
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
      addForm.prepend(make_userBtn);
      };//end if true
    })()//end async make_user
  };//end submit_user
  if(event.target.className=="promote"){
    console.log("promote_if");
    const public_id = event.target.value;
    console.log(public_id);
    const promote = event.target;
    const admin = document.getElementById(public_id);
    (async()=> { 
    let response = await promote_function(public_id);
    response = response['msg'];
    console.log("response",response);
    const promote = event.target;
    const admin = document.getElementById(public_id);

    if(response=="promoted"){
      promote.textContent="demote";
      admin.textContent="admin: true";
      document.getElementById("msg").innerHTML=response
    }else if(response=="demoted"){
      promote.textContent="promote";
      admin.textContent="admin: false"
      document.getElementById("msg").innerHTML=response
    }else{document.getElementById("mesg").innerHTML=response};
  })()//ende asnyc
  }//end_promote if

  if(event.target.className=="delete_user"){
console.log("delete_user_if");
const public_id = event.target.value;
const place = event.target.parentNode;
(async()=>{
let response = await delete_user_function(public_id);
response = response['msg'];
console.log("response:",response);
if(response=="delete"){
  place.parentNode.removeChild(place);
  document.getElementById("msg").innerHTML=response
}else{document.getElementById("msg").innerHTML=response};
})()//end async
  };//end if delete

});//end user_event
//--------------------------------------------------------------------------------------------------------------------

})//end DOM system
//__function____function____function____function____function____function____function____function____function____function__

const http_ip="http://192.168.2.220"

//get_music
async function get_music(){
    jwt_token = localStorage.getItem('jwt_token')
    console.log("jwt: "+jwt_token)
    if(!jwt_token){
      document.getElementById("msg").innerHTML="no token";
      return ""
    };
    var myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer " +jwt_token);

var requestOptions = {method: 'POST',headers: myHeaders,redirect: 'follow',};
const response = await fetch(http_ip+"/get_music", requestOptions)
let result =await response.text();
console.log(result)
document.getElementById("msg").innerHTML=result;
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
  fetch(http_ip+"/static/music/"+value,requestOptions)
  .then(response => response.text())
  .then(result => {document.getElementById("now_playing").innerHTML=value;
  document.getElementById("msg").innerHTML=result;})
  .catch(error => {
    document.getElementById("now_playing").innerHTML="None";
    document.getElementById("msg").innerHTML=error;
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
  const response = await fetch(http_ip+"/login", requestOptions)
  //jwt from response
  const result =await response.text();
  if(!result || result=="no login"){
    document.getElementById("msg").innerHTML=result;
    return false}
  else{
    document.getElementById("msg").innerHTML=result;
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
  
  fetch(http_ip+"/logout", requestOptions)
    .then(response => response.text())
    .then(result => {
      console.log(result);
      localStorage.removeItem('jwt_token');
      document.getElementById("msg").innerHTML=result;
      window.location.replace('/');
    }).catch(error => document.getElementById("msg").innerHTML=error);
}//end logout
//stop_button
async function stop_music(){
  const jwt_token = localStorage.getItem('jwt_token');
  var myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer "+jwt_token);

var requestOptions = {method: 'POST',headers: myHeaders,redirect: 'follow'};

fetch(http_ip+"/stop_music", requestOptions)
  .then(response => response.text())
  .then(result => {document.getElementById("now_playing").innerHTML = "NONE";
                  document.getElementById("msg").innerHTML=result;
    }).catch(error => document.getElementById("msg").innerHTML=error);
}//end stop music
//get_all_users
async function get_all_users(){
  const jwt_token = localStorage.getItem('jwt_token');
  var myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer "+jwt_token);
var requestOptions = {method: 'GET',headers: myHeaders,redirect: 'follow'};
const response =await fetch(http_ip+"/users", requestOptions);
let result = await response.json(); //macht json in txt
document.getElementById("msg").innerHTML= result['msg'];
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
  fetch(http_ip+"/upload_music",requestOptions)
  .then(response=>response.text())
  .then(result=>{
    document.getElementById("msg").innerHTML = result;
    document.getElementById("upload_music").setAttribute("type","text");
    document.getElementById("upload_music").setAttribute("type","file");//kind of bad....
    document.getElementById("msg").innerHTML = result;
  }).catch(error=>document.getElementById("msg").innerHTML=error);
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
fetch(http_ip+"/user",requestOptions)
.then(response=>response.text())
.then(result=>{document.getElementById("msg").innerHTML= result;})
.catch(error =>  document.getElementById("msg").innerHTML= error);
  return true;
}//end make_user

//play on lokal
async function play_on_local_function(title){ //title über onclick
jwt_token = localStorage.getItem('jwt_token');
var myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer "+jwt_token);
var requestOptions = {method: 'GET',headers: myHeaders,redirect: 'follow'};//ohne body?
fetch(http_ip+"/static/music/" + title, requestOptions)
  .then(response => response.arrayBuffer())
  .then(result => {
    document.getElementById("msg").innerHTML = result;
    const speicher = new Blob([result],{type:"audio/wav"});
    //make audio
    const audio = new Audio;
    const figcaption = document.createElement("figcaption");
    const figure = document.createElement("figure");
    const deletBtn = document.createElement("button");
    //attri
    audio.controls = true;
    audio.src = window.URL.createObjectURL(speicher);
    audio.setAttribute("id",title);
    figcaption.textContent = title;
    deletBtn.textContent="delet";
    deletBtn.setAttribute("id",title);
    deletBtn.setAttribute("class","delete_local");
    deletBtn.setAttribute("onclick","delete_local_function(id)");
    //apend
    const place = document.querySelector("#local_music div");
    figcaption.appendChild(deletBtn);
    figure.appendChild(figcaption);
    figure.appendChild(audio);
    place.prepend(figure);   
}).catch(error => console.log('error', error));
}//end play on lokal
function delete_local_function(title){
    let place = document.getElementById(title);
    place = place.parentElement.parentElement;
    place.parentNode.removeChild(place); //how to get rid if arrayBuffer elemnts?

}//ende del audio button

async function delete_muisc_function(title){
  jwt_token = localStorage.getItem('jwt_token');
  var myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer "+jwt_token);

var requestOptions = {method: 'DELETE',headers: myHeaders,redirect: 'follow',};

fetch(http_ip+"/static/music/"+title, requestOptions)
  .then(response => response.text())
  .then(result => document.getElementById("msg").innerHTML=result)
  .catch(error => document.getElementById("msg").innerHTML=error);
  
}//end delete_music_fuction

async function promote_function(public_id){
jwt_token = localStorage.getItem('jwt_token');
var myHeaders = new Headers();
myHeaders.append("Authorization","Bearer "+jwt_token);
var requestOptions = {method:"PUT",headers:myHeaders,redirect:'follow',};

console.log(public_id);
const response = await fetch(http_ip+"/user/"+public_id,requestOptions);
let result = await response.json();
console.log(result);
document.getElementById("msg").innerHTML=result;
return result;
}//end promote
//delete_user function
async function delete_user_function(public_id){

jwt_token=localStorage.getItem('jwt_token');
console.log(public_id);
var myHeaders = new Headers();
myHeaders.append("Authorization","Bearer "+jwt_token);
var requestOptions={method:'DELETE',headers:myHeaders,redirect:'follow'};
const response = await fetch(http_ip+"/user/"+public_id,requestOptions);
const result = await response.json();
console.log(result);
document.getElementById("msg").innerHTML=result;
return result;
}//delete user function

async function get_current_user_function(){
  jwt_token = localStorage.getItem('jwt_token');
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer "+ jwt_token);
  
  var requestOptions = {method: 'GET',headers: myHeaders,redirect: 'follow'};
  const response = await fetch(http_ip+"/user", requestOptions)
  const result = await response.json();
  document.getElementById("msg").innerHTML=result['msg'];
  if(result['msg']==false){
        logout_function();
        localStorage.removeItem('jwt_token');
   }else{console.log("return user");return result;};  
}//end get current user
