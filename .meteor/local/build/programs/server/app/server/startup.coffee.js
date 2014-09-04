(function(){__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.startup(function() {
  this.i18n = Meteor.npmRequire('i18n');
  this.path = Npm.require('path');
  return this.swisseph = Meteor.npmRequire('swisseph');
});

})();

//# sourceMappingURL=startup.coffee.js.map
