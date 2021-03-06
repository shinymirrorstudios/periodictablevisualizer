// This collection contains all the periodic table elements
PeriodicTableElements = new Mongo.Collection("periodicTableElements");

// This collection contains all user created visualizations
this.Visualizations = new Mongo.Collection("visualizations");

// This collection contains the editing users
EditingUsers = new Mongo.Collection("editingUsers");

// This collection contains the comments for each visualization
Comments = new Mongo.Collection("comments");

// code sent to client and server
// which gets loaded before anything else (since it is in the lib folder)

// set up a schema controlling the allowable 
// structure of comment objects

// this.Visualizations.attachSchema(new SimpleSchema({
  // owner:{
  	// type: String, 
  // }, 
  // createdOn:{
  	// type: Date, 
  // }, 
  // isPrivate:{
  	// type: Boolean, 
  // }, 
  // title: {
    // type: String,
    // label: "Title",
    // max: 200
  // },
  // type:{
    // type: String,
    // label: "Type",
    // max: 1000  	
  // },
  // property:{
    // type: String,
    // label: "Property",
    // max: 1000  	
  // },
// }));


// set up a schema controlling the allowable 
// structure of comment objects
Comments.attachSchema(new SimpleSchema({
  title: {
    type: String,
    label: "Title",
    max: 200
  },
  body:{
    type: String,
    label: "Comment",
    max: 1000  	
  },
  visid:{
  	type: String, 
  }, 
  owner:{
  	type: String, 
  }, 
  username:{
  	type: String, 
  }, 
  createdOn:{
  	type: Date, 
  }, 
}));
