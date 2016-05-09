// this variable will store the visualization so we can delete it when we need to 
var visjsobj;

////////////////////////////
///// helper functions for the vis control form
////////////////////////////

  Template.elem_vis_controls.helpers({
    // returns an array of the names of all features of the requested type
    get_feature_names : function(type){
      var feat_field;
      if (type == "single"){
        feat_field = "single_features";
      }
      // pull an example song from the database
      // - we'll use this to find the names of all the single features
      elem = PeriodicTableElements.findOne();
      if (elem != undefined){// looks good! 
        // get an array of all the song feature names 
        // (an array of strings)
        features = Object.keys(elem);
        features_a = new Array();
        // create a new array containing
        // objects that we can send to the template
        // since we can't send an array of strings to the template
        // for (var i=0;i<features.length;i++){
            // features_a[i] = {name:features[i]};
        // }
		features_a[0] = {name:"AtomicWeight"};
		features_a[1] = {name:"MeltingPoint"};
        features_a[2] = {name:"BoilingPoint"};
        features_a[3] = {name:"MolarHeatCapacity"};
        return features_a;
      }
      else {// no element available, return an empty array for politeness
        return [];
      }
    },
	current_feature_name : function(elem) {
		return Session.get("feature").name;
	},
	current_feature_value : function(elem) {
		var name = Session.get("feature").name;
		return elem[name];
	}
  });

////////////////////////////
///// helper functions for the feature list display template
////// (provide the data for that list of songs)
////////////////////////////

// helper that provides an array of feature_values
// for all elements of the currently selected type
// this is used to feed the template that displays the big list of 
// numbers
  Template.elem_feature_list.helpers({
    "get_all_feature_values":function(){
      if (Session.get("feature") != undefined){
        var elems = PeriodicTableElements.find({});
        var features = new Array();
        var ind = 0;
        // build an array of data on the fly for the 
        // template consisting of 'feature' objects
        // describing the song and the value it has for this particular feature
        elems.forEach(function(elem){
          //console.log(song);
            features[ind] = {
              Symbol:elem.Symbol,
              name:elem.name, 
              value:elem[Session.get("feature").name]
            };
            ind ++;
        })
        return features;
      }
      else {
        return [];
      }
    }
  })

////////////////////////////
///// event handlers for the vis control form
////////////////////////////

  Template.elem_vis_controls.events({
    // event handler for when user changes the selected
    // option in the drop down list
    "change .js-select-single-feature":function(event){
      event.preventDefault();
      var feature = $(event.target).val();
      Session.set("feature", {name:feature, type:"single_features"});
    }, 
    // event handler for when the user clicks on the 
    // blobs button
     "click .js-show-blobs":function(event){
      event.preventDefault();
      initBlobVis();
    }, 
    // event handler for when the user clicks on the 
    // timeline button
     "click .js-show-timeline":function(event){
      event.preventDefault();
      initDateVis();
    }, 
  }); 



////////////////////////////
///// functions that set up and display the visualization
////////////////////////////

// function that creates a new blobby visualization
function initBlobVis(){
  // clear out the old visualization if needed
  if (visjsobj != undefined){
    visjsobj.destroy();
  }
  // find all elements from the Elements collection
  var elems = PeriodicTableElements.find({});
  var nodes = new Array();
  var ind = 0;
  // iterate the elements, converting each element into 
  // a node object that the visualizer can understand
    elems.forEach(function(elem){
      // set up a label with the element name and symbol
     var label = "ind: "+ind;
     if (elem.name != undefined){// we have a name
          label = elem.name + " - " + elem.Symbol + " - " + elem[Session.get("feature").name];
      } 
      // figure out the value of this feature for this element
      //var value = song[Session.get("property")["type"]][Session.get("property")["name"]];
      var value = elem[Session.get("feature").name];
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
}
