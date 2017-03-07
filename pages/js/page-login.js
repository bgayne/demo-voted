var typeLock;

function packageData() {
  outbound = {
    username:$("#username").val(),
    password:$("#password").val(),
  }
  return outbound
}

function sendData() {
  $.ajax({
    url:"http://localhost:3000/login/",
    method:"POST",
    data: packageData(),
    dataType: "json",
  }).done((data) => {
    if(data.status == 302) {
      window.location.replace($("redirectTarget").attr("class"));
    }
  });
}

$(() => {

  $(".register").on("submit", (event) => {
    event.preventDefault();
  });

  $(".btn-signup").on("click", () => {
    sendData();
  })
})
