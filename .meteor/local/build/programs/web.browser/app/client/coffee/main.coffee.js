(function(){__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Session.set('usersLoaded', false);

this.log = function(el) {
  return console.log(el);
};

Meteor.setLocale('ru');

Session.set('mapLoaded', false);

Accounts.ui.config({
  requestPermissions: {
    facebook: ['user_likes', 'user_birthday', 'email', 'user_location', 'basic_info', 'user_checkins', 'user_hometown', 'user_interests', 'user_photos', 'user_relationships']
  }
});

Template.mainLayout.rendered = function() {
  log('Main layout rendering');
  MainCtrl['loader'] = new CanvasLoader('main-loader');
  MainCtrl['loader'].setColor('#ffffff');
  MainCtrl['loader'].setDiameter(56);
  MainCtrl['loader'].setDensity(66);
  MainCtrl['loader'].setRange(1);
  MainCtrl['loader'].setFPS(51);
  return $(window).scroll(function() {
    if ($('body').scrollTop() > 900 && !$('#go-up').hasClass('_visible')) {
      return $('#go-up').addClass('_visible');
    } else if ($('body').scrollTop() < 900 && $('#go-up').hasClass('_visible')) {
      return $('#go-up').removeClass('_visible');
    }
  });
};

Template.mainLayout.events({
  'click #go-up': function() {
    return $('.main-wrap').scrollTo('0px', 600);
  },
  'click .menu-toggle': function(e) {
    e.preventDefault();
    if ($('.main-wrap').hasClass('_menu-opened')) {
      $('.main-wrap').removeClass('_menu-opened');
      $('.main-wrap').removeClass('_notifications-opened');
      return utils.enableScroll();
    } else {
      $('.main-wrap').removeClass('_notifications-opened');
      $('.main-wrap').addClass('_menu-opened');
      return utils.disableScroll();
    }
  },
  'click .notifications-toggle': function(e) {
    e.preventDefault();
    if ($('.main-wrap').hasClass('_notifications-opened')) {
      $('.main-wrap').removeClass('_menu-opened');
      $('.main-wrap').removeClass('_notifications-opened');
      return utils.enableScroll();
    } else {
      $('.main-wrap').addClass('_notifications-opened');
      $('.main-wrap').removeClass('_menu-opened');
      return utils.disableScroll();
    }
  },
  'click .logout': function(e) {
    e.preventDefault();
    return MainCtrl.logout();
  },
  'click .main-wrap._menu-opened, click .main-wrap._notifications-opened': function() {
    $('.main-wrap').removeClass('_menu-opened');
    $('.main-wrap').removeClass('_notifications-opened');
    return utils.enableScroll();
  },
  'click #open-settings': function(e) {
    e.preventDefault();
    return MainCtrl.modal.open();
  }
});

UI.body.cloudfrontUrl = 'http://d1jfn2lab933y3.cloudfront.net/';

})();

//# sourceMappingURL=a62163e6edf8b417241d8828b8ffba241c38804b.map
