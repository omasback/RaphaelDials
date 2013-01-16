$(function() {

  // $("#dial1")
  //     .dial({
  //             fgColor:"#222222",
  //             bgColor:"#EEEEEE",
  //             thickness : 22,
  //             width: 376,
  //             height: 376,
  //             //cursor: 30,
  //             change: function(e){
  //             }
  //             /*, change : function (value) {
  //                 console.log("change : ", value);
  //             }*/

  //         });
  //     //.css({display:'inline',padding:'0px 10px'});

  //   $("#dial2")
  //     .dial({
  //             fgColor:"#222222",
  //             bgColor:"#EEEEEE",
  //             thickness : 22,
  //             width: 312,
  //             height: 312,
  //             cursor: 22,
  //             // change: function(e){
  //             //   $("#dial1")
  //             //     .val(e/2)
  //             //     .trigger('change');
  //             // }
  //             /*, change : function (value) {
  //                 console.log("change : ", value);
  //             }*/

  //         });
  //     //.css({display:'inline',padding:'0px 10px'});



  $.fn.dials = function (options) {
        var $dials = $(this)
        return this.each(
            
            function (index, el) {

              var canvas = $("<svg width="+options.width+" height="+options.width+" version='1.1' xmlns='http://www.w3.org/2000/svg'></svg>").attr("id", "svg"+el.id).appendTo(el);
              var b = 2
              console.log(index);
              var dials = $(el).find(".dial");
              
              dials.each(


                function(index, el){
                  var $this = $(this),
                      dial = {}

                  $this.data({
                    "$canvas": $this.parent().find("svg"),
                    "min": parseInt($this.attr("min")),
                    "max": parseInt($this.attr("max"))
                  });

                  dial.$canvas = $this.parent().find("svg");
                  dial.min = parseInt($this.attr("min"));
                  dial.max = parseInt($this.attr("max"));

                  dial.track = $('<path fill="none" stroke="#00ff00" d="M300,100A200,200,0,1,1,299.99,100" stroke-width="30" stroke-dasharray="7,3"></path>')
                  .attr("stroke", "#00ffff")
                  .attr("stroke-width", "30")
                  .attr("d", "M300,100A200,200,0,1,1,299,100")
                  .appendTo(dial.$canvas)
                  //dial.track = $('<path fill="none" stroke="#bf9595" d="M'+dial.$canvas.width()/2+',0A200,200,0,0,1,400,200" stroke-width="30"></path>').appendTo(dial.$canvas)


                })
              
                //var d = new k.Dial();
                //d.o = o;
                //d.$ = $(this);
                //d.run();
            }
        ).parent();
    };


  $("#dials").dials({ 
    "width": 400
  })

});