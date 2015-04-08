$(document).ready( function() {
  var v = $("#newClassSurvey").validate({
      rules: {
        newClass: {
          required: true,
          minlength: 2,
          maxlength: 16
        }
      },
      errorElement: "span",
      errorClass: "help-inline",
    });

  $(".open1").click(function() {
      if (v.form()) {
        $(".survey_frm").hide("fast");
        $("#files").show("slow");
      }
   });
 
     // Binding back button on second step
    $(".back2").click(function() {
      $(".survey_frm").hide("fast");
      $("#settings").show("slow");
    });
 
    $(".open3").click(function() {
      if (v.form()) {
        // optional
        // used delay form submission for a seccond and show a loader image
        $("#loader").show();
         setTimeout(function(){
           $("#basicform").html('<h2>Thanks for your time.</h2>');
         }, 1000);
        // Remove this if you are not using ajax method for submitting values
        return false;
      }
    });

});


