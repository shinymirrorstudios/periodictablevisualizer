// define a startup script that 
// reads the JSON data files from the filesystem 
// and inserts them into the database if needed

	Meteor.startup(function(){
		if (!PeriodicTableElements.findOne()){
		console.log("no elements yet... creating from filesystem");
		// pull in the NPM package 'fs' which provides
		// file system functions
		var fs = Meteor.npmRequire('fs');
		// get a list of files in the folder private/jsonfiles, which
		// ends up as assets/app/jsonfiles in the app once it is built
		var files = fs.readdirSync('./assets/app/jsonfiles/');
		// iterate the files, each of which should be a 
		// JSON file containing song data.
		var inserted_elements = 0;
		try{
		// in case the file does not exist, put it in a try catch
			var filename = 'jsonfiles/'+files[0];
			var periodicTable = JSON.parse(Assets.getText(filename));

			var property_keys = Object.keys(periodicTable.Elements[0]);
			
			for (var i = 0; i < periodicTable.Elements.length; i++) {
				var Element = periodicTable.Elements[i];
				PeriodicTableElements.insert(Element);
				inserted_elements ++;
			}
		}catch (e){
			console.log("error parsing file "+filename);
			console.log(e);
		}
		console.log("Inserted "+inserted_elements+" new elements...");
	}
	})

	Meteor.publish("periodicTableElements", function(){
		return PeriodicTableElements.find();
	})
	
	Meteor.publish("visualizations", function(){
		return Visualizations.find({
			$or:[
					{isPrivate:{$ne:true}}, 
					{owner:this.userId}
				] 
		});
	})
	
	Meteor.publish("editingUsers", function(){
		return EditingUsers.find();
	})
	
	Meteor.publish("comments", function(){
		return Comments.find();
	})
