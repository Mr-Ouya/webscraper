// call scrape route and then redraw the page
$("#btnScrape").click(function() {
    $.post("/api/scrape").then(function() {
      window.location.href = "/";
    });
  });
  
  // see notes for this article
  $(".notesBtn").click(function() {
    articleId = $(this).val();
    window.location.href = "/notes/" + articleId;
  });
  
  // add note to this article
  $("#addNoteBtn").click(function() {
    console.log("add note button was clicked!");
    articleId = $(this).val();
    console.log(articleId);
    var newNote = $("#newNote").val();
    console.log("new note is: ");
    console.log(newNote);
  
    $.post("/notes/" + articleId, { noteDescription: newNote }, function() {
      // !why does this callback never get executed???
      console.log("arrrgggghhhh");
      console.log("windows.location.href /notes/" + articleId);
      window.location.reload();
    });
  });
  
  // call delete route and pass the id of the article who's delete button was clicked
  $(".deleteArticleBtn").click(function() {
    //! how do i delete correspondingn notes... so i don't lose orphans... shouldn't model handle this?
    console.log("delete article button was clicked!");
    articleId = $(this).val();
    console.log(articleId);
    $.ajax({
      url: "/api/article/delete/" + articleId,
      type: "DELETE"
    }).then(function() {
      window.location.reload();
    });
  });
  
  $(".deleteNoteBtn").click(function() {
    console.log("delete note button was clicked");
    noteId = $(this).val();
    console.log("note id");
    console.log(noteId);
    articleId = $("#articleId").attr("data-value");
    console.log("article id");
    console.log(articleId);
    $.ajax({
      url: "/api/note/delete/" + noteId + "/" + articleId,
      type: "DELETE"
    }).then(function() {
      console.log("/notes/" + articleId);
      window.location.reload();
    });
  });