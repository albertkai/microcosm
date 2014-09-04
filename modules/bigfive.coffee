
if Meteor.isClient

  @bigFive = {


    calc: ->

      log 'calc'

      res = {}
      answers = Meteor.user().profile.tests.bigFive.answers

      for answer of answers
        if answers[answer] > 80
          res[answer] = 5
        else if answers[answer] <= 80 and answers[answer] > 60
          res[answer] = 4
        else if answers[answer] <= 60 and answers[answer] > 40
          res[answer] = 3
        else if answers[answer] <= 40 and answers[answer] > 20
          res[answer] = 2
        else if answers[answer] <= 20
          res[answer] = 1

      console.log res


      _primary = {
        extra: res['1'] + res['6'] + res['11'] + res['16'] + res['21'] + res['26'] + res['31'] + res['36'] + res['41'] + res['46'] + res['51'] + res['56'] + res['61'] + res['66'] + res['71'],
        affection: res['2'] + res['7'] + res['12'] + res['17'] + res['22'] + res['27'] + res['32'] + res['37'] + res['42'] + res['47'] + res['52'] + res['57'] + res['62'] + res['67'] + res['72'],
        selfControl: res['3'] + res['8'] + res['13'] + res['18'] + res['23'] + res['28'] + res['33'] + res['38'] + res['43'] + res['48'] + res['53'] + res['58'] + res['63'] + res['68'] + res['73'],
        stability:  res['4'] + res['9'] + res['14'] + res['19'] + res['24'] + res['29'] + res['34'] + res['39'] + res['44'] + res['49'] + res['54'] + res['59'] + res['64'] + res['69'] + res['74'],
        expression: res['5'] + res['10'] + res['15'] + res['20'] + res['25'] + res['30'] + res['35'] + res['40'] + res['45'] + res['50'] + res['55'] + res['60'] + res['65'] + res['70'] + res['75']
      }

      _secondary = {
        activity: res['1'] + res['6'] + res['11'],
        domination: res['16'] + res['21'] + res['26'],
        communicability: res['31'] + res['36'] + res['41'],
        searchImpressions: res['46'] + res['51'] + res['56'],
        guilt: res['61'] + res['66'] + res['71'],
        warm: res['2'] + res['7'] + res['12'],
        cooperation: res['17'] + res['22'] + res['27'],
        trust: res['32'] + res['37'] + res['42'],
        understanding: res['47'] + res['52'] + res['57'],
        respect: res['62'] + res['67'] + res['72'],
        accuracy: res['3'] + res['8'] + res['13'],
        persistence: res['18'] + res['23'] + res['28'],
        responsibility: res['33'] + res['38'] + res['43'],
        selfControl: res['48'] + res['53'] + res['58'],
        precaution: res['63'] + res['68'] + res['73'],
        anxiety: res['4'] + res['9'] + res['14'],
        tension: res['19'] + res['24'] + res['29'],
        depression: res['34'] + res['39'] + res['44'],
        selfCritisize: res['49'] + res['54'] + res['59'],
        emotionLability: res['64'] + res['69'] + res['74'],
        contemporary: res['5'] + res['10'] + res['15'],
        curiosity: res['20'] + res['25'] + res['30'],
        artistic: res['35'] + res['40'] + res['45'],
        sensitivity: res['50'] + res['55'] + res['60'],
        plasticity: res['65'] + res['70'] + res['75']
      }


      _primaryPercentage = _primary
      _secondaryPercentage = _secondary

      for prop of _primaryPercentage
        _primaryPercentage[prop] = _primaryPercentage[prop] / 75

      for prop of _secondaryPercentage
        _secondaryPercentage[prop] = _secondaryPercentage[prop] / 15


      log _primaryPercentage
      log _secondaryPercentage
      log 'Calling ::saveBigFive method'
      Meteor.call 'saveBigFive', Meteor.user()._id, _primaryPercentage, _secondaryPercentage, (err, res)->
        if err
          log 'results are not saved:('
          log err
        else
          log 'BigFive results saved!'

  }


if Meteor.isServer

  Meteor.methods {

    'saveBigFive': (id, primary, secondary)->

      Meteor.users.update id, {$set: {'profile.tests.bigFive.results.primary': primary}}
      Meteor.users.update id, {$set: {'profile.tests.bigFive.results.secondary': secondary}}

  }