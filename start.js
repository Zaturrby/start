Names = new Meteor.Collection('names');

if (Meteor.isClient) {

  Template.hello.helpers({
    names: function(){
      var namesList = ["Loading usernames"];

      if (Meteor.user()){
        var user = Meteor.user().services.github.username;

        if(Names.findOne({'name': user})) {
          console.log("User already in the DB");
        } else {
          Names.insert({'name': user});
          console.log("User stored in the DB");
        }
      }

      var namesList = Names.find({}).fetch().map(function(singleName){
        return singleName.name;
      });

      return namesList;
    },
    gists: function () {
      if(Session.get('nameSelected')){

        if (window.doIt) {
          Meteor.call('removeNames');
        }

        Meteor.call('getGists', Session.get('nameSelected'), function(error, result){
         Session.set('gists', result);
        });
        
        if (Session.get('gists')) {
          if(Session.get('gists').length != 0){
            return Session.get('gists');
          } else {
            return [{ "url": ["User has no gists."]}];
          } 
        } else {
          return [{"url": ["Loading gists!"]}];
        }
      } else {
        return [{ "url": ["Select username to see gists"]}];
      } 
    }
  });

  Template.hello.events({
    'click li a': function (evnt) {
      var selectedName = evnt.target.innerHTML;
      Session.set('nameSelected', selectedName);
    }
  });
}

if (Meteor.isServer) {
  Meteor.methods({
    removeNames: function() {
      Names.remove({}, function(){
        console.log("removed all names");
      });
    },
    getGists: function(user){
      var GithubApi = Meteor.npmRequire('github');
      var github = new GithubApi({
        version: "3.0.0"
      });

      var gists = Async.runSync(function(done){
        github.authenticate({
          type: "basic",
          username: "ZaturrbyTester",
          password: "SolidSnake25"
        });

        github.gists.getFromUser({"user": user}, function(err, data){
          done(null, data);
        });

      });

      if (gists.result) {
        return gists.result;
       } else {
        return [{"url": ["Error retrieving the gists from github"]}];
       }
    }
  });
  Meteor.startup(function () {
  });
}
