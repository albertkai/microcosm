(function(){__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
if (Meteor.isClient) {
  this.MainCtrl = {
    showLoader: function() {
      this.loader.show();
      return $('#main-loader').addClass('_visible');
    },
    hideLoader: function() {
      $('#main-loader').removeClass('_visible');
      return Meteor.setTimeout((function(_this) {
        return function() {
          return _this.loader.hide();
        };
      })(this), 500);
    },
    logout: function() {
      return Meteor.logout(function() {
        Session.set('usersLoaded', false);
        Session.set('regInitialized', false);
        MainCtrl.notify('До встречи!', 'Ждем вас снова!:)');
        return Router.go('/');
      });
    },
    notify: function(title, text, type, icon) {
      var notifyObject;
      notifyObject = (function() {
        if (title && !type && !text && !icon) {
          return {
            text: title
          };
        } else if (title && text && !type && !icon) {
          return {
            title: title,
            text: text
          };
        } else if (title && text && type && !icon) {
          return {
            title: title,
            text: text,
            type: type
          };
        } else {
          return {
            title: title,
            text: text,
            type: type,
            icon: icon
          };
        }
      })();
      return new PNotify(notifyObject);
    },
    modal: {
      open: function() {
        $('.modal-page').addClass('_opened');
        return $('.modal-overlay').addClass('_visible');
      },
      close: function() {
        $('.modal-page').removeClass('_opened');
        return $('.modal-overlay').removeClass('_visible');
      }
    }
  };
}

})();

//# sourceMappingURL=1d098d2448236d10a7e503a88e74286b224b43dd.map
