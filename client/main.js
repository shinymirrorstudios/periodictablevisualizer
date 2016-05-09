// subscribe to read data
Meteor.subscribe("periodicTableElements");
Meteor.subscribe("visualizations");
Meteor.subscribe("editingUsers");
Meteor.subscribe("comments");

// set up the iron router
Router.configure({
  layoutTemplate: 'ApplicationLayout'
});

// 'home' page
Router.route('/', function () {
  console.log("you hit / ");
  this.render("navbar", {to:"header"});
  this.render("visList", {to:"main"});  
});

// individual visualization page
Router.route('/visualizations/:_id', function () {
  console.log("you hit /visualizations  "+this.params._id);
  Session.set("visid", this.params._id);
  this.render("navbar", {to:"header"});
  this.render("visItem", {to:"main"});  
});


