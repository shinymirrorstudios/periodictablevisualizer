// this variable will store the visualization so we can delete it when we need to 
var visjsobj;

////////////////////////////
///// helper functions for the vis control form
////////////////////////////

  Template.elem_vis_controls.helpers({
    // returns an array of the names of all properties of the requested type
    get_types : function(){
		return Session.get("typeList");
    },
    get_properties : function(){
		return Session.get("propertyList");
    },
	current_type_name : function() {
		var visid = Session.get("visid");
		var realVis = Visualizations.findOne({_id:visid});
		return realVis.type;
	},
	current_type_printName : function() {
		var visid = Session.get("visid");
		var realVis = Visualizations.findOne({_id:visid});
		return TypeToPrintName(realVis.type);
	},
	current_property_name : function() {
		var visid = Session.get("visid");
		var realVis = Visualizations.findOne({_id:visid});
		return realVis.property;
	},
	current_property_printName : function() {
		var visid = Session.get("visid");
		var realVis = Visualizations.findOne({_id:visid});
		return PropertyToPrintName(realVis.property);
	},
	current_property_value : function(elem) {
		var visid = Session.get("visid");
		var realVis = Visualizations.findOne({_id:visid});
		var name = realVis.property;
		return elem[name];
	},
	selectedIfTypeMatches : function(value) {
		var visid = Session.get("visid");
		var realVis = Visualizations.findOne({_id:visid});
		return value == realVis.type ? "selected":"";
	},
	selectedIfPropertyMatches : function(value) {
		var visid = Session.get("visid");
		var realVis = Visualizations.findOne({_id:visid});
		return value == realVis.property ? "selected":"";
	},
  });

////////////////////////////
///// helper functions for the property list display template
////// (provide the data for that list of songs)
////////////////////////////

// helper that provides an array of property_values
// for all elements of the currently selected type
// this is used to feed the template that displays the big list of 
// numbers
  Template.elem_property_list.helpers({
    "get_all_property_values":function(){
		// console.log("in get_all_property_values");
		var elems = PeriodicTableElements.find({});
		var properties = new Array();
		var ind = 0;
		// build an array of data on the fly for the 
		// template consisting of 'property' objects
		// describing the song and the value it has for this particular feature
		var visid = Session.get("visid");
		var realVis = Visualizations.findOne({_id:visid});
		// console.log("realVis.property = "+realVis.property);
		elems.forEach(function(elem){
		  //console.log(elem);
			properties[ind] = {
			  Symbol:elem.Symbol,
			  name:elem.name, 
			  value:elem[realVis.property]
			};
			ind ++;
		})
		return properties;
    }
  })

  Template.elem_visjs.helpers({
	"ShowVis" : function() {
		initVis();
		return "";
	},
  })
////////////////////////////
///// event handlers for the vis control form
////////////////////////////

// Requied to ensure that the drawing is drawn the first time
Template.elem_visjs.onRendered(function(){
		initVis();
})

Template.elem_vis_controls.events({
	// event handler for when user changes the selected
	// type in the drop down list
	"change .js-select-type":function(event){
		event.preventDefault();
		var type_name = $(event.target).val();
		var types = Session.get("typeList");
		// console.log("type");
		// console.log(type_name);
//		Session.set("type", {type:{name: type_name, printName:type_printName}});
		var vis = {_id:Session.get("visid"), type:type_name};
        Meteor.call("addEditingUser", Session.get("visid"));
		Meteor.call("updateVisType", vis);
		initVis();
	}, 

	// event handler for when user changes the selected
	// property in the drop down list
	"change .js-select-single-property":function(event){
		event.preventDefault();
		var property_name = $(event.target).val();
		var properties = Session.get("propertyList");
		// console.log("property");
		// console.log(property_name);
//		Session.set("property", {property:{name: property_name, printName:property_printName}, type:"numeric"});
		var vis = {_id:Session.get("visid"), property:property_name};
        Meteor.call("addEditingUser", Session.get("visid"));
		Meteor.call("updateVisProperty", vis);
		initVis();
	}, 
})

////////////////////////////
///// functions that set up and display the visualization
////////////////////////////

// function that creates a new blobby visualization
function initVis(){
	// console.log("Starting initVis");
  // clear out the old visualization if needed
  if (visjsobj != undefined){
	  try {
		visjsobj.destroy();
	  } catch (e) {
		  // console.log("Error trying to destroy visjsobj");
	  }
  }
  var visid = Session.get("visid");
  var realVis = Visualizations.findOne({_id:visid});
  // find all elements from the Elements collection
  var elems = PeriodicTableElements.find({});
  if (realVis.type == "Blob") {
	  var nodes = new Array();
	  var ind = 0;
	  // iterate the elements, converting each element into 
	  // a node object that the visualizer can understand
		elems.forEach(function(elem){
		  // set up a label with the element name and symbol
		 var label = "ind: "+ind;
		 if (elem.name != undefined){// we have a name
			  label = elem.name + " - " + elem.Symbol + " - " + elem[realVis.property];
		  } 
		  // figure out the value of this property for this element
		  //var value = song[Session.get("property")["type"]][Session.get("property")["name"]];
		  var value = elem[realVis.property];
		  // create the node and store it to the nodes array
			nodes[ind] = {
			  id:ind, 
			  label:label, 
			  value:value,
			}
			ind ++;
		})
		// edges are used to connect nodes together. 
		// we don't need these for now...
		edges =[
		];
		// this data will be used to create the visualization
		var data = {
		  nodes: nodes,
		  edges: edges
		};
		// options for the visualization
		 var options = {
		  nodes: {
			shape: 'dot',
		  }
		};
		// get the div from the dom that we'll put the visualization into
		container = document.getElementById('visjs');
		// create the visualisation
		visjsobj = new vis.Network(container, data, options);
  } else if (realVis.type == "3DChart") {
	  
	var counter = 0;
	var data = new vis.DataSet();
    // create some nice looking data with sin/cos
	elems.forEach(function(elem){
       var value = elem[realVis.property];
	   if (value != "") {
		data.add({id:counter++,y:0,x:elem.AtomicNumber,z:value,style:value});
		data.add({id:counter++,y:1,x:elem.AtomicNumber,z:value,style:value});
	   }
    });

	var zMin = 0;
	var zMax = 100;
	var verticalRatio = 1.0;
	var xLabel = propertyToPrintName(realVis.property);
	var yLabel = "";
	var zLabel = "";
	if (realVis.property == "AtomicWeight") {
		zMin = 0;
		zMax = 300;
		verticalRatio = 1.0;
	} else if (realVis.property == "MeltingPoint") {
		zMin = -300;
		zMax = 6000;
		verticalRatio = 1.0;
		xLabel += " (°C)"
	} else if (realVis.property == "BoilingPoint") {
		zMin = -300;
		zMax = 6000;
		verticalRatio = 1.0;
		xLabel += " (°C)"
	} else if (realVis.property == "MolarHeatCapacity") {
		zMin = 0;
		zMax = 80;
		verticalRatio = 1.0;
		xLabel += " (J/mol K)"
	}
    // specify options
    var options = {
        width:  '100%',
        height: '100%',
        style: 'surface',
		// style: 'surface',
        showPerspective: true,
        showGrid: true,
        showShadow: false,
        keepAspectRatio: false,
        verticalRatio: verticalRatio,
		xMin: 1,
		xMax: 118,
		yMin: 0,
		yMax: 118,
		zMin: zMin,
		zMax: zMax,
		xLabel: xLabel,
		yLabel: yLabel,
		zLabel: zLabel,
		cameraPosition: {horizontal: 0, vertical: 0},
    };

		// get the div from the dom that we'll put the visualization into
		container = document.getElementById('visjs');
		// create the visualisation
		visjsobj = new vis.Graph3d(container, data, options);
		
		/*
		var data = new vis.DataSet();
    // create some nice looking data with sin/cos
    var counter = 0;
    var steps = 50;  // number of datapoints will be steps*steps
    var axisMax = 314;
    var axisStep = axisMax / steps;
    for (var x = 0; x < axisMax; x+=axisStep) {
        for (var y = 0; y < axisMax; y+=axisStep) {
            var value = (Math.sin(x/50) * Math.cos(y/50) * 50 + 50);
            data.add({id:counter++,x:x,y:y,z:value,style:value});
        }
    }

    // specify options
    var options = {
        width:  '500px',
        height: '552px',
        style: 'surface',
        showPerspective: true,
        showGrid: true,
        showShadow: false,
        keepAspectRatio: true,
        verticalRatio: 0.5
    };

    // Instantiate our graph object.
    var container = document.getElementById('visjs');
    var graph3d = new vis.Graph3d(container, data, options);
	*/

  }
}

function typeToPrintName(type_name) {
		var types = Session.get("typeList");
		for (var i = 0; i < types.length; i++) {
			var type = types[i];
			if (type.name == type_name) {
				return type.printName;
			}
		}
		return undefined;
}

function propertyToPrintName(property_name) {
		var properties = Session.get("propertyList");
		for (var i = 0; i < properties.length; i++) {
			var property = properties[i];
			if (property.name == property_name) {
				return property.printName;
			}
		}
		return undefined;
}
