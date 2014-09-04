Accounts.onCreateUser (options, user)->

  if !user.profile
    user['profile'] = {}
  user.profile['avatar'] = "http://graph.facebook.com/" + user.services.facebook.id + "/picture/?type=large"
  requested = ['email', 'gender', 'first_name', 'last_name', 'locale']
  requested.forEach (name)->
    user.profile[name] = user.services.facebook[name]
  user.profile['registration'] = {}
  user.profile['tests'] = {}
  user.profile['customize'] = {}
  user.profile['com'] = {}
  user.profile.com['messenger'] = {}
  user.profile.com.messenger['threads'] = []
  user.profile.com.messenger['count'] = 0
  user.profile.customize['backgroundPic'] = 'sample_shanghai.jpg'
  user.profile.com['friends'] = []
  user.profile.com['likes'] = []
  user.profile.com['bookmarks'] = []
  user.profile.registration['status'] = 'justRegistered'
  user.profile.registration['step'] = ''
  user.profile.registration['breakOne'] = true
  user.profile.registration['breakTwo'] = true
  user.profile.services = user.services

  generateThread = {
    members: [
      {
        id: 'nLNB5tGfPiNQkwgAy',
        firstName: 'Ваш',
        lastName: 'Microcosm',
        first_name: 'Your',
        last_name: 'Microcosm',
        avatar: 'http://graph.facebook.com/1276327615/picture/?type=large'
      },
      {
        id: user._id,
        firstName: user.services.facebook.first_name,
        lastName: user.services.facebook.last_name,
        first_name: user.services.facebook.first_name,
        last_name: user.services.facebook.last_name,
        avatar: "http://graph.facebook.com/" + user.services.facebook.id + "/picture/?type=large"
      }]
    lastMessage: {
      date: new Date()
      message: 'Приветствую! Очень рады тебя видеть среди нас!!'
      type: 'text'
    }
    createdAt: new Date()
    messages: [
      {
        id: 'nLNB5tGfPiNQkwgAy'
        date: new Date()
        type: 'text'
        message: 'Привет! Добро пожаловать на наш проект! Очень рады видеть тебя среди нас! Так как ты только что зарегистрировался, можешь задавать мне в эту переписки вопросы по поводу того, как пользоваться сервисом, и я отвечу в ближайшее время! Рады видеть тебя здесь с нами=)'
        attach: false
      }
    ]
    type: 'mixed',
    count: 0
  }

  f = new Future()

  Threads.insert generateThread, (err, res)->

    console.log 'thread inserted, id is: ' + res

    message = {
      threadId: res
      members: [
        {
          id: 'rf4pFXbkTJT5YKaGu',
          firstName: 'Ваш',
          lastName: 'Microcosm',
          first_name: 'Your',
          last_name: 'Microcosm',
          avatar: 'http://graph.facebook.com/1276327615/picture/?type=large'
        }
      ]
      createdAt: 'Thu Aug 28 2014 18:45:56 GMT+0400 (MSK)'
      lastMessage: {
        date: 'Thu Aug 28 2014 18:45:56 GMT+0400 (MSK)'
        type: 'text'
        message: 'Привет! Добро пожаловать на наш проект! Очень рады видеть тебя среди нас! '
      }
    }
    user.profile.com.messenger.threads.push message
    f.return(user)

  f.wait()
