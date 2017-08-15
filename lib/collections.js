Logs = new Mongo.Collection('logs');

Logs.createNewLog = () => {
    let number = Math.floor( Random.fraction()*100000 );
    let odd = ( number%2==1 ) ? true : false;
    let createdAt = new Date;
    return { number, odd, createdAt };
};

Meteor.methods({
    
  'users.updateUser.loggedInUser'() {
    let loggedInUserId = this.userId;

    if (!loggedInUserId) {
      throw new Meteor.Error('not-logged-in', "Not logged in");
    }

    console.log(`Running update user method as user ${loggedInUserId}`);

    Meteor.users.update(loggedInUserId, {
      $inc: { 'profile.counter': 1 }
    });
  },

  'logs.insertLog'() {
    let loggedInUserId = this.userId;

    console.log(`Running insert log method as user ${loggedInUserId || '(not logged in)'}`);

    Logs.insert( Logs.createNewLog() );
  },

  'logs.removeAllLogs'() {
    console.log(`Removing all logs`);
    Logs.remove({});
  }

});