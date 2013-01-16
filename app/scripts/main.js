$(function() {

  $("#dial1")
      .dial({
              fgColor:"#222222",
              bgColor:"#EEEEEE",
              thickness : 22,
              width: 376,
              height: 376,
              //cursor: 30,
              change: function(e){
              }
              /*, change : function (value) {
                  console.log("change : ", value);
              }*/

          });
      //.css({display:'inline',padding:'0px 10px'});

    $("#dial2")
      .dial({
              fgColor:"#222222",
              bgColor:"#EEEEEE",
              thickness : 22,
              width: 312,
              height: 312,
              cursor: 22,
              // change: function(e){
              //   $("#dial1")
              //     .val(e/2)
              //     .trigger('change');
              // }
              /*, change : function (value) {
                  console.log("change : ", value);
              }*/

          });
      //.css({display:'inline',padding:'0px 10px'});

});