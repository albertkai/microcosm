if Meteor.isClient

  @MainCtrl = {

    showLoader: ->

      @loader.show()
      $('#main-loader').addClass('_visible')

    hideLoader: ->
      $('#main-loader').removeClass('_visible')
      Meteor.setTimeout =>
        @loader.hide()
      , 500

    logout: ->

      Meteor.logout ->

        Session.set('usersLoaded', false)
        Session.set('regInitialized', false)
        MainCtrl.notify 'До встречи!', 'Ждем вас снова!:)'
        Router.go '/'

    notify: (title, text, type, icon)->

      notifyObject = do ->
        if title and !type and !text and !icon
          {
            text: title
          }
        else if title and text and !type and !icon
          {
            title: title
            text: text
          }
        else if title and text and type and !icon
          {
            title: title
            text: text
            type: type
          }

        else
          {
            title: title
            text: text
            type: type
            icon: icon
          }

      new PNotify notifyObject

    modal: {

      open: ->

        $('.modal-page').addClass '_opened'
        $('.modal-overlay').addClass '_visible'

      close: ->

        $('.modal-page').removeClass '_opened'
        $('.modal-overlay').removeClass '_visible'

    }

  }