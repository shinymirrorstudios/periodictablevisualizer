Template.editor.helpers({
  // get current vis id
  visid:function(){
    setupCurrentVisualization();
    return Session.get("visid");
  }, 
  // set up the editor
  config:function(){
    return function(editor){
      editor.setOption("lineNumbers", true);
      editor.setOption("theme", "cobalt");
      editor.on("change", function(cm_editor, info){
        $("#viewer_iframe").contents().find("html").html(cm_editor.getValue());
        Meteor.call("addEditingUser", Session.get("visid"));
      });        
    }
  }, 
});


Template.editingUsers.helpers({
  // retrieve a list of users
  users:function(){
    var vis, eusers, users;
    vis = Visualizations.findOne({_id:Session.get("visid")});
    if (!vis){return;}// give up
    eusers = EditingUsers.findOne({visid:vis._id});
    if (!eusers){return;}// give up
    users = new Array();
    var i = 0;
    for (var user_id in eusers.users){
        users[i] = fixObjectKeys(eusers.users[user_id]);
        i++;
    }
    return users;
  }
})

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

Template.editableText.helpers({
    // test if a user is allowed to edit current vis
  userCanEdit : function(vis,Collection) {
    // can edit if the current vis is owned by me.
    vis = Visualizations.findOne({_id:Session.get("visid"), owner:Meteor.userId()});
    if (vis){
      return true;
    }
    else {
      return false;
    }
  }    
})

Template.insertCommentForm.helpers({
  // find current vis id
  visid:function(){
    return Session.get("visid");
  }, 
})

Template.commentList.helpers({
  // find all comments for current vis
  comments:function(){
    return Comments.find({visid:Session.get("visid")});
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

// helper to make sure a vis is available
function setupCurrentVisualization(){
  var vis;
  if (!Session.get("visid")){// no vis id set yet
    vis = Visualizations.findOne();
    if (vis){
      Session.set("visid", vis._id);
    }
  }
}
// helper to remove hyphens from object keys for spacebars.
function fixObjectKeys(obj){
  var newObj = {};
  for (key in obj){
    var key2 = key.replace("-", "");
    newObj[key2] = obj[key];
  }
  return newObj;
}
