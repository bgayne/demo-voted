
function packageData() {
  console.log();
}

function sendData() {
  console.log("/polls/"+$("pageid").attr('id'));
  console.log($("input[type=radio]:checked").val());
  $.ajax({
    url:"/polls/"+$("pageid").attr('id'),
    method:"POST",
    data: {
      selection: $("input[type=radio]:checked").val()
    },
    dataType: "json",
  }).done((data) => {
    console.log(data.status, data.message);
    if(data.status === "success") {
      window.location.replace("/polls/"+$("pageid").attr('id')+"/results");
    }
  });
}

$(() => {
  $("#submit").on("click", (event) => {
    event.preventDefault();
    sendData()
  })

})
