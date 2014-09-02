Counter = new Meteor.Collection('counter');

if (Meteor.isClient) {

  Template.hello.helpers({
    counter: function () {
      var user ;
      if(Meteor.user()){
        user = Meteor.user().services.github.username;
        console.log(user);
      }
      var myCounter = Counter.findOne({'name': 'myCounter'});
      return myCounter;
    },
    name: "Roel"
  });

  Template.hello.events({
    'click button': function () {
      var myCounter = Counter.findOne({'name': 'myCounter'});
      Counter.update({_id: myCounter._id}, {$inc: {count: 1}});
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    Counter.remove({});
    Counter.insert({'name': 'myCounter', 'count': 0});
  });
}
