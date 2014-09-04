(function(){__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
this.Threads = new Meteor.Collection('threads');

Threads.after.update(function(userId, doc, fieldNames, modifier, options) {
  if (modifier.$push) {
    return Meteor.call('updateUsersThreadsRec', userId, doc, fieldNames, modifier, options);
  }
});

this.ThreadsStream = new Meteor.Stream('threadsStream');

if (Meteor.isClient) {
  ThreadsStream.on(Meteor.userId(), function(id) {
    return MessagesCtrl.utils.notifyWriting(id);
  });
}

if (Meteor.isServer) {
  ThreadsStream.permissions.write(function(eventName) {
    if (this.userId) {
      return true;
    }
  });
  ThreadsStream.permissions.read(function(eventName) {
    if (this.userId === eventName) {
      return true;
    }
  });
}

})();

//# sourceMappingURL=threads.coffee.js.map
