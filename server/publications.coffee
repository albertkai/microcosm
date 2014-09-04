Meteor.publish 'users', ->
  Meteor.users.find()

Meteor.publish 'threads', ->
  Threads.find()