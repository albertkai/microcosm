Meteor.startup ->
  @i18n = Meteor.npmRequire 'i18n'
  @path = Npm.require('path')
  @swisseph = Meteor.npmRequire 'swisseph'



#  i18n.configure({
#    locales: ['ru', 'en', 'de'],
#    directory: path.__dirname + '/locales'
#  })