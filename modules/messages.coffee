if Meteor.isClient


  Template.message.helpers {

    getYours: (id)->
      if id is Meteor.user()._id
        'yours'
      else
        ''

    showDate: (date)->
      moment(date).lang('ru').calendar()
  }

  Template.messages.helpers {

    showDate: (date)->
      moment(date).lang('ru').calendar()

    showMessage: (message, type)->

      if type is 'text'
        message
      else if type is 'smile'
        '<i class="fa fa-picture-o" style="color: #ccc; margin-left: 7px;"></i>'

  }

  Template.messagesCont.helpers {

    getHeaderName: (members)->
      string = ''
      id = Meteor.user()._id
      members.forEach (m)->
        if id isnt m.id
          string += m.firstName + ' ' + m.lastName + ', '
      string.substring(0, string.length - 2)

  }

  Template.messages.rendered = ->

    $firstThread = $('#threads-list').find('li').first()
    $firstThread.addClass '_active'
    Deps.autorun ->
      user = Meteor.users.findOne({'profile.username': Session.get('currentUsersPage')})
      if user
        threadId = user.profile.com.messenger.threads[0].threadId
        threadData = Threads.findOne({_id: threadId})
        Session.set('messagesThreadId', Meteor.user().profile.com.messenger.threads[0].threadId)

        UI.insert UI.renderWithData(Template.messagesCont, threadData), $('#messages-insert').get(0)

    Deps.autorun ->

      log 'Deps called for messages!'
      targetThread = Threads.findOne({_id: Session.get('messagesThreadId')})
      if targetThread
        count = targetThread.total
        threadData = Threads.findOne({_id: Session.get('messagesThreadId')})
        $('#messages-insert').empty()
        UI.insert UI.renderWithData(Template.messagesCont, threadData), $('#messages-insert').get(0)


  Template.messagesCont.rendered = ->

    $('#messages-cont').get(0).scrollTop = $('#messages-cont').get(0).scrollHeight



  Template.messages.events {

    'click .attach-cont .smile': (e)->
      path = $(e.currentTarget).css('background-image')
      path = path.replace('url(','').replace(')','').replace('"', '').replace('"', '')
      $img = $('<img>').attr('src', path).attr('alt', 'meme')
      message = $img.wrap("<div />").parent().html()
      threadId = $('#userMessage').data('threadid')
      userId = Meteor.user()._id
      attach = false
      MessagesCtrl.sendMessage(threadId, userId, message, 'smile', attach)

    'click #threads-list > li': (e)->

      $('#threads-list > li').removeClass '_active'
      $(e.currentTarget).addClass '_active'

      threadId = $(e.currentTarget).data('threadid')
      threadData = Threads.findOne({_id: threadId})

      Session.set('messagesThreadId', threadId)
      Meteor.call('setThreadStatus', threadId)


    'click #record-audio': ->

#      $('.recorder').addClass '_visible'
#      $('.modal-overlay.higher').addClass '_visible'
      MainCtrl.notify 'Прости бро:(', 'Мы еще не успели реализовать эту функцию:( Скоро все будет, обещаем!=)', 'error'

    'click #close-recorder': ->

      $('.recorder').removeClass '_visible'
      $('.modal-overlay.higher').removeClass '_visible'

    'click #attach-photo': ->
      $('#choose-more').removeClass '_hover'
      MainCtrl.notify 'Сорри бро(', 'Мы пока налаживаем серверы, по-этому функция временно недоступна:( Скоро все заработает, обещаем!))'

    'click #make-photo': ->
      $('#choose-more').removeClass '_hover'
      MainCtrl.notify 'Сорри бро(', 'Мы пока налаживаем серверы, по-этому функция временно недоступна:( Скоро все заработает, обещаем!))'

    'click #start-rec': ->

      $('.recorder').removeClass('_initial').addClass('_recording')
      ion.sound.play 'glass'

    'click #stop-rec': ->

      $('.recorder').removeClass('_recording').addClass('_recorded')

    'click #rec-new': ->

      $('.recorder').removeClass('_recorded').addClass('_initial')

    'click .message.audio .play': (e)->

      $targetDiv = $(e.currentTarget).closest('.controls')
      $targetDiv.removeClass('_paused').addClass('_playing')

    'click .message.audio .pause': (e)->

      $targetDiv = $(e.currentTarget).closest('.controls')
      $targetDiv.removeClass('_playing').addClass('_paused')

    'click .recorder .play': (e)->

      $targetDiv = $(e.currentTarget).closest('.lower-controls')
      $targetDiv.removeClass('_paused').addClass('_playing')

    'click .recorder .pause': (e)->

      $targetDiv = $(e.currentTarget).closest('.lower-controls')
      $targetDiv.removeClass('_playing').addClass('_paused')

    'focus #userMessage': (e)->

      log $(e.currentTarget).get(0).scrollHeight
      MessagesCtrl.view.textareaHeight = $(e.currentTarget).get(0).scrollHeight
      MessagesCtrl.view.textareaHeightStep = 18

    'keypress #userMessage': (e)->

      if e.which is 13
        e.preventDefault()

    'keyup #userMessage': (e)->

      keyID = e.which

      if keyID is 8

        log 'backspace'
        val = $(e.currentTarget).val()
        $('#messageHeightMeter').html(val)
        newLineNumber = Math.floor $('#messageHeightMeter').get(0).scrollHeight / MessagesCtrl.view.step
        if newLineNumber isnt MessagesCtrl.view.linesNumber and MessagesCtrl.view.linesNumber > 1

          if MessagesCtrl.view.linesNumber < 5
            MessagesCtrl.view.decreaseHeight()
          MessagesCtrl.view.linesNumber = newLineNumber

      else if keyID is 13

        e.preventDefault()
        threadId = $(e.currentTarget).data('threadid')
        userId = Meteor.user()._id
        message = $(e.currentTarget).val()
        attach = false
        MessagesCtrl.sendMessage(threadId, userId, message, 'text', attach)


      else

        height = $(e.currentTarget).get(0).scrollHeight
        val = $(e.currentTarget).val()
        threadId = $(e.currentTarget).data('threadid')
        $('#messageHeightMeter').html(val)
        if MessagesCtrl.view.textareaHeight isnt height
          if MessagesCtrl.view.textareaHeight < height
            if height < 100
              log 'invalidated'
              MessagesCtrl.view.increaseHeight(height)
          else
            log 'increasing'
        users = do ->
          arr = []
          Threads.findOne({'_id': threadId}).members.forEach (m)->
            arr.push m.id
          arr
        users.forEach (id)->
          ThreadsStream.emit id, threadId

    'mouseenter .smile-hover': ->

      $('.smile-hover').addClass '_hover'

    'mouseenter .gif-hover': ->

      $('.gif-hover').addClass '_hover'

    'mouseenter .more-hover': ->

      $('.more-hover').addClass '_hover'

    'mouseleave .smile-hover': ->

      $('.smile-hover').removeClass '_hover'

    'mouseleave .gif-hover': ->

      $('.gif-hover').removeClass '_hover'

    'mouseleave .more-hover': ->

      $('.more-hover').removeClass '_hover'

  }

  @MessagesCtrl = {

    view: {

      textareaHeight: 0

      step: 18

      linesNumber: 1

      increaseHeight: (height)->


        $('#userMessage').height($('#userMessage').height() + @step)
        $('#messages-cont').height($('#messages-cont').height() - @step)
        $('#new-message').height($('#new-message').height() + @step)
        @textareaHeight = $('#userMessage').get(0).scrollHeight
        gradBottom = parseInt $('.grad.bottom').css('bottom'), 10
        $('.grad.bottom').css('bottom', gradBottom + MessagesCtrl.view.step + 'px')
        @linesNumber = Math.floor $('#messageHeightMeter').get(0).scrollHeight / @step

      decreaseHeight: (height)->

        log 'decreasing'
        $('#userMessage').height($('#userMessage').height() - @step)
        $('#messages-cont').height($('#messages-cont').height() + @step)
        $('#new-message').height($('#new-message').height() - @step)
        gradBottom = parseInt $('.grad.bottom').css('bottom'), 10
        $('.grad.bottom').css('bottom', gradBottom - MessagesCtrl.view.step + 'px')
        MessagesCtrl.view.textareaHeight = $('#userMessage').get(0).scrollHeight
        @linesNumber = Math.floor $('#messageHeightMeter').get(0).scrollHeight / @step

      clear: ->
        #


    }

    sendMessage: (threadId, userId, message, type, attach)->

      Meteor.call 'sendMessage', threadId, userId, message, type, attach, (err, res)->

        if err

          MainCtrl.notify 'Упсики(', 'Сообщение не передано, попробуйте еще раз', 'error'

        else

         log 'Все ок! Сообщение отправлено!!'

    utils: {

      notifyWriting: (id)->

        $elem = $('#threads-list').find('[data-threadId="' + id + '"]')

        if $elem.length > 0
          if @timeout
            clearTimeout @timeout
          $elem.addClass '_writing'
          @timeout = setTimeout ->
            $elem.removeClass '_writing'
          , 500

    }


  }


if Meteor.isServer

  Meteor.methods {

    'sendMessage': (threadId, userId, message, type, attach)->

      message = {
        userId: userId,
        date: new Date()
        message: message
        type: type
        attach: false
      }

      setTotal = Threads.findOne({'_id': threadId}).total + 1
      Threads.update threadId, {$push: {'messages': message}, $set: {'total': setTotal}} #Messenger in users coll gets updated with hooks. Watch collections/threads.coffee


    'sendAudio': (threadId, userId, audio)->

      message = {
        userId: userId,
        date: new Date()
        message: audio
        type: 'audio'
        attach: false
      }

      Threads.update threadId, {$push: {'messages': message}}

      console.log 'message Sent'
      console.log threadId

    'deleteMessage': ->
      console.log 'delete'


    'listObjects': (bucket)->

      s3 = new AWS.S3()

      f = new Future()

      params = {
        Bucket: bucket,
      }

      s3.listObjects params, (err, data)->
        if (err)
          console.log(err, err.stack)
          f.return(false)
        else
          console.log(data)
          f.return(data)

      f.wait()

    'updateUsersThreadsRec': (userId, doc, fieldNames, modifier, options)->

      lastMessage = {
        date: modifier.$push.messages.date
        type: modifier.$push.messages.type
        message: modifier.$push.messages.message
      }
      Meteor.users.update {'profile.com.messenger.threads.threadId': doc._id}, {$set: {'profile.com.messenger.threads.$.allRead': false}}, {multi: true}
      Meteor.users.update {'profile.com.messenger.threads.threadId': doc._id}, {$set: {'profile.com.messenger.threads.$.lastMessage': lastMessage}}, {multi: true}
      Meteor.users.find({'profile.com.messenger.threads.threadId': doc._id}).fetch().forEach (user)->
        id = user._id
        newCount = Meteor.users.findOne({'_id': id}).profile.com.messenger.count + 1
        newUnread = Meteor.users.findOne({'_id': id}).profile.com.messenger.unread + 1
        Meteor.users.update {'_id': id}, {$set: {'profile.com.messenger.count': newCount}, $set: {'profile.com.messenger.unreadCount': newUnread}}
      console.log 'Members.com.messenger updated'
      console.log Meteor.users.find('profile.com.messenger.threads.threadId': doc._id).fetch()
      console.log doc._id

    'setThreadStatus': (id)->

      threadUnread = Threads.findOne({'_id': id}).unreadCount
      totalUnread = Meteor.user
      Meteor.users.update {'profile.com.messenger.threads.threadId': id}, {$set: {'profile.com.messenger.threads.$.allRead': true}}, {multi: true}
      Meteor.users.update {'profile.com.messenger.threads.threadId': id}, {$set: {'profile.com.messenger.threads.$.allRead': true}}, {multi: true}

      console.log 'Thread status updated to true!!'


  }
