/*

jquery plugin template based on

http://alexsexton.com/blog/2010/02/using-inheritance-patterns-to-organize-large-jquery-applications/

http://blog.bigbinary.com/2010/03/12/pratical-example-of-need-for-prototypal-inheritance.html

*/


var SVGDials = {
  
  init: function(options, el) {
      this.options = $.extend(
        {},this.options, options
      );

      this.el = el;
      this.$el = $(el);

      this._build();
  },

  options: {
      size: 290,
      strokeWidth: 30,
      colors: ["#eb4e36", "#eb7f24", "#3d9900", "#0376bf", "#573f70"]
  },

  _build: function() {
      var $els = this.$el.find("input[type='number']"),
          currentRadius = this.options.size / 2 - this.options.strokeWidth / 2 - 2,
          paper = Raphael(this.$el[0], this.options.size, this.options.size);

      paper.customAttributes.arc = this.customAttributes.arc;
      paper.customAttributes.dash = this.customAttributes.dash;
      paper.customAttributes.scrubber = this.customAttributes.scrubber;
      
      for (var i = 0; i < $els.length; i++) {
        var $el = $els.eq(i),
            //el = $el[0]
            currentColor = this.options.colors[i];
        
        this.initDial($el, paper, currentRadius, currentColor);

        currentRadius -= this.options.strokeWidth + 10;

      };

  },

  initDial: function($el, paper, radius, color) {
    
    var total = $el.attr("max") - $el.attr("min"),
        value = +$el.attr("value") || 0,
        mid = this.options.size/2,

        sec = paper.path().attr({
          arc: [value, total, radius, mid, this.options.strokeWidth, color]
        }),

        dash = paper.path().attr({
          dash: [radius, mid, this.options.strokeWidth]
        }),

        scrubber = paper
          .circle()
          .attr({
            scrubber: [value, total, radius, mid, this.options.strokeWidth]
          })
          .drag(
            function(dx,dy,x,y,event){
                return
            }
          )
          .touchmove(
            function(event){

              var value = xyToValue.call(this, event);
              
              this.attr({scrubber: [value, total, radius, this.options.strokeWidth]})
              
              this.prev.prev.attr({arc: [value, total, R]});
              
              var inputVal = parseInt(value + parseInt($("#value1").attr("min")))
              
              $el.val(inputVal);

            }
          );

        $(dash.node).attr("stroke-dasharray", "7,2")

  },

  customAttributes: {

    arc: function (value, total, radius, mid, strokeWidth, color) {
      
      var angle = 360 / total * value, // 
          a = (90 - angle) * Math.PI / 180,
          x = mid + radius * Math.cos(a),
          y = mid - radius * Math.sin(a),
          path;

      if (total == value) {
          
          path = [
            ["M", mid, mid - radius], 
            ["A", radius, radius, 0, 1, 1, mid-.01, mid - radius]
          ];

      } else {
          
          path = [
            ["M", mid, mid - radius], 
            ["A", radius, radius, 0, +(angle > 180), 1, x, y]
          ];

      }
      
      return {
        path: path, 
        stroke: color, 
        "stroke-width": strokeWidth
      };
    
    },

    dash: function (radius, mid, strokeWidth) {
      
      var color = "#000000",
          opacity = .1,
          path = [
            ["M", mid, mid - radius], 
            ["A", radius, radius, 0, 1, 1, mid-.01, mid - radius]
          ];
      
      return {
        path: path, 
        stroke: color, 
        opacity: opacity, 
        "stroke-width": strokeWidth
      };

    },

    scrubber: function (value, total, radius, mid, strokeWidth) {
      
      var angle = 360 / total * value,
          a = (90 - angle) * Math.PI / 180,
          cx = mid + radius * Math.cos(a),
          cy = mid - radius * Math.sin(a),
          r = strokeWidth / 2 + 2,
          color = "#B3B3B3",
          fill = "90-#e0e1e2-#fff",
          scrubberStroke = 1;

      return {
        cx: cx, 
        cy: cy, 
        r: r, 
        stroke: color, 
        fill: fill, 
        "stroke-width": scrubberStroke
      };

    }

  },

  xyToValue: function(e) {

    var x = e.changedTouches[0].pageX //+ scrollX//(typeof e.pageX !== 'undefined') ? e.pageX : ((typeof e.changedTouches !== 'undefined') ? e.changedTouches[0].pageX : null),
        y = e.changedTouches[0].pageY //+ scrollY//(typeof e.pageY !== 'undefined') ? e.pageY : ((typeof e.changedTouches !== 'undefined') ? e.changedTouches[0].pageY : null);

    //$("#value1").val(x);

    posx = x  - $(this.paper.canvas).offset().left - 300;
    posy = y  - $(this.paper.canvas).offset().top - 300;
    var angle = Math.atan2(posy, posx) / Math.PI * 180 + 90
    var angle = (angle < 0 ? angle+360 : angle)
    var value = angle * total / 360;
    return value
  }


};

// Make sure Object.create is available in the browser (for our prototypal inheritance)
if (typeof Object.create !== 'function') {
  Object.create = function(o) {
      function F() {}
      F.prototype = o;
      return new F();
  };
}

$(function() {
  $.fn.svgDials = function(options) {
      if (this.length) {
          return this.each(function() {
              var myDials = Object.create(SVGDials);
              myDials.init(options, this);
              //$.data(this, 'svgDials', myDials);
          });
      }
  };
});


$(document).ready(function() {

  
  $('.dials').svgDials({
    size: 400,
    strokeWidth: 30,
    colors: ["#3d9900", "#eb7f24"]
  });

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



  // $.fn.dials = function (options) {
  //       var $dials = $(this)
  //       return this.each(
            
  //           function (index, el) {

  //             var canvas = $("<svg width="+options.width+" height="+options.width+" version='1.1' xmlns='http://www.w3.org/2000/svg'></svg>").attr("id", "svg"+el.id).appendTo(el);
  //             var b = 2
  //             console.log(index);
  //             var dials = $(el).find(".dial");
              
  //             dials.each(


  //               function(index, el){
  //                 var $this = $(this),
  //                     dial = {}

  //                 $this.data({
  //                   "$canvas": $this.parent().find("svg"),
  //                   "min": parseInt($this.attr("min")),
  //                   "max": parseInt($this.attr("max"))
  //                 });

  //                 dial.$canvas = $this.parent().find("svg");
  //                 dial.min = parseInt($this.attr("min"));
  //                 dial.max = parseInt($this.attr("max"));

  //                 dial.track = $('<path fill="none" stroke="#00ff00" d="M300,100A200,200,0,1,1,299.99,100" stroke-width="30" stroke-dasharray="7,3"></path>')
  //                 .attr("stroke", "#00ffff")
  //                 .attr("stroke-width", "30")
  //                 .attr("d", "M300,100A200,200,0,1,1,299,100")
  //                 .appendTo(dial.$canvas)
  //                 //dial.track = $('<path fill="none" stroke="#bf9595" d="M'+dial.$canvas.width()/2+',0A200,200,0,0,1,400,200" stroke-width="30"></path>').appendTo(dial.$canvas)


  //               })
              
  //               //var d = new k.Dial();
  //               //d.o = o;
  //               //d.$ = $(this);
  //               //d.run();
  //           }
  //       ).parent();
  //   };


                var //size = 600,
                    maxRad = 300,
                    strokeWidth = 30,
                    value = 30,
                    total = $("#value1").attr("max") - $("#value1").attr("min"),
                    paper = Raphael("holder", 600, 600),
                    R = 200,
                    init = true,
                    param = {"stroke-width": strokeWidth};
                    //hash = document.location.hash;
                    //marksAttr = {fill: hash || "#444", stroke: "none"},
                    // html = [
                    //     document.getElementById("h"),
                    //     document.getElementById("m"),
                    //     document.getElementById("s"),
                    //     document.getElementById("d"),
                    //     document.getElementById("mnth")
                    //     //document.getElementById("ampm")
                    // ];
                // Custom Attribute
                paper.customAttributes.arc = function (value, total, R) {
                    var angle = 360 / total * value, // 
                        a = (90 - angle) * Math.PI / 180,
                        x = maxRad + R * Math.cos(a),
                        y = maxRad - R * Math.sin(a),
                        color = "#0066ff",
                        path;
                    //console.log(value);
                    if (total == value) {
                        path = [["M", maxRad, maxRad - R], ["A", R, R, 0, 1, 1, maxRad-.01, maxRad - R]];
                    } else {
                        path = [["M", maxRad, maxRad - R], ["A", R, R, 0, +(angle > 180), 1, x, y]];
                    }
                    return {path: path, stroke: color};
                };

                paper.customAttributes.dash = function (R) {
                    var color = "#000000",
                        opacity = .1,
                        path = [["M", maxRad, maxRad - R], ["A", R, R, 0, 1, 1, maxRad-.01, maxRad - R]];
                    
                    return {path: path, stroke: color, opacity: opacity};
                };

                paper.customAttributes.scrubber = function (value, total, R, strokeWidth) {
                    var angle = 360 / total * value,
                        a = (90 - angle) * Math.PI / 180,
                        cx = maxRad + R * Math.cos(a),
                        cy = maxRad - R * Math.sin(a),
                        r = strokeWidth / 2 + 2,
                        color = "#B3B3B3",
                        fill = "90-#e0e1e2-#fff",
                        scrubberStroke = 1;
                        //size = this.size;

                    return {cx: cx, cy: cy, r: r, stroke: color, fill: fill, "stroke-width": scrubberStroke};
                };

                
                var sec = paper.path().attr(param).attr({arc: [value, total, R]});
                var dash = paper.path().attr(param).attr({dash: [R]});
                $(dash.node).attr("stroke-dasharray", "7,2")
                var scrubber = paper
                    .circle()
                    .attr({scrubber: [value, total, R, strokeWidth]})
                    .drag(
                        function(dx,dy,x,y,event){
                            return
                        }
                    )
                    .touchmove(
                        function(event){

                            var value = xyToValue.call(this, event);
                            
                            this.attr({scrubber: [value, total, R, strokeWidth]})
                            
                            this.prev.prev.attr({arc: [value, total, R]});
                            
                            var inputVal = parseInt(value + parseInt($("#value1").attr("min")))
                            $("#value1").val(inputVal);

                        }
                    )
                ;

                xyToValue = function(e) {

                    var x = e.changedTouches[0].pageX //+ scrollX//(typeof e.pageX !== 'undefined') ? e.pageX : ((typeof e.changedTouches !== 'undefined') ? e.changedTouches[0].pageX : null),
                        y = e.changedTouches[0].pageY //+ scrollY//(typeof e.pageY !== 'undefined') ? e.pageY : ((typeof e.changedTouches !== 'undefined') ? e.changedTouches[0].pageY : null);


                    $("#value1").val(x);

                    posx = x  - $(this.paper.canvas).offset().left - 300;
                    posy = y  - $(this.paper.canvas).offset().top - 300;
                    var angle = Math.atan2(posy, posx) / Math.PI * 180 + 90
                    var angle = (angle < 0 ? angle+360 : angle)
                    var value = angle * total / 360;
                    return value
                }
                //var secScrub = paper.circle((300+R*Math.cos(360 / total * value)), 300-R*Math.sin(360 / total * value), 20);
                //R -= 36;
                //drawMarks(R, 60);
                // var min = paper.path().attr(param).attr({arc: [0, 60, R]});
                // R -= 40;
                // //drawMarks(R, 12);
                // var hor = paper.path().attr(param).attr({arc: [0, 12, R]});
                // R -= 40;
                // //drawMarks(R, 31);
                // var day = paper.path().attr(param).attr({arc: [0, 31, R]});
                // R -= 40;
                // //drawMarks(R, 12);
                // var mon = paper.path().attr(param).attr({arc: [0, 12, R]});
                //var pm = paper.circle(300, 300, 16).attr({stroke: "none", fill: Raphael.hsb2rgb(15 / 200, 1, .75).hex});
                //html[5].style.color = Raphael.hsb2rgb(15 / 200, 1, .75).hex;

                //function updateVal(value, total, R, hand, id) {
                    // if (total == 31) { // month
                    //     var d = new Date;
                    //     d.setDate(1);
                    //     d.setMonth(d.getMonth() + 1);
                    //     d.setDate(-1);
                    //     total = d.getDate();
                    // }
                    //var color = "hsb(".concat(Math.round(R) / 200, ",", value / total, ", .75)");
                    // if (init) {
                    //     hand.attr({arc: [value, total, R]});
                    // } else {
                    //     if (!value || value == total) {
                    //         value = total;
                    //         hand.attr({arc: [value, total, R]}, 750, "bounce", function () {
                    //             hand.attr({arc: [0, total, R]});
                    //         });
                    //     } else {
                    //         hand.attr({arc: [value, total, R]}, 750, "elastic");
                    //     }
                    // }

                    // var scrubber = paper.circle((300+R*Math.cos(360 / total * value)), 300-R*Math.sin(360 / total * value), 20);
                    // scrubber.attr({scrubber: [0, 60, 300, strokeWidth]});

                    // html[id].innerHTML = (value < 10 ? "0" : "") + value;
                    //html[id].style.color = Raphael.getRGB(color).hex;
                //}

                // function drawMarks(R, total) {
                //     if (total == 31) { // month
                //         var d = new Date;
                //         d.setDate(1);
                //         d.setMonth(d.getMonth() + 1);
                //         d.setDate(-1);
                //         total = d.getDate();
                //     }
                //     var color = "hsb(".concat(Math.round(R) / 200, ", 1, .75)"),
                //         out = paper.set();
                //     for (var value = 0; value < total; value++) {
                //         var angle = 360 / total * value,
                //             a = (90 - angle) * Math.PI / 180,
                //             x = 300 + R * Math.cos(a),
                //             y = 300 - R * Math.sin(a);
                //         out.push(paper.circle(x, y, 2).attr(marksAttr));
                //     }
                //     return out;
                // }

                // (function () {
                //     var d = new Date,
                //         am = (d.getHours() < 12),
                //         h = d.getHours() % 12 || 12;
                //     //updateVal(d.getSeconds(), 60, 200, sec, 2);
                //     //updateVal(d.getMinutes(), 60, 160, min, 1);
                //     //updateVal(h, 12, 120, hor, 0);
                //     //updateVal(d.getDate(), 31, 80, day, 3);
                //     //updateVal(d.getMonth() + 1, 12, 40, mon, 4);
                //     //pm[(am ? "hide" : "show")]();
                //     //html[5].innerHTML = am ? "AM" : "PM";
                //     //setTimeout(arguments.callee, 1000);
                //     init = false;
                // })();



  // $("#dials").dials({ 
  //   "width": 400
  // })

});