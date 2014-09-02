Counter = new Meteor.Collection('counter');

if (Meteor.isClient) {
  // counter starts at 0
  Template.hello.helpers({
    counter: function () {
      return Session.get("counter");
    },
    name: "Roel"
  });

  Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set("counter", Session.get("counter") + 1);
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    Counter.insert({'name': 'myCounter', 'count': 0});
  });
}
