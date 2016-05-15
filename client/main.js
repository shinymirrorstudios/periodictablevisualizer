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

Session.set("featureList", [
		{name:"AtomicWeight", printName: "Atomic Weight"},
		{name:"MeltingPoint", printName: "Melting Point"},
		{name:"BoilingPoint", printName: "Boiling Point"},
		{name:"MolarHeatCapacity", printName: "Molar Heat Capacity"}
]);
Session.set("feature", {feature:Session.get("featureList")[0], type:"numeric"})

