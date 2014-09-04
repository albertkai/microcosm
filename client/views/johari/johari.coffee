Template.johariAside.rendered = ->
  $cont = $(@.find('.johari-start'))
  $cont.addClass '_visible'
  setTimeout ->
    $cont.find('h3').addClass '_visible'
  , 100
  setTimeout ->
    $cont.find('h4').addClass '_visible'
  , 1200
  setTimeout ->
    $cont.find('.circle').first().addClass '_visible'
  , 4000
  setTimeout ->
    $cont.find('.circle').first().next().addClass '_visible'
  , 8000
  setTimeout ->
    $cont.find('button').addClass '_visible'
  , 12000
  log 'johari intro initialized'
#  $cont = $('.johari-aside').find('.johari-start')
#  $cont.find('*').removeClass '_visible'
#  setTimeout ->
#    $cont.removeClass '_visible'
#    UI.insert UI.render(Template.johariAsideContent), $('.johari-insert').get(0)
#    setTimeout ->
#      $cont = $('#johari-container')
#      $cont.removeClass('flip').addClass '_ready'
#    , 400
#  , 1000



Template.johari.events {

  'click #submit-johari': (e)->
    e.preventDefault()

    if $('.trait._selected').length is 5

      results = {}
      $(e.currentTarget).siblings('.traits').find('.trait').each ->
        alias = $(this).data('value')
        log alias
        log $(this).hasClass('_selected')
        if $(this).hasClass('_selected')
          results[alias] = 1
        else
          results[alias] = 0

      log 'Results of initializing johari test, passing results to Johari::init:'
      log results

      Johari.init Meteor.user(), results, ->
        $cont = $('#johari-container')
        $cont.removeClass('flip').addClass '_ready'

    else if $('.trait._selected').length < 5

      MainCtrl.notify 'Упсики!:(', 'Вы должны выбрать ровно 5 определений личности!', 'error'

    else if $('.trait._selected').length > 5

      MainCtrl.notify 'Пиздец!:)', 'Зачем ты занимаешься бредом?))', 'error'

  'click #registration-finish': (e)->

    e.preventDefault()
    #    Johary.johariInit()
    $('#johari-container').removeClass('_ready')
    $('.background').removeClass '_visible'
    Meteor.users.update Meteor.user()._id, {$set: {'profile.registration.status': 'tested'}}
    username = Meteor.user().profile.username
    setTimeout ->
      window.location.href = '/'
    , 400
    log 'Registration passed!'

}

Template.johariAside.events {
  'click #johari-go': ->
    $cont = $('.johari-aside').find('.johari-start')
    $cont.find('*').removeClass '_visible'
    setTimeout ->
      $cont.removeClass '_visible'
      UI.insert UI.render(Template.johariAsideContent), $('.johari-insert').get(0)
    , 1000
}

Template.johariAsideContent.events {

  'click #submit-johari': (e)->

    e.preventDefault()

    if $('.trait._selected').length is 5

      $('#johari-container').removeClass('flip').addClass('_ready')
      id = $('#userId').val()
      results = {}
      $('.trait').each ->
        alias = $(this).data('value')
        if $(this).hasClass '_selected'
          results[alias] = 1
        else
          results[alias] = 0

      Johari.add id, results

    else if $('.trait._selected').length < 5

      MainCtrl.notify 'Упсики!:(', 'Вы должны выбрать ровно 5 определений личности!', 'error'

    else if $('.trait._selected').length > 5

      MainCtrl.notify 'Пиздец!:)', 'Зачем ты занимаешься бредом?))', 'error'

}


Template.johariTraits.rendered = ->

  setTimeout =>
    $('.flip-cont-wrap').addClass 'flip'
  , 200

  gender = 'male'
  translated = []
  markup = ''
  for lang of Meteor.i18nMessages.johari[gender]
    translated.push {
      text: __('johari.' + gender + '.' + lang)
      alias: lang
    }
  counter = 0
  targetCol = $(@.find('.column')).first()
  translated.forEach (trait)->
    traitMarkup = '<p class="trait" data-value="' + trait.alias + '"><span>' + trait.text + '</span></p>'
    if counter < 11
      targetCol.append traitMarkup
      counter++
    else
      log 'alter'
      counter = 1
      targetCol = targetCol.next()
      targetCol.append traitMarkup



Template.johariTraits.events {

  'click .trait': (e)->

    if !$(e.currentTarget).hasClass('_selected')

      if $('.trait._selected').length < 5
        $(e.currentTarget).addClass '_selected'
      else
        MainCtrl.notify 'Вы пытаетесь выбрать больше 5 пунктов', 'Можете убрать выделение с другой черты, если считаете, что эта подходит больше', 'error'

    else

      $(e.currentTarget).removeClass('_selected')

  'click #submit-johari': (e)->

    e.preventDefault()

    #    if $('.trait._selected').length is 5
    #
    #      MainCtrl.notify 'Отлично!', 'Тест пройден!', 'success'
    #      $('#johari-container').removeClass('flip').addClass('_ready')
    #
    #    else if $('.trait._selected').length < 5
    #
    #      MainCtrl.notify 'Упсики!:(', 'Вы должны выбрать ровно 5 определений личности!', 'error'
    #
    #    else if $('.trait._selected').length > 5
    #
    #      MainCtrl.notify 'Пиздец!:)', 'Зачем ты занимаешься бредом?))', 'error'
    results = {}
    $('.trait').each ->
      alias = $(this).data('value')
      if $(this).hasClass '_selected'
        results[alias] = 1
      else
        results[alias] = 0

    Johari.init Meteor.user(), results

}