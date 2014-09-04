@Threads = new Meteor.Collection('threads')

#Permissions

#Schema


#Hooks

Threads.after.update (userId, doc, fieldNames, modifier, options)->

  if modifier.$push
    Meteor.call 'updateUsersThreadsRec', userId, doc, fieldNames, modifier, options



#Streams

@ThreadsStream = new Meteor.Stream('threadsStream')

if Meteor.isClient
  ThreadsStream.on Meteor.userId(), (id)->
    MessagesCtrl.utils.notifyWriting(id)

if Meteor.isServer
  ThreadsStream.permissions.write (eventName)->
    if @userId
      true

  ThreadsStream.permissions.read (eventName)->
    if @userId is eventName
      true
