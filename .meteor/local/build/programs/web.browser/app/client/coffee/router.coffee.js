(function(){__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Router.configure({
  notFoundTemplate: 'notFound',
  loadingTemplate: 'loading'
});

Router.onBeforeAction(function() {
  if (Response.deviceW() < 900) {
    return this.go('mobile');
  }
});

Router.onBeforeAction(function(pause) {
  if (!this.ready) {
    log('loading');
    this.render('loading');
    return pause();
  }
});

Router.map(function() {
  this.route('base', {
    path: '/',
    waitOn: function() {
      return Meteor.subscribe('users');
    },
    action: function() {
      var status, user, username;
      if (Meteor.userId() && Meteor.user()) {
        user = Meteor.user();
        console.log('youLogged');
        status = user.profile.registration.status;
        if (status === 'tested') {
          log('redirecting to username from base route');
          username = user.profile.username;
          return this.redirect('/' + username);
        } else {
          log('redirecting to registration/hello from base route');
          return this.redirect('registration/hello');
        }
      } else {
        return this.redirect('hello');
      }
    }
  });
  this.route('hello', {
    template: 'hello',
    onBeforeAction: function() {
      if (Meteor.user()) {
        return this.redirect('/');
      }
    }
  });
  this.route('registration', {
    layoutTemplate: 'registration',
    action: function() {
      if (!Meteor.user()) {
        return Router.go('base');
      } else {

      }
    }
  });
  this.route('mobile');
  this.route('registration/hello', {
    layoutTemplate: 'registrationLayout',
    template: 'registration',
    waitOn: function() {
      return Meteor.subscribe('users');
    },
    action: function() {
      if (!Meteor.user()) {
        log('redirecting to base');
        return Router.go('base');
      } else {
        log(Meteor.user());
        return this.render();
      }
    }
  });
  this.route('profile', {
    path: '/:username',
    layoutTemplate: 'mainLayout',
    template: 'profile',
    waitOn: function() {
      return Meteor.subscribe('users');
    },
    data: function() {
      var id, profile, user;
      if (Meteor.userId() && Meteor.user()) {
        user = Meteor.users.findOne({
          'profile.username': this.params.username
        });
        profile = user.profile;
        id = user._id;
        return {
          profile: profile,
          userId: id
        };
      }
    },
    action: function() {
      if (Meteor.userId()) {
        Session.set('currentUsersPage', this.params.username);
        log('session set!!');
        log(Session.get('currentUsersPage'));
        return this.render();
      }
    }
  });
  this.route('johari', {
    path: 'johari/:id',
    template: 'johariAside',
    waitOn: function() {
      return Meteor.subscribe('users');
    },
    data: function() {
      var id, user;
      id = this.params.id;
      user = Meteor.users.findOne(this.params.id);
      return {
        name: user.profile.firstName,
        id: id
      };
    },
    action: function() {
      var id;
      if (Meteor.user()) {
        id = Meteor.user()._id;
        if (this.params.id === id) {
          return this.redirect("johariYours");
        }
      } else {
        return this.render();
      }
    }
  });
  this.route('johariYours');
  return this.route('settings', {
    action: function() {
      return MainCtrl.modal.open();
    }
  });
});

})();

//# sourceMappingURL=1c999dacce93043f0921007c0090a1f206ed27b4.map
