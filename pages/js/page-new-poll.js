var optionCount = 2;

var optionString = "\
<div class=\"option-{i} option-item\">\
<input type=\"text\" placeholder=\"Option {i}\" id=\"option-{i}\" class=\"form-control\"/><i class=\"fa fa-plus delete delete-{i}\"></i> \
</div>";


function packageData() {
  var packet = [];
  for(var i = 1; i <= optionCount; i++) {
    packet.push($("#option-"+i).val());
  }
  return {
    title:$("#title").val(),
    options:packet
  }
}

function sendData() {
  console.log(packageData());
  $.ajax({
    url:"/polls/new",
    method:"POST",
    data: packageData(),
    dataType: "json",
  }).done((data) => {
    if(data.status == "success") {
      window.location.replace("/polls/"+data.id);
    }
  });
}

function setDeleteEvent() {
  $(".delete").on("click", function(){
    $(this).parent().remove();
    optionCount--;
    console.log("Decremented optionCount "+optionCount);
    var field = $(".option-item");
    for(var i = 0; i < optionCount; i++) {
      console.log(i, optionCount, optionCount-i+1)
      $(field[i]).attr('class', (index, className) => {
        return className.replace(/option-/, "option-"+(i+1));
      });
      $(field[i]).children("input").attr({
        id:"option-"+(i+1),
        placeholder:"Option "+(i+1),
      });
    }
    console.log(optionCount);
  })
}

function newField() {
  optionCount++;
  $(".option-container").append(optionString.replace(/{i}/g, optionCount));
  $(".delete").off("click");
  setDeleteEvent();
}


$(() => {
  $(".new-button").on("click", (event) => {
    event.preventDefault();
    newField();
  });

  $("#submit").on("click", (event) => {
    event.preventDefault();
    sendData()
  })

  setDeleteEvent();

})
