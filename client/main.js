import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Template.hello.onCreated(function helloOnCreated() {
  this.subscribe('logs');
});

Template.hello.helpers({
  counter() {
    return Logs.find().count();
  },
  logs() {
    return Logs.find({}, { sort: { createdAt: -1 } });
  }
});

Template.hello.events({
  'click button'(event, instance) {
    Logs.insert({ createdAt: (new Date) });
  },
});
