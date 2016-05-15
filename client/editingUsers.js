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

// helper to remove hyphens from object keys for spacebars.
function fixObjectKeys(obj){
  var newObj = {};
  for (key in obj){
    var key2 = key.replace("-", "");
    newObj[key2] = obj[key];
  }
  return newObj;
}
