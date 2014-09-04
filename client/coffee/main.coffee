Session.set('usersLoaded', false)

@log = (el)->
  console.log(el)

#Meteor.call 'getLocale', (err, res)->
#  if err
#    log err
#  else
#    log res


Meteor.setLocale('ru')

Session.set 'mapLoaded', false

#Deps.autorun ->
#  if Meteor.user() and !Session.get('usersLoaded')
#    log 'deps worked!'
#    Session.set('usersLoaded', true)
##    Router.go '/'


Accounts.ui.config {
  requestPermissions: {
    facebook: ['user_likes', 'user_birthday', 'email', 'user_location', 'basic_info', 'user_checkins', 'user_hometown', 'user_interests', 'user_photos', 'user_relationships']
  }
}



#Init loader
Template.mainLayout.rendered = ->

  log 'Main layout rendering'

  MainCtrl['loader'] = new CanvasLoader('main-loader')
  MainCtrl['loader'].setColor('#ffffff')
  MainCtrl['loader'].setDiameter(56)
  MainCtrl['loader'].setDensity(66)
  MainCtrl['loader'].setRange(1)
  MainCtrl['loader'].setFPS(51)
  $(window).scroll ->
    if $('body').scrollTop() > 900 and !$('#go-up').hasClass('_visible')
      $('#go-up').addClass '_visible'
    else if $('body').scrollTop() < 900 and $('#go-up').hasClass('_visible')
      $('#go-up').removeClass '_visible'


Template.mainLayout.events {

  'click #go-up': ->
    $('.main-wrap').scrollTo '0px', 600

  'click .menu-toggle': (e)->

    e.preventDefault()
    if $('.main-wrap').hasClass '_menu-opened'
      $('.main-wrap').removeClass '_menu-opened'
      $('.main-wrap').removeClass '_notifications-opened'
      utils.enableScroll()
    else
      $('.main-wrap').removeClass '_notifications-opened'
      $('.main-wrap').addClass '_menu-opened'
      utils.disableScroll()

  'click .notifications-toggle': (e)->

    e.preventDefault()
    if $('.main-wrap').hasClass '_notifications-opened'
      $('.main-wrap').removeClass '_menu-opened'
      $('.main-wrap').removeClass '_notifications-opened'
      utils.enableScroll()
    else
      $('.main-wrap').addClass '_notifications-opened'
      $('.main-wrap').removeClass '_menu-opened'
      utils.disableScroll()

  'click .logout': (e)->

    e.preventDefault()
    MainCtrl.logout()

  'click .main-wrap._menu-opened, click .main-wrap._notifications-opened': ->

    $('.main-wrap').removeClass '_menu-opened'
    $('.main-wrap').removeClass '_notifications-opened'
    utils.enableScroll()

  'click #open-settings': (e)->

    e.preventDefault()
    MainCtrl.modal.open()


}





UI.body.cloudfrontUrl = 'http://d1jfn2lab933y3.cloudfront.net/'




