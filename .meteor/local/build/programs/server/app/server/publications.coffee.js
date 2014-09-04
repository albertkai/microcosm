(function(){__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.publish('users', function() {
  return Meteor.users.find();
});

Meteor.publish('threads', function() {
  return Threads.find();
});

})();

//# sourceMappingURL=publications.coffee.js.map
