Template.commentList.helpers({
  // find all comments for current vis
  comments:function(){
    return Comments.find({visid:Session.get("visid")});
  }
})
