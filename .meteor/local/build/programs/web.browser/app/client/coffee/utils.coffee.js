(function(){__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
this.utils = {
  bgImageLoaded: function($el, callback) {
    var image, src;
    MainCtrl.showLoader();
    src = $el.css('background-image').replace(/"/g, '').replace(/url\(|\)$/ig, '');
    image = $('<img>').attr('src', src);
    console.log(image);
    callback();
    return MainCtrl.hideLoader();
  },
  disableScroll: function() {
    log('scroll disabled');
    return $('.main-wrap').on('mousewheel', function(e) {
      if (e.target.id === 'el') {
        return;
      }
      e.preventDefault();
      return e.stopPropagation();
    });
  },
  enableScroll: function() {
    log('scroll enabled');
    return $('.main-wrap').off('mousewheel');
  }
};

Session.set('registration.slidesTriggeredByRoute', true);

})();

//# sourceMappingURL=d3626f2f64eef8f9bf16c57af0bdf4edde2b524b.map
