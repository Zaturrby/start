Names = new Meteor.Collection('names');

if (Meteor.isClient) {

  Template.hello.helpers({
    names: function(){
      var namesList = ["Loading usernames"];
      
      if (Meteor.user()){
        var user = Meteor.user().services.github.username;

        if(Names.findOne({'name': user})) {
          console.log("user already in the MiniMongoNamesDB");
        } else {
          Names.insert({'name': user});
          console.log("new user inserted in the DB");
        }
      }

      var namesList = Names.find({}).fetch().map(function(singleName){
        return singleName.name;
      });

      return namesList;
    },
    gists: function () {
      if(Session.get('nameSelected')){

        // calling serverside Gistfunction
        Meteor.call('getGists', Session.get('nameSelected'), function(error, result){
         Session.set('gists', result);
        });

        // setting return values
        var noGists = [ { "url": ["Gists are loading or user has no gists"] } ];
        
        if(Session.get('gists')){
          return Session.get('gists');
        } else {
          return noGists;
        } 

      } else {
        var noUser = [ { "url": ["Select username to see gists"] } ];
        return noUser;
      } 
    }
  });

  Template.hello.events({
    'click button': function () {
      var user = Meteor.user().services.github.username;
      var myCounter = Counter.findOne({'name': user});
      Counter.update({_id: myCounter._id}, {$inc: {count: 1}});
    },
    'click li a': function (evnt) {
      var selectedName = evnt.target.innerHTML;
      Session.set('nameSelected', selectedName);
    }
  });
}

if (Meteor.isServer) {
  Meteor.methods({
    getNames: function() {

    },
    getGists: function(user){
      var GithubApi = Meteor.npmRequire('github');
      var github = new GithubApi({
        version: "3.0.0"
      });

      var gists = Async.runSync(function(done){
        github.gists.getFromUser({"user": user}, function(err, data){
          done(null, data);
        });
      });

      return gists.result;
    }
  });
  Meteor.startup(function () {
  });
}
