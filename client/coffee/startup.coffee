Meteor.startup ->

  ion.sound({
    sounds: [
      name: "glass"
    ],
    path: "/sounds/",
    volume: 1
  })

#  moment.lang('ru')