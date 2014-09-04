(function(){__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
if (Meteor.isServer) {
  Meteor.startup(function() {
    this.Future = Npm.require('fibers/future');
    this.fs = Npm.require('fs');
    return process.env.MAIL_URL = 'smtp://postmaster@sandbox32926.mailgun.org:5ty-i8q8jz-3@smtp.mailgun.org:587';
  });
}

})();

//# sourceMappingURL=c7f7922a7c9a8762ea825f2e44cc9556a0d41a8e.map
