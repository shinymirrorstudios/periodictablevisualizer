// code that is shared between client and server, i.e. sent to both

// method definitions
Meteor.methods({
  // adding new comments
  addComment:function(comment){
    console.log("addComment method running!");
    if (this.userId){// we have a user
      comment.owner = this.userId;
        return Comments.insert(comment);
    }
    return;
  }, 

  // adding new visualizations
  addVis:function(){
    console.log("calling addVis");
    var vis;
    if (!this.userId){// not logged in
      return;
    }
    else {
      vis = {owner:this.userId, createdOn:new Date(), 
            title:"my new visualization"};
      var id = Visualizations.insert(vis);
      console.log("addVis method: got an id "+id);
      return id;
    }
  }, 
  
  // changing vis privacy settings
  updateVisPrivacy:function(vis){
    console.log("updateVisPrivacy method");
    console.log(vis);
    var realVis = Visualizations.findOne({_id:vis._id, owner:this.userId});
    if (realVis){
      realVis.isPrivate = vis.isPrivate;
      Visualizations.update({_id:vis._id}, realVis);
    }
  },
  
// adding editors to a visualization
  addEditingUser:function(visid){
    var vis, user, eusers;
    vis = Visualizations.findOne({_id:visid});
    if (!vis){return;}// no doc give up
    if (!this.userId){return;}// no logged in user give up
    // now I have a visualization and possibly a user
    user = Meteor.user().profile;
    eusers = EditingUsers.findOne({visid:vis._id});
    if (!eusers){
      eusers = {
        visid:vis._id, 
        users:{}, 
      };
    }
    user.lastEdit = new Date();
    eusers.users[this.userId] = user;

    EditingUsers.upsert({_id:eusers._id}, eusers);
  }
})
