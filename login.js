let database = firebase.database();
let data = {};
let user_plot;



firebase.auth().onAuthStateChanged(function(user) {
  // Check if user is signed in.
  if (user) {

    document.getElementById("user_div").style.display = "block";
    document.getElementById("user_para").style.display = "block";
    document.getElementById("login_div").style.display = "none";

    let user = firebase.auth().currentUser;

    if (user != null) {
      let email_id = user.email;
      document.getElementById("user_para").innerHTML = "Logged In As: " + email_id + " | <a onclick='logout()'>Logout</a>";
      let path = database.ref('backers/' + user.uid);

      path.once('value', gotData, errData);

      function gotData(data) {
        console.log('Read Successful:');
        // check that data exists. Plot and drawing New users will have none.
        // Return at first failure point
        if (data.val()) {
          // check that plot data exists.
          if (data.val().plot != null) {
            // store the plot data in a variable, validate it and display the info
            user_plot = data.val().plot;
            if (user_plot != null  && user_plot > -1 && user_plot < 60) {
              document.getElementById("plot_para").innerHTML = "Plot: " + user_plot;
              return;
            }
          }
          document.getElementById("plot_para").innerHTML = "You don't have a plot. Set one now!";
          return;
        }
        document.getElementById("plot_para").innerHTML = "No data saved...";
      }

      function errData(err) {
        console.log('Read Error!');
        console.log(err);
      }
    }
  } else {
    // No user is signed in.
    document.getElementById("user_div").style.display = "none";
    document.getElementById("user_para").style.display = "none";
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
      alert("Error : " + errorMessage);
    });
}


// logout of Firebase
function logout() {
  firebase.auth().signOut();
}

function reset() {
  var auth = firebase.auth();
  let userEmail = document.getElementById("email_field").value;

  auth.sendPasswordResetEmail(userEmail).then(function() {
    alert("Your password reset has been email sent. Please check your inbox.");
  }).catch(function(error) {
    alert("Something went wrong. Please make sure you have an active account and that your e-mail address is typed into the corresponding field above. If you continue to experience issues please contact input@stringandloop.com for assistance.");
  });
}


function plotUpdate() {
  // take input from field to update the value of the plot
  let newPlot = document.getElementById("plot_field").value;

  // check that the plot is not in use and is valid. At any fail point, return
  // newPlot must be a number.
  if (isNaN(newPlot)) {
    alert('Sorry, that is not a valid plot');
    return;
    //Alert if user resubmits their existing plot as newPlot
  } else if (int(newPlot) === int(user_plot)) {
    alert('You already have that plot...');
    return;
    //newPlot can't be one of the heel spots
  } else if (heelCheck(newPlot) == false) {
    alert('Sorry, that plot is unavailable');
    return;
    //newPlot must be one of plots
  } else if (newPlot < 0 || newPlot > 59) {
    alert('Sorry, that is not a valid plot');
    return;
  }

  // check the dictionary of all the current plots drawn to see if this new plot
  // is valid. Return if it is not available.
  for (let key in plotsDrawn) {
    if (newPlot == plotsDrawn[key]) {
      alert('Sorry. That plot is unavailable');
      return;
    }
  }

  // create the JSON data with the new plot
  data = {
    plot: int(newPlot),
  }

  // update the path with the new data
  let path = database.ref('backers/' + firebase.auth().currentUser.uid);
  path.update(data, finished);

  function finished(err) {
    if (err) {
      alert('Write Error!');
      console.log(err);
    } else {
      alert('Plot update successful! Your new plot is "Plot ' + newPlot + '"');
      console.log('Wrote to server: ', data);
      user_plot = newPlot;
      document.getElementById("plot_para").innerHTML = "Plot: " + user_plot;
    }
  }
}
