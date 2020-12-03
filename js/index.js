firebase.auth().onAuthStateChanged(function(user) {
    
    if (user) {
      // User is signed in.

     document.getElementById("user_div").style.display = "block";
     document.getElementById("login_div").style.display = "none";
   

     var user = firebase.auth().currentUser;

     if (user != null){
         
      var email_id = user.email;
      document.getElementById("user_para").innerHTML = "user :" + email;
     }
    } else {
      // No user is signed in.

     document.getElementById("user_div").style.display = "none";
     document.getElementById("login_div").style.display = "block";
    }
  });

function login(){
    
    var userEmail = document.getElementById("email_field").value;
    var userPass = document.getElementById("password_field").value;

    firebase.auth().signInWithEmailAndPassword(userEmail, userPass ).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...

        window.alert("Error: " + errorMessage);
      });

}
function logout(){
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
      }).catch(function(error) {
        // An error happened.
      });
}
// CONFIGURACION DE LA BASE DE DATOS
(function(){

  var config = {
    apiKey: "AIzaSyCvgM4yZ_YYJGRArDwgkJ-V4GSyo8_miiw",
    authDomain: "enzalata-76071.firebaseapp.com",
    databaseURL: "https://enzalata-76071.firebaseio.com.firebaseio.com",
    storageBucket: "enzalata-76071.appspot.com"
  }

  //INITIALIZE FIREBASE

  
  //obtener elementos
  const preObject = document.getElementById('Pedidos');
  
  //crear refeerencia
  const dbRefObject = firebase.database().ref().child('Pedidos');
  
  


  

}());
