Counter = new Meteor.Collection('counter');

if (Meteor.isClient) {
  
  Meteor.call('getGists', function(error, result){
    Session.set('gists', result);
  });

  Template.hello.helpers({
    counter: function () {
      if(Meteor.user()){
        var user = Meteor.user().services.github.username;
        var myCounter = Counter.findOne({'name': user});
        if(!myCounter){
          myCounter = Counter.insert({'name': user, 'count': 0});
        }
        return "You have clicked " + myCounter.count + " times";
      } else {
        return "not available";
      }
    },
    name: function(){
      return Meteor.user().services.github.username;
    },
    gists: function(){
      return Session.get('gists'); 
    }
  });

  Template.hello.events({
    'click button': function () {
      var user = Meteor.user().services.github.username;
      var myCounter = Counter.findOne({'name': user});
      Counter.update({_id: myCounter._id}, {$inc: {count: 1}});
    }
  });
}

if (Meteor.isServer) {
  Meteor.methods({
    getGists: function(){
      var GithubApi = Meteor.npmRequire('github');
      var github = new GithubApi({
        version: "3.0.0"
      });

      var gists = Async.runSync(function(done){
        github.gists.getFromUser({user: 'yeehaa123'}, function(err, data){
          done(null, data);
        });
      });

      return gists.result;
    }
  });
  Meteor.startup(function () {
  });
}
