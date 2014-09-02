Counter = new Meteor.Collection('counter');

if (Meteor.isClient) {

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
      ["one", "two", "three"]  
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
  Meteor.startup(function () {
  });
}
