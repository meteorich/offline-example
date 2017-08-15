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
  }  

});

Template.hello.events({

  'click button.js-insert'(event, instance) {
    Logs.insert( createNewLog() );
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
  }
  
});

Template.registerHelper('formatDate', (d) => {
  return moment(d).format('YYYY-MM-DD hh-mm-ss')
})

function createNewLog() {
  let number = Math.floor( Random.fraction()*100000 );
  let odd = ( number%2==1 ) ? true : false;
  let createdAt = new Date;
  return { number, odd, createdAt };
}