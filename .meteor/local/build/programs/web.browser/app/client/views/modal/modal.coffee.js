(function(){__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Template.modal.events({
  'click .modal-page .tab-controls li': function(e) {
    var $tabControls, $tabs, $target, index;
    $target = $(e.currentTarget);
    $tabControls = $target.closest('.tab-controls').find('li');
    $tabs = $target.closest('.modal-page').find('.modal-tabs').find('.modal-tab');
    index = $(e.currentTarget).index();
    $tabControls.removeClass('_active');
    $target.addClass('_active');
    $tabs.removeClass('_visible');
    $tabs.eq(index).addClass('_visible');
    return log('tab #' + index + ' opened');
  },
  'click .close-it': function() {
    log('closing modal..');
    return MainCtrl.modal.close();
  }
});

})();

//# sourceMappingURL=451e0799b8f77519b2e3430d39be315f6206630a.map
