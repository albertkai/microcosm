@utils = {

  bgImageLoaded: ($el, callback)->
    MainCtrl.showLoader()
    src = $el.css('background-image').replace(/"/g, '').replace(/url\(|\)$/ig, '')
    image = $('<img>').attr('src', src)
    console.log image
#    image.load ->
#      callback()
#      MainCtrl.hideLoader()
    callback()
    MainCtrl.hideLoader()

  disableScroll: ->

    log 'scroll disabled'
    $('.main-wrap').on 'mousewheel', (e)->
      if (e.target.id == 'el') then return
      e.preventDefault()
      e.stopPropagation()

  enableScroll: ->

    log 'scroll enabled'
    $('.main-wrap').off 'mousewheel'

}


#Utils sessions
Session.set('registration.slidesTriggeredByRoute', true)
