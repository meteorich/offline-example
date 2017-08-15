import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
});

Meteor.publish('logs.odd', function() {
  Meteor._sleepForMs(1000);         // simulate delayed response from server
  return Logs.find({ odd: true });
});

Meteor.publish('logs.even', function() {
  Meteor._sleepForMs(1000);         // simulate delayed response from server
  return Logs.find({ odd: false });
});
