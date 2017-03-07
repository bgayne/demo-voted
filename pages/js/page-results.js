
function processResults(data) {

  var barTemplate = "<div class=\"result-item\">\
                    <p class=\"result-text\">{{option-name}}: {{votes}} vote{{s}}</p>\
                    <div class=\"result-bar\" style=\"{{width}};height:50px;\"></div>\
                    </div>\
  "

  var pollData = [];
  var optionNames = [];

  var largest = 0;
  var maxX = 460;

  for(var i in data.options) {
    pollData.push(data.options[i].votes);
    if(data.options[i].votes >= largest) largest = data.options[i].votes;
    optionNames.push(data.options[i].optionName)
  }

  for(i in pollData) {
    var renderedBar = barTemplate
                      .replace(/{{option-name}}/, optionNames[i])
                      .replace(/{{width}}/, (pollData[i] !== 0) ? ("width:"+ (maxX * (pollData[i] / largest))+"px") : ("width:10px"))
                      .replace(/{{votes}}/, pollData[i])
                      .replace(/{{s}}/, pollData[i] === 1 ? "" : "s");

    $(".bars").append(renderedBar);
  }
}


function getData() {
  $.ajax({
    url:"/polls/"+$("pageid").attr('id')+"/results",
    method:"POST",
    dataType: "json",
  }).done((data) => {
    console.log(data);
    processResults(data);
  });
}

$(() => {
  getData();
})
