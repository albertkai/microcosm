#Name: Johari test calculation
#Author: Albert Kaigorodov
#Desc: Machinery for johari testing, works with native Meteor.js users collection

#  Structure:
#  id: string,
#  firstName: string,
#  firstNameInt: string,
#  gender: string
#  results: {
#    personal: {},
#    friendsAnswers: [],
#    friendsResults: {}
#  }
#  window: {
#    open: {},
#    blind: {},
#    hidden: {},
#    unknown: {}
#  }

if Meteor.isClient

  @Johari = {


    init: (user, results, callback)->

      log 'Saving personal answers and creating johari object in user.profile.tests'
      userId = user._id
      Meteor.users.update userId, {$set: {'profile.tests.johari.id': userId}}
      Meteor.users.update userId, {$set: {'profile.tests.johari.gender': user.profile.gender}}
      Meteor.users.update userId, {$set: {'profile.tests.johari.firstName': user.profile.firstName}}
      Meteor.users.update userId, {$set: {'profile.tests.johari.firstNameInt': user.profile.first_name}}
      Meteor.users.update userId, {$set: {'profile.tests.johari.friendsPassed': 0}}
      Meteor.users.update userId, {$set: {'profile.tests.johari.results.friendsAnswers': []}}
      Meteor.users.update userId, {$set: {'profile.tests.johari.results.friendsResults': []}}
      Meteor.users.update userId, {$set: {'profile.tests.johari.results.personal': results}}, ->
        log 'johari initialized, results saved'
      callback()

    changePersonal: (userId, results)->

      log 'Changing personal data...'
      Meteor.users.update userId, {$set: {'profile.tests.johari.results.personal': results}}
      @calcAndSave(userId)

    add: (userId, results)->

      log 'Saving friend answers and calling Johari::calc method'
      Meteor.call 'johariSaveRawResults', userId, results, (err, res)=>
        if err
          log err
        else
          log 'Method johariSaveRawResults worked fine!'
          @calcAndSave(userId)


    calcAndSave: (id)->

      personal = Meteor.users.findOne(id).profile.tests.johari.results.personal
      friendsAnswers = Meteor.users.findOne(id).profile.tests.johari.results.friendsAnswers
      log 'Calculating johari'
      resultsBuffer = {}
      openBuffer = {}
      hiddenBuffer = {}
      blindBuffer = {}
      unknownBuffer = {}

      log 'Personal:'
      log personal

      #Counting all friends results into resultsBuffer
      log 'johari::counting friends results'
      if friendsAnswers.length > 0
        friendsAnswers.forEach (res)->
          for answer of res
            if resultsBuffer[answer]
              resultsBuffer[answer] = resultsBuffer[answer] + res[answer]
            else
              resultsBuffer[answer] = res[answer]
      log 'resultsBuffer:'
      log resultsBuffer


      #Counting open, hidden and unknown areas
      log 'johari::counting open, hidden and unknown areas'
      for answer of personal
        if personal[answer] > 0
          if resultsBuffer[answer] > 0
            openBuffer[answer] = resultsBuffer[answer]
          else
            hiddenBuffer[answer] = personal[answer]
        else
          unknownBuffer[answer] = 0

      log 'openBuffer:'
      log openBuffer

      log 'hiddenBuffer:'
      log hiddenBuffer

      log 'unknownBuffer:'
      log unknownBuffer

      #Counting blind area
      log 'johari::counting blind area'
      for answer of resultsBuffer
        if resultsBuffer[answer] > 0 and personal[answer] is 0
          blindBuffer[answer] = resultsBuffer[answer]

      log 'blindBuffer:'
      log blindBuffer

      log 'Calling johariAsideSaveWindow method'

      Meteor.call 'johariAsideSaveWindow', openBuffer, hiddenBuffer, blindBuffer, unknownBuffer, id, (err, res)->
        if err
          log err
        else
          log 'Johari data recalculated and saved with johariAsideSaveWidnow method'

  }


if Meteor.isServer

  Meteor.methods {

    johariAsideSaveWindow: (openBuffer, hiddenBuffer, blindBuffer, unknownBuffer, id)->

      Meteor.users.update id, {$set: {'profile.tests.johari.window.open': openBuffer}}
      Meteor.users.update id, {$set: {'profile.tests.johari.window.hidden': hiddenBuffer}}
      Meteor.users.update id, {$set: {'profile.tests.johari.window.blind': blindBuffer}}
      Meteor.users.update id, {$set: {'profile.tests.johari.window.unknown': unknownBuffer}}
      console.log  Meteor.users.findOne(id).profile.tests.johari
      true

    johariSaveRawResults: (userId, results)->

      Meteor.users.update userId, {$inc: {'profile.tests.johari.friendsPassed': 1}}
      Meteor.users.update userId, {$push: {'profile.tests.johari.results.friendsAnswers': results}}
      true

  }