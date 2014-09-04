#if Meteor.users.find().count() > 0
#  Meteor.users.find().fetch().forEach (user)->
#    id = user._id
#    Meteor.users.remove id

#Meteor.users.update "rf4pFXbkTJT5YKaGu", {$set: {'profile.customize.backgroundPic': 'images/sample_shanghai.jpg'}}
##Meteor.users.update "esLjvkvo7uCgGzATQ", {$set: {'profile.registration.step': 60}}
#
#user = Accounts.createUser {
#  username: 'albertkai',
#  email: 'albertkai@me.com',
#  password: '56114144as',
#  profile: {
#    name: 'Альберт',
#    surname: 'Кайгородов'
#    city: 'Saint-Petersburg',
#    country: 'Russia'
#  }
#}

#Meteor.users.update "nLNB5tGfPiNQkwgAy", {$set: {'profile.com': {}}}
#Meteor.users.update "nLNB5tGfPiNQkwgAy", {$set: {'profile.com.messenger': {}}}
#Meteor.users.update "nLNB5tGfPiNQkwgAy", {$set: {'profile.com.messenger.threads': []}}
#Meteor.users.update "nLNB5tGfPiNQkwgAy", {$set: {'profile.com.messenger.count': 0}}
#Meteor.users.update "nLNB5tGfPiNQkwgAy", {$set: {'profile.com.friends': []}}
#Meteor.users.update "nLNB5tGfPiNQkwgAy", {$set: {'profile.com.likes': []}}
#Meteor.users.update "nLNB5tGfPiNQkwgAy", {$set: {'profile.com.bookmarks': []}}
#
#Meteor.users.update "rf4pFXbkTJT5YKaGu", {$set: {'profile.com': {}}}
#Meteor.users.update "rf4pFXbkTJT5YKaGu", {$set: {'profile.com.messenger': {}}}
#Meteor.users.update "rf4pFXbkTJT5YKaGu", {$set: {'profile.com.messenger.threads': []}}
#Meteor.users.update "rf4pFXbkTJT5YKaGu", {$set: {'profile.com.messenger.count': 0}}
#Meteor.users.update "rf4pFXbkTJT5YKaGu", {$set: {'profile.com.friends': []}}
#Meteor.users.update "rf4pFXbkTJT5YKaGu", {$set: {'profile.com.likes': []}}
#Meteor.users.update "rf4pFXbkTJT5YKaGu", {$set: {'profile.com.bookmarks': []}}
#message = {
#  threadId: "JvEpaBrLfYn3gnMDp"
#  members: [
#    {
#      id: 'rf4pFXbkTJT5YKaGu',
#      firstName: 'Ваш',
#      lastName: 'Microcosm',
#      first_name: 'Your',
#      last_name: 'Microcosm',
#      avatar: 'http://graph.facebook.com/1276327615/picture/?type=large'
#    }
#  ]
#  createdAt: 'Thu Aug 28 2014 18:45:56 GMT+0400 (MSK)'
#  lastMessage: {
#    date: 'Thu Aug 28 2014 18:45:56 GMT+0400 (MSK)'
#    type: 'text'
#    message: 'Привет! Добро пожаловать на наш проект! Очень рады видеть тебя среди нас! '
#  }
#
#}
#message = {
#  threadId: "PJ8ermt8yLfBDKBHC"
#  members: [
#    {
#      id: 'rf4pFXbkTJT5YKaGu',
#      firstName: 'Альберт',
#      lastName: 'Кайгородов',
#      first_name: 'Albert',
#      last_name: 'Kaigorodov',
#      avatar: 'http://graph.facebook.com/1276327615/picture/?type=large'
#    }
#  ]
#  createdAt: 'Thu Aug 28 2014 18:45:56 GMT+0400 (MSK)'
#  lastMessage: {
#    date: 'Thu Aug 28 2014 18:45:56 GMT+0400 (MSK)'
#    type: 'text'
#    message: 'Это очень круто все!!))'
#  }
#
#}
#Meteor.users.update "N6CiNjoxno7daw3sN", {$push: {'profile.com.messenger.threads': message}}
#Roles.addUsersToRoles(user, ['user'])

#if Threads.find().count() > 0
#  Threads.find().fetch().forEach (thread)->
#    id = thread._id
#    Threads.remove id
#
#if Threads.find().count() < 10
#  Threads.insert {
#    members: [
#      {
#        id: 'nLNB5tGfPiNQkwgAy',
#        firstName: 'Ваш',
#        lastName: 'Microcosm',
#        first_name: 'Your',
#        last_name: 'Microcosm',
#        avatar: 'http://graph.facebook.com/1276327615/picture/?type=large'
#      },
#      {
#        id: 'N6CiNjoxno7daw3sN',
#        firstName: 'Альберт',
#        lastName: 'Кайгородов',
#        first_name: 'Albert',
#        last_name: 'Kaigorodov',
#        avatar: 'http://graph.facebook.com/1276327615/picture/?type=large'
#      }]
#    lastMessage: {
#      date: 'Thu Aug 28 2014 18:40:56 GMT+0400 (MSK)'
#      message: 'Приветствую!!'
#      type: 'text'
#    }
#    createdAt: 'Thu Aug 28 2014 18:40:56 GMT+0400 (MSK)'
#    messages: [
#      {
#        id: 'nLNB5tGfPiNQkwgAy'
#        date: 'Thu Aug 28 2014 18:43:56 GMT+0400 (MSK)'
#        type: 'text'
#        message: 'Привет! Добро пожаловать на наш проект! Очень рады видеть тебя среди нас! Так как ты только что зарегистрировался, можешь задавать мне в эту переписки вопросы по поводу того, как пользоваться сервисом, и я отвечу в ближайшее время! Рады видеть тебя здесь с нами=)'
#        attach: false
#      }
#    ]
#    type: 'mixed',
#    count: 0
#  }

#
#Threads.find().fetch().forEach (t)->
#
#  id = t._id
#  Threads.update {'_id': id}, {$set: {'unreadCount': 0}}

#Meteor.users.find().forEach (u)->
#
#  id = u._id
#  Meteor.users.update {_id: id}, {$set: {'profile.com.messenger.totalUnread': 0}}