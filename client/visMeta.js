Template.visMeta.helpers({
  // find current visualization
  visualization:function(){
    return Visualizations.findOne({_id:Session.get("visid")});
  }, 
  // test if a user is allowed to edit current vis
  canEdit:function(){
    var vis;
    vis = Visualizations.findOne({_id:Session.get("visid")});
    if (vis){
      if (vis.owner == Meteor.userId()){
        return true;
      }
    }
    return false;
  }
})

/////////
/// EVENTS
////////

Template.visMeta.events({
  // change visualization privacy
  "click .js-tog-private":function(event){
    console.log(event.target.checked);
    var vis = {_id:Session.get("visid"), isPrivate:event.target.checked};
    Meteor.call("updateVisPrivacy", vis);

  }
})
