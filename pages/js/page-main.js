var validEmail = false;
var typeLock;

function packageData() {
  outbound = {
    username:$("#username").val(),
    password:$("#password").val(),
    email:$("#email").val(),
    firstName:$("#firstname").val(),
    lastName:$("#lastname").val()
  }
  return outbound
}

function sendData() {
  if(validEmail)
    $.ajax({
      url:"/register/",
      method:"POST",
      data: packageData(),
      dataType: "json",
    }).done((data) => {
      console.log(data);
    });
}

function validateEmail() {
  console.log("Hello?");
  clearTimeout(typeLock)
  typeLock = setTimeout(() => {
    if(!$("#email").val().match(/.*@.*\.[a-zA-Z][a-zA-Z].*/) && $("#email").val() !== "") {
      $("#email").addClass("error");
      $(".email-alert").removeClass("hidden");
      validEmail = false;
    }
    else {
      validEmail = true;
      $("#email").removeClass("error");
      $(".email-alert").addClass("hidden");
    }
  }, 450)
}

$(() => {

  $(".register").on("submit", (event) => {
    event.preventDefault();
  });

  $("#email").on("input", () => {
    validateEmail();
  });

  $(".btn-signup").on("click", () => {
    sendData();
  })
})
