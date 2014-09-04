Template.modal.events {

  'click .modal-page .tab-controls li': (e)->

    $target = $(e.currentTarget)
    $tabControls = $target.closest('.tab-controls').find('li')
    $tabs = $target.closest('.modal-page').find('.modal-tabs').find('.modal-tab')
    index = $(e.currentTarget).index()

    $tabControls.removeClass '_active'
    $target.addClass '_active'

    $tabs.removeClass '_visible'
    $tabs.eq(index).addClass '_visible'

    log 'tab #' + index + ' opened'

  'click .close-it': ->

    log 'closing modal..'

    MainCtrl.modal.close()



}