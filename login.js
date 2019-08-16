let database = firebase.database();
let data = {};
let user_plot;



firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.

    document.getElementById("user_div").style.display = "block";
    document.getElementById("login_div").style.display = "none";


    let user = firebase.auth().currentUser;

    if (user != null) {
      let email_id = user.email;

      let path = database.ref('backers/' + user.uid);
      path.once('value', gotData, errData);

      function gotData(data) {
        console.log('Read Successful:');
          user_plot = data.val().plot;
          if (user_plot != null && user_plot != -1) {
            document.getElementById("plot_para").innerHTML = "Plot: " + user_plot;
          } else {
            document.getElementById("plot_para").innerHTML = "You don't have a plot. Set one now!";
          }
      }

      function errData(err) {
        console.log('Read Error!');
        console.log(err);
      }

      document.getElementById("user_para").innerHTML = "Logged In As: " + email_id;
    }
  } else {
    // No user is signed in.
    document.getElementById("user_div").style.display = "none";
    document.getElementById("login_div").style.display = "block";
  }
});


function login() {
  let userEmail = document.getElementById("email_field").value;
  let userPass = document.getElementById("password_field").value;
  firebase.auth().signInWithEmailAndPassword(userEmail, userPass).then(function() {
      //window.location = 'index.html';
    })
    .catch(function(error) {
      // Handle Errors here.
      let errorCode = error.code;
      let errorMessage = error.message;
      window.alert("Error : " + errorMessage);
    });
}


function logout() {
  firebase.auth().signOut();
}


function plotUpdate() {

  let newPlot = document.getElementById("plot_field").value;

  if (isNaN(newPlot)) {
    alert('Sorry, that is not a valid plot');
    return;
  } else if (int(newPlot) === int(user_plot)) {
    alert('You already have that plot...');
    return;
  } else if (heelCheck(newPlot) == false) {
    alert('Sorry, that plot is unavailable');
    return;
  } else if (newPlot < 0 || newPlot > 59) {
    alert('Sorry, that is not a valid plot');
    return;
  }

  for (let key in plotsDrawn) {
    if (newPlot == plotsDrawn[key]) {
      alert('Sorry. That plot is unavailable');
      return;
    }
  }

  data = {
    plot: int(newPlot),
  }

  let path = database.ref('backers/' + firebase.auth().currentUser.uid);
  path.update(data, finished);

  function finished(err) {
    if (err) {
      alert('Write Error!');
      console.log(err);
    } else {
      alert('Write Successful:');
      console.log('Wrote to server: ', data);
      user_plot = newPlot;
      document.getElementById("plot_para").innerHTML = "Plot: " + user_plot;
    }
  }
}
