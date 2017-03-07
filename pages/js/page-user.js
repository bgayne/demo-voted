var polls = [];

var elementString = "\
<div class=\"col-xs-12 poll-list-item poll-list-item-{{i}} form-group\">\
  <a href=\"/polls/{{poll-url}}/results\" class=\"poll-link\"> \
    <div class=\"poll-name\"> \
      <p>{{poll-name}}</p>\
    </div>\
    </a> \
  <div class=\"delete-container\">\
    <button class=\"btn btn-danger\ delete-button\" id=\"{{i}}\">Delete</button>\
  </div>\
</div>\
";


function renderPolls() {

  for(var i in polls) {
    var renderedString =
      elementString
      .replace(/{{i}}/g, i)
      .replace(/{{poll-name}}/, polls[i].title)
      .replace(/{{poll-url}}/, polls[i].url);
    $(".poll-list").append(renderedString);
  }
  $(".delete-button").on("click", (button) => {
    console.log($(button.target));
    deletePoll($(button.target));
  });


}

function deletePoll(poll) {
  var id = poll.attr("id");
  console.log(id, poll);
  $.ajax({
    url:"/user/",
    method:"DELETE",
    data:{
      pollURL:polls[id].url
    }
  }).done((data) => {
    if(data.status === "success")
      $(".poll-list-item-"+id).remove();
  });
}


function getData() {
  $.ajax({
    url:"/user/",
    method:"POST",
    data:{user:"admin"},
    dataType: "json",
  }).done((data) => {
    if(data.status === "success"){
      polls = data.polls;
      renderPolls();
    }
    else
      console.log(data.message);
  });
}

$(() => {

  getData();



})
