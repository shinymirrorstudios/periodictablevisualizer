Template.navbar.helpers({
  // retrieve a list of visualizations
  visualizations:function(){
    return Visualizations.find();
  }
})

/////////
/// EVENTS
////////

Template.navbar.events({
  // add vis button
  "click .js-add-vis":function(event){
    event.preventDefault();
    console.log("Add a new visualization!");

    if (!Meteor.user()){// user not available
        alert("You need to login first!");
    }
    else {
      // they are logged in... lets insert a vis
      var id = Meteor.call("addVis", function(err, res){
        if (!err){// all good
          console.log("event callback received id: "+res);
          Session.set("visid", res);            
        }
      });
    }
  }, 
  // load vis button
  "click .js-load-vis":function(event){
    //console.log(this);
    Session.set("visid", this._id);
  }
})

