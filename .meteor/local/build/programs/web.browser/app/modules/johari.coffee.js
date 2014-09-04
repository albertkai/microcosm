(function(){__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
if (Meteor.isClient) {
  this.Johari = {
    init: function(user, results, callback) {
      var userId;
      log('Saving personal answers and creating johari object in user.profile.tests');
      userId = user._id;
      Meteor.users.update(userId, {
        $set: {
          'profile.tests.johari.id': userId
        }
      });
      Meteor.users.update(userId, {
        $set: {
          'profile.tests.johari.gender': user.profile.gender
        }
      });
      Meteor.users.update(userId, {
        $set: {
          'profile.tests.johari.firstName': user.profile.firstName
        }
      });
      Meteor.users.update(userId, {
        $set: {
          'profile.tests.johari.firstNameInt': user.profile.first_name
        }
      });
      Meteor.users.update(userId, {
        $set: {
          'profile.tests.johari.friendsPassed': 0
        }
      });
      Meteor.users.update(userId, {
        $set: {
          'profile.tests.johari.results.friendsAnswers': []
        }
      });
      Meteor.users.update(userId, {
        $set: {
          'profile.tests.johari.results.friendsResults': []
        }
      });
      Meteor.users.update(userId, {
        $set: {
          'profile.tests.johari.results.personal': results
        }
      }, function() {
        return log('johari initialized, results saved');
      });
      return callback();
    },
    changePersonal: function(userId, results) {
      log('Changing personal data...');
      Meteor.users.update(userId, {
        $set: {
          'profile.tests.johari.results.personal': results
        }
      });
      return this.calcAndSave(userId);
    },
    add: function(userId, results) {
      log('Saving friend answers and calling Johari::calc method');
      return Meteor.call('johariSaveRawResults', userId, results, (function(_this) {
        return function(err, res) {
          if (err) {
            return log(err);
          } else {
            log('Method johariSaveRawResults worked fine!');
            return _this.calcAndSave(userId);
          }
        };
      })(this));
    },
    calcAndSave: function(id) {
      var answer, blindBuffer, friendsAnswers, hiddenBuffer, openBuffer, personal, resultsBuffer, unknownBuffer;
      personal = Meteor.users.findOne(id).profile.tests.johari.results.personal;
      friendsAnswers = Meteor.users.findOne(id).profile.tests.johari.results.friendsAnswers;
      log('Calculating johari');
      resultsBuffer = {};
      openBuffer = {};
      hiddenBuffer = {};
      blindBuffer = {};
      unknownBuffer = {};
      log('Personal:');
      log(personal);
      log('johari::counting friends results');
      if (friendsAnswers.length > 0) {
        friendsAnswers.forEach(function(res) {
          var answer, _results;
          _results = [];
          for (answer in res) {
            if (resultsBuffer[answer]) {
              _results.push(resultsBuffer[answer] = resultsBuffer[answer] + res[answer]);
            } else {
              _results.push(resultsBuffer[answer] = res[answer]);
            }
          }
          return _results;
        });
      }
      log('resultsBuffer:');
      log(resultsBuffer);
      log('johari::counting open, hidden and unknown areas');
      for (answer in personal) {
        if (personal[answer] > 0) {
          if (resultsBuffer[answer] > 0) {
            openBuffer[answer] = resultsBuffer[answer];
          } else {
            hiddenBuffer[answer] = personal[answer];
          }
        } else {
          unknownBuffer[answer] = 0;
        }
      }
      log('openBuffer:');
      log(openBuffer);
      log('hiddenBuffer:');
      log(hiddenBuffer);
      log('unknownBuffer:');
      log(unknownBuffer);
      log('johari::counting blind area');
      for (answer in resultsBuffer) {
        if (resultsBuffer[answer] > 0 && personal[answer] === 0) {
          blindBuffer[answer] = resultsBuffer[answer];
        }
      }
      log('blindBuffer:');
      log(blindBuffer);
      log('Calling johariAsideSaveWindow method');
      return Meteor.call('johariAsideSaveWindow', openBuffer, hiddenBuffer, blindBuffer, unknownBuffer, id, function(err, res) {
        if (err) {
          return log(err);
        } else {
          return log('Johari data recalculated and saved with johariAsideSaveWidnow method');
        }
      });
    }
  };
}

if (Meteor.isServer) {
  Meteor.methods({
    johariAsideSaveWindow: function(openBuffer, hiddenBuffer, blindBuffer, unknownBuffer, id) {
      Meteor.users.update(id, {
        $set: {
          'profile.tests.johari.window.open': openBuffer
        }
      });
      Meteor.users.update(id, {
        $set: {
          'profile.tests.johari.window.hidden': hiddenBuffer
        }
      });
      Meteor.users.update(id, {
        $set: {
          'profile.tests.johari.window.blind': blindBuffer
        }
      });
      Meteor.users.update(id, {
        $set: {
          'profile.tests.johari.window.unknown': unknownBuffer
        }
      });
      console.log(Meteor.users.findOne(id).profile.tests.johari);
      return true;
    },
    johariSaveRawResults: function(userId, results) {
      Meteor.users.update(userId, {
        $inc: {
          'profile.tests.johari.friendsPassed': 1
        }
      });
      Meteor.users.update(userId, {
        $push: {
          'profile.tests.johari.results.friendsAnswers': results
        }
      });
      return true;
    }
  });
}

})();

//# sourceMappingURL=c7ec0cd687b927aa7cb02623faadb7cbe7e5d0f7.map
