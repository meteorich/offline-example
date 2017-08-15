import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

_Logs = new Ground.Collection('_logs');
_Logs.observeSource(Logs.find());


Template.hello.onCreated(function helloOnCreated() {
  this.subscribe('logs');
  
});

Template.hello.helpers({
  counter() {
    return _Logs.find().count();
  },
  logs() {
    return _Logs.find({}, { sort: { createdAt: -1 } });
  },
  logsOnline() {
    return Logs.find({}, { sort: { createdAt: -1 } });
  }  
});

Template.hello.events({
  'click button'(event, instance) {
    Logs.insert({ createdAt: (new Date) });
  },
});

Template.registerHelper('formatDate', (d) => {
  return moment(d).format('YYYY-MM-DD hh-mm-ss')
})