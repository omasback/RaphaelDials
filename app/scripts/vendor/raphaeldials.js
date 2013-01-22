/*

jquery plugin template based on

http://alexsexton.com/blog/2010/02/using-inheritance-patterns-to-organize-large-jquery-applications/

http://blog.bigbinary.com/2010/03/12/pratical-example-of-need-for-prototypal-inheritance.html

*/

var RaphaelDials = {
  
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
      colors: [
        ["#eb4d36", "#fe7b7b"],
        ["#eb7f24", "#faae3a"],
        ["#3d9900", "#82bd5b"],
        ["#0375bf", "#26a7df"],
        ["#5a4274", "#7e5ba2"]
      ]
  },

  _build: function() {
      var $els = this.$el.find("input[type='number']"),
          currentRadius = this.options.size / 2 - this.options.strokeWidth / 2 - 2,
          paper = Raphael(this.$el[0], this.options.size, this.options.size);

      paper.customAttributes.arc = this.customAttributes.arc;
      paper.customAttributes.scrubber = this.customAttributes.scrubber;
      
      for (var i = 0; i < $els.length; i++) {
        var $el = $els.eq(i);
        
        this.initDial($el, paper, currentRadius, this.options.colors[i]);

        currentRadius -= this.options.strokeWidth + 10;

      };

  },

  initDial: function($el, paper, radius, color) {
    
    var relativeMax = $el.attr("max") - $el.attr("min") + 1,
        relativeValue = +$el.attr("value") - $el.attr("min") || 0,
        center = this.options.size/2,

        dragHandler = function(dx,dy,x,y,event){

          if (arguments.length < 5) {
            event = dx;
          }

          event.preventDefault();

          var dialData = this.data("dialData"),
              relativeValue = xyToValue.call(this, event),
              inputVal = parseInt(
                relativeValue + dialData.absoluteMin
              );

          this.attr({scrubber: [relativeValue, relativeMax, radius, center, dialData.strokeWidth]})
          
          this.prev.prev.attr({arc: [ relativeValue, relativeMax, radius, center, dialData.strokeWidth ]});
          
          dialData.$el.val(inputVal).change();
        },

        xyToValue = function(e) {

          var x = (typeof e.changedTouches !== 'undefined') ? e.changedTouches[0].pageX : ((typeof e.pageX !== 'undefined') ? e.pageX : null),
              y = (typeof e.changedTouches !== 'undefined') ? e.changedTouches[0].pageY : ((typeof e.pageY !== 'undefined') ? e.pageY : null),
              posx = x - $(this.paper.canvas).offset().left - center,
              posy = y - $(this.paper.canvas).offset().top - center,
              angle = Math.atan2(posy, posx) / Math.PI * 180 + 90,
              angle = (angle < 0 ? angle+360 : angle),
              relativeValue = angle * relativeMax / 360;
          
          return relativeValue
        },

        dialData = {
          $el: $el,
          relativeMax: relativeMax,
          absoluteMin: parseInt($el.attr("min")),
          center: center,
          strokeWidth: this.options.strokeWidth,
          color: color
        }
        ,

        sec = paper
          .path()
          .attr("stroke", "none")
          .attr({
            arc: [relativeValue, relativeMax, radius, center, this.options.strokeWidth, color],
            fill: "180-"+color[0]+"-"+color[1],
            stroke: "none"
          }
        )
        ,

        dash = paper
          .circle(center, center, radius)
          .attr({
            stroke: "#000000", 
            opacity: .1, 
            "stroke-width": this.options.strokeWidth
          }
        )
        ,

        scrubber = paper
          .circle()
          .data( "dialData", dialData )
          .attr({
            scrubber: [relativeValue, relativeMax, radius, center, this.options.strokeWidth],
            stroke: "#B3B3B3",
            "stroke-width": 1,
            fill: "90-#e0e1e2-#fff"
          })
          .drag( navigator.userAgent.match(/Android/i) ? function(){return} : dragHandler )
          .touchmove( dragHandler );

        $(dash.node).attr("stroke-dasharray", "7,2")

  },

  customAttributes: {

    arc: function (relativeValue, relativeMax, radius, center, strokeWidth) {
      
      var angle = 360 / relativeMax * relativeValue, // 
          a = (90 - angle) * Math.PI / 180,
          outerRadius = radius + strokeWidth / 2,
          outerX = center + outerRadius * Math.cos(a),
          outerY = center - outerRadius * Math.sin(a),
          innerRadius = radius - strokeWidth / 2,
          innerX = center + innerRadius * Math.cos(a),
          innerY = center - innerRadius * Math.sin(a),
          path = [
            ["M", center, center - innerRadius],
            ["L", center, center - outerRadius], 
            ["A", outerRadius, outerRadius, 0, +(angle > 180), 1, outerX, outerY],
            ["L", innerX, innerY], 
            ["A", innerRadius, innerRadius, 0, +(angle > 180), 0, center, center - innerRadius]
          ];
      
      return {
        path: path, 
      };
    
    },

    scrubber: function (relativeValue, relativeMax, radius, center, strokeWidth) {
      
      var angle = 360 / relativeMax * relativeValue,
          a = (90 - angle) * Math.PI / 180,
          cx = center + radius * Math.cos(a),
          cy = center - radius * Math.sin(a),
          r = strokeWidth / 2 + 2;

      return {
        cx: cx, 
        cy: cy, 
        r: r, 
      };

    }

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
  $.fn.RaphaelDials = function(options) {
      if (this.length) {
          return this.each(function() {
              var myDials = Object.create(RaphaelDials);
              myDials.init(options, this);
              $.data(this, 'RaphaelDials', myDials);
          });
      }
  };
});