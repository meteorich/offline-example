import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { EJSON } from 'meteor/ejson';

import './main.html';

Logs.grounded = new Ground.Collection('_logs');
Logs.grounded.observeSource(Logs.find());

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
    return Logs.grounded.find({}, { sort: { createdAt: -1 } });
  },

  logs_online() {
    return Logs.find({}, { sort: { createdAt: -1 } });
  },

  // accounts
  
  userId() {
    return Meteor.userId();
  },

  userStr() {
    return EJSON.stringify( Meteor.user() );
  },

  userStr_online() {
    return EJSON.stringify( Accounts._online_user() );
  },

  loggingIn() {
    return Meteor.loggingIn();
  },

  loggingIn_online() {
    return Accounts._online_loggingIn()
  }

});

Template.hello.events({

  'click button.js-connect'(event, instance) {
    Meteor.reconnect();
  },    

  'click button.js-disconnect'(event, instance) {
    Meteor.disconnect();
  },    

  'click button.js-subscribe-odd'(event, instance) {
    let h = instance.subscribe('logs.odd');
    instance.subscriptions['odd'].set(h);
  },

  'click button.js-subscribe-even'(event, instance) {
    let h = instance.subscribe('logs.even');
    instance.subscriptions['even'].set(h);
  },

  'click button.js-insert'(event, instance) {
    Meteor.call( 'logs.insertLog' );
  },

  'click button.js-remove-all-logs'(event, instance) {
    Meteor.call( 'logs.removeAllLogs' );
  },  

  'click button.js-insert-ground'(event, instance) {
    Logs.grounded.insert( Logs.createNewLog() );
  },

  'click button.js-clear'(event, instance) {
    Logs.grounded.clear();
  },

  'click button.js-keep'(event, instance) {
    Logs.grounded.keep(Logs.find());
  },

  'click button.js-update-user'(event, instance) {
    Meteor.call( 'users.updateUser.loggedInUser' );
  }
  
});

Template.registerHelper('formatDate', (d) => {
  return moment(d).format('YYYY-MM-DD hh-mm-ss')
})

