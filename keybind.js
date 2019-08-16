// EMAIL BUTTON ENTER
var input = document.getElementById("email_field");
input.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("login-button").click();
  }
});

// PASSWORD BUTTON ENTER
var input = document.getElementById("password_field");
input.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("login-button").click();
  }
});


// PLOT BUTTON ENTER
var input = document.getElementById("plot_field");
input.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("plot-button").click();
  }
});
