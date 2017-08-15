import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

_Logs = new Ground.Collection('_logs');
_Logs.observeSource(Logs.find());


Template.hello.onCreated(function helloOnCreated() {
  this.subscriptions = {
    'odd' : new ReactiveVar(null),
    'even': new ReactiveVar(null)
  }
});

Template.hello.helpers({

  // connection

  connected() {
    return Meteor.status().connected
  },

  // logs collection subscription status and helpers

  displaySubReady(handleKey) {

      let handle = Template.instance().subscriptions[handleKey].get();
      
      if (!handle) {
        return "No subscription yet";
      } else {
        let ready = handle.ready();
        return `${handle.subscriptionId} ${(ready) ? 'ready' : 'loading...'}`;
      }
  
  },

  displayTemplateSubsReady() {
    let ready = Template.instance().subscriptionsReady()
    return `${(ready) ? 'ready' : 'loading...'}`;
  },

  logs() {
    return _Logs.find({}, { sort: { createdAt: -1 } });
  },

  logsOnline() {
    return Logs.find({}, { sort: { createdAt: -1 } });
  },

  // accounts
  
  loginStatus() {
    if ( Meteor.user() ) {
      return `Logged in with _id ${Meteor.userId()}`
    } else if ( Meteor.loggingIn() ) {
      return `Logging in...`
    } else {
      return `Not logged in`
    }
  },

  userProfile() {
    return Meteor.user() && Meteor.user().profile
  }

});

Template.hello.events({

  'click button.js-insert'(event, instance) {
    Meteor.call( 'logs.insertLog' );
  },

  'click button.js-remove-all-logs'(event, instance) {
    Meteor.call( 'logs.removeAllLogs' );
  },  

  'click button.js-insert-ground'(event, instance) {
    _Logs.insert( createNewLog() );
  },

  'click button.js-subscribe-odd'(event, instance) {
    let h = instance.subscribe('logs.odd');
    instance.subscriptions['odd'].set(h);
  },

  'click button.js-subscribe-even'(event, instance) {
    let h = instance.subscribe('logs.even');
    instance.subscriptions['even'].set(h);
  },

  'click button.js-clear'(event, instance) {
    _Logs.clear();
  },

  'click button.js-keep'(event, instance) {
    _Logs.keep(Logs.find());
  },

  'click button.js-update-user'(event, instance) {
    Meteor.call( 'users.updateUser.loggedInUser' );
  }
  
});

Template.registerHelper('formatDate', (d) => {
  return moment(d).format('YYYY-MM-DD hh-mm-ss')
})

