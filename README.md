Raphael Dials
====

requires jQuery and Raphael JS

HTML:

    <div id="dials1" class="dials">
        <input type="number" min="100" max="200" value="125">
        <input type="number" min="0" max="100" value="25">
        <input type="number" min="200" max="1000" value="400">
        <input type="number" min="0" max="100" value="25">
        <input type="number" min="20" max="120" value="45">
    </div>
  

    <div id="dials2" class="dials">
        <input type="number" min="20" max="100" value="79">
    </div>

JS:


    $(document).ready(function() {
      
      $('.dials').RaphaelDials({
        size: 400,
        strokeWidth: 29,
        colors: [
            ["#eb4d36", "#fe7b7b"],
            ["#eb7f24", "#faae3a"],
            ["#3d9900", "#82bd5b"],
            ["#0375bf", "#26a7df"],
            ["#5a4274", "#7e5ba2"]
        ]
      });

    });


group HTML5 number input elements into parent divs. Run the plugin on the parent div(s). grouped inputs will be built in concentric dials, with the the first input element getting the largest outer ring. Running the plugin on multiple jquery elements will result in multiple dial groups.

Options
----

`size` : default : `290` : the pixel size of the box that the dials should fit into. the containers are square, so only one number is needed here

`strokeWidth` : default: `30` : the width of the dial stroke

`colors` : default: see above colors option from example code : an array of arrays of gradient color stops. The first item in the array will be the color stops of the outermost dial. The first color of that item is the color stop on the right, the second is the color stop on the left (yes i know it's backwards)