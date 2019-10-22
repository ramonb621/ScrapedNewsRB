
function getResults() {
  $.getJSON("/articles", function(data) {

    for (var i = 0; i < data.length; i++) {

      $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + "<a href='" + data[i].link + "'>" + data[i].link + "</a>" + "<br />" + data[i].summary + "<button data-id='" + data[i]._id + "' id='createnote'>Create Note</button>" + "</p>");
    }
  });
}

$(document).on("click", "#scrape", function() {
  $.ajax({
    method: "GET",
    url: "/scrape"
  }).then(function(data){

    console.log("Scraping...");
    getResults();
    console.log("Scraping complete!");

  })
});

$(document).on("click", "#createnote", function() {

  $("#notes").empty();

  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    
    .then(function(data) {
      console.log(data);

      $("#notes").append("<h2>" + data.title + "</h2>");

      $("#notes").append("<input id='titleinput' name='title' placeholder='Insert Title...'>");

      $("#notes").append("<textarea id='bodyinput' name='body' placeholder='Insert Note...'></textarea>");

      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      if (data.note) {

        $("#titleinput").val(data.note.title);

        $("#bodyinput").val(data.note.body);
      }
    });
});


$(document).on("click", "#savenote", function() {

  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {

      title: $("#titleinput").val(),

      body: $("#bodyinput").val()
    }
  })

    .then(function(data) {

      console.log(data);

      $("#saved").append("<p class='saved' data-id=" + thisId + "><span class='dataTitle' data-id=" +
      data._id + ">" + data.title + data.body + "</span><span class=delete>X</span></p>");

      // $("#notes").empty();
      $("#titleinput").val("");
    $("#bodyinput").val("");
    });
});

// $(document).on("click", ".saved", function() {

//   var selected = $(this).parent();

//   $.ajax({
//     type: "PUT",
//     url: "/articles/" + selected.attr("data-id"),

//     success: function(response) {

//       selected.remove();
//       selected.empty();
//       $(".saved").empty();
//       $("#titleinput").val("");
//       $("#bodyinput").val("");

//     }
//   });
// });

$(document).on("click", ".delete", function() {

  var selected = $(this).parent();

  $.ajax({
    type: "GET",
    url: "/articles/" + selected.attr("data-id"),

    success: function(response) {

      selected.remove();
      $(".saved").empty();
      $("#titleinput").val("");
      $("#bodyinput").val("");
    }
  });
});
