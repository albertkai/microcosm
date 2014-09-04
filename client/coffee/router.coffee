Router.configure {
  notFoundTemplate: 'notFound'
  loadingTemplate: 'loading'
}

Router.onBeforeAction ->
  if Response.deviceW() < 900
    @go 'mobile'

Router.onBeforeAction (pause)->
  if !@ready
    log 'loading'
    @render 'loading'
    pause()


Router.map ->

  @route 'base', {
    path: '/'
    waitOn: ->
      Meteor.subscribe('users')
#    onBeforeAction: ->
#      if !Meteor.loggingIn() and !Meteor.user()
#        @redirect 'hello'
    action: ->
      if Meteor.userId() && Meteor.user()
        user = Meteor.user()
        console.log 'youLogged'
        status = user.profile.registration.status
        if status is 'tested'
          log 'redirecting to username from base route'
          username = user.profile.username
          @redirect '/' + username
        else
          log 'redirecting to registration/hello from base route'
          @redirect 'registration/hello'
      else
        @redirect 'hello'
  }

  @route 'hello', {
    template: 'hello'
    onBeforeAction: ->
      if Meteor.user()
        @redirect '/'
  }

  @route 'registration', {
    layoutTemplate: 'registration'
    action: ->
      if !Meteor.user()
        Router.go 'base'
      else
#        @render()
  }

  @route 'mobile'

  @route 'registration/hello', {
    layoutTemplate: 'registrationLayout'
    template: 'registration'
    waitOn: ->
      Meteor.subscribe('users')
    action: ->
      if !Meteor.user()
        log 'redirecting to base'
        Router.go 'base'
      else
        log Meteor.user()
        @render()
#        log 'registration/hello, found user'
#        status = Meteor.user().profile.registration.status
#        if status is "justRegistered"
#          log 'router is rendering info template from action'
#          UI.insert UI.render(Template.info), $('#info-insert').get(0)
#        else if status is "testing"
#          log 'router is rendering testing template from action'
#          $('.reg-step').find('>div').removeClass '_active'
#          $('.reg-step').find('>div').eq(1).addClass '_active'
#          marginTop = 0 - $(window).height()
#          $('.registration').find('.info').css('margin-top', marginTop + 'px')
#          UI.insert UI.render(Template.testing_cont), $('#testing-insert').get(0)
  }



  @route 'profile', {
    path: '/:username'
    layoutTemplate: 'mainLayout'
    template: 'profile'
    waitOn: ->
      Meteor.subscribe('users')
    data: ->
      if Meteor.userId() && Meteor.user()
        user = Meteor.users.findOne({'profile.username': @params.username})
        profile = user.profile
        id = user._id
        {
          profile: profile
          userId: id
        }
    action: ->

      if Meteor.userId()
        Session.set('currentUsersPage', @params.username)
        log 'session set!!'
        log Session.get('currentUsersPage')
        @render()
  }

  @route 'johari', {

    path: 'johari/:id'
    template: 'johariAside'

    waitOn: ->
      Meteor.subscribe('users')

    data: ->
      id = @params.id
      user = Meteor.users.findOne @params.id
      {
        name: user.profile.firstName
        id: id
      }

    action: ->
      if Meteor.user()
        id = Meteor.user()._id
        if @params.id is id
          @redirect "johariYours"
      else
        @render()

  }

  @route 'johariYours'

  @route 'settings', {

    action: ->

      MainCtrl.modal.open()

  }