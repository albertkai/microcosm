(function(){__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
if (Meteor.isClient) {
  Template.message.helpers({
    getYours: function(id) {
      if (id === Meteor.user()._id) {
        return 'yours';
      } else {
        return '';
      }
    },
    showDate: function(date) {
      return moment(date).lang('ru').calendar();
    }
  });
  Template.messages.helpers({
    showDate: function(date) {
      return moment(date).lang('ru').calendar();
    },
    showMessage: function(message, type) {
      if (type === 'text') {
        return message;
      } else if (type === 'smile') {
        return '<i class="fa fa-picture-o" style="color: #ccc; margin-left: 7px;"></i>';
      }
    }
  });
  Template.messagesCont.helpers({
    getHeaderName: function(members) {
      var id, string;
      string = '';
      id = Meteor.user()._id;
      members.forEach(function(m) {
        if (id !== m.id) {
          return string += m.firstName + ' ' + m.lastName + ', ';
        }
      });
      return string.substring(0, string.length - 2);
    }
  });
  Template.messages.rendered = function() {
    var $firstThread;
    $firstThread = $('#threads-list').find('li').first();
    $firstThread.addClass('_active');
    Deps.autorun(function() {
      var threadData, threadId, user;
      user = Meteor.users.findOne({
        'profile.username': Session.get('currentUsersPage')
      });
      if (user) {
        threadId = user.profile.com.messenger.threads[0].threadId;
        threadData = Threads.findOne({
          _id: threadId
        });
        Session.set('messagesThreadId', Meteor.user().profile.com.messenger.threads[0].threadId);
        return UI.insert(UI.renderWithData(Template.messagesCont, threadData), $('#messages-insert').get(0));
      }
    });
    return Deps.autorun(function() {
      var count, targetThread, threadData;
      log('Deps called for messages!');
      targetThread = Threads.findOne({
        _id: Session.get('messagesThreadId')
      });
      if (targetThread) {
        count = targetThread.total;
        threadData = Threads.findOne({
          _id: Session.get('messagesThreadId')
        });
        $('#messages-insert').empty();
        return UI.insert(UI.renderWithData(Template.messagesCont, threadData), $('#messages-insert').get(0));
      }
    });
  };
  Template.messagesCont.rendered = function() {
    return $('#messages-cont').get(0).scrollTop = $('#messages-cont').get(0).scrollHeight;
  };
  Template.messages.events({
    'click .attach-cont .smile': function(e) {
      var $img, attach, message, path, threadId, userId;
      path = $(e.currentTarget).css('background-image');
      path = path.replace('url(', '').replace(')', '').replace('"', '').replace('"', '');
      $img = $('<img>').attr('src', path).attr('alt', 'meme');
      message = $img.wrap("<div />").parent().html();
      threadId = $('#userMessage').data('threadid');
      userId = Meteor.user()._id;
      attach = false;
      return MessagesCtrl.sendMessage(threadId, userId, message, 'smile', attach);
    },
    'click #threads-list > li': function(e) {
      var threadData, threadId;
      $('#threads-list > li').removeClass('_active');
      $(e.currentTarget).addClass('_active');
      threadId = $(e.currentTarget).data('threadid');
      threadData = Threads.findOne({
        _id: threadId
      });
      Session.set('messagesThreadId', threadId);
      return Meteor.call('setThreadStatus', threadId);
    },
    'click #record-audio': function() {
      return MainCtrl.notify('Прости бро:(', 'Мы еще не успели реализовать эту функцию:( Скоро все будет, обещаем!=)', 'error');
    },
    'click #close-recorder': function() {
      $('.recorder').removeClass('_visible');
      return $('.modal-overlay.higher').removeClass('_visible');
    },
    'click #attach-photo': function() {
      $('#choose-more').removeClass('_hover');
      return MainCtrl.notify('Сорри бро(', 'Мы пока налаживаем серверы, по-этому функция временно недоступна:( Скоро все заработает, обещаем!))');
    },
    'click #make-photo': function() {
      $('#choose-more').removeClass('_hover');
      return MainCtrl.notify('Сорри бро(', 'Мы пока налаживаем серверы, по-этому функция временно недоступна:( Скоро все заработает, обещаем!))');
    },
    'click #start-rec': function() {
      $('.recorder').removeClass('_initial').addClass('_recording');
      return ion.sound.play('glass');
    },
    'click #stop-rec': function() {
      return $('.recorder').removeClass('_recording').addClass('_recorded');
    },
    'click #rec-new': function() {
      return $('.recorder').removeClass('_recorded').addClass('_initial');
    },
    'click .message.audio .play': function(e) {
      var $targetDiv;
      $targetDiv = $(e.currentTarget).closest('.controls');
      return $targetDiv.removeClass('_paused').addClass('_playing');
    },
    'click .message.audio .pause': function(e) {
      var $targetDiv;
      $targetDiv = $(e.currentTarget).closest('.controls');
      return $targetDiv.removeClass('_playing').addClass('_paused');
    },
    'click .recorder .play': function(e) {
      var $targetDiv;
      $targetDiv = $(e.currentTarget).closest('.lower-controls');
      return $targetDiv.removeClass('_paused').addClass('_playing');
    },
    'click .recorder .pause': function(e) {
      var $targetDiv;
      $targetDiv = $(e.currentTarget).closest('.lower-controls');
      return $targetDiv.removeClass('_playing').addClass('_paused');
    },
    'focus #userMessage': function(e) {
      log($(e.currentTarget).get(0).scrollHeight);
      MessagesCtrl.view.textareaHeight = $(e.currentTarget).get(0).scrollHeight;
      return MessagesCtrl.view.textareaHeightStep = 18;
    },
    'keypress #userMessage': function(e) {
      if (e.which === 13) {
        return e.preventDefault();
      }
    },
    'keyup #userMessage': function(e) {
      var attach, height, keyID, message, newLineNumber, threadId, userId, users, val;
      keyID = e.which;
      if (keyID === 8) {
        log('backspace');
        val = $(e.currentTarget).val();
        $('#messageHeightMeter').html(val);
        newLineNumber = Math.floor($('#messageHeightMeter').get(0).scrollHeight / MessagesCtrl.view.step);
        if (newLineNumber !== MessagesCtrl.view.linesNumber && MessagesCtrl.view.linesNumber > 1) {
          if (MessagesCtrl.view.linesNumber < 5) {
            MessagesCtrl.view.decreaseHeight();
          }
          return MessagesCtrl.view.linesNumber = newLineNumber;
        }
      } else if (keyID === 13) {
        e.preventDefault();
        threadId = $(e.currentTarget).data('threadid');
        userId = Meteor.user()._id;
        message = $(e.currentTarget).val();
        attach = false;
        return MessagesCtrl.sendMessage(threadId, userId, message, 'text', attach);
      } else {
        height = $(e.currentTarget).get(0).scrollHeight;
        val = $(e.currentTarget).val();
        threadId = $(e.currentTarget).data('threadid');
        $('#messageHeightMeter').html(val);
        if (MessagesCtrl.view.textareaHeight !== height) {
          if (MessagesCtrl.view.textareaHeight < height) {
            if (height < 100) {
              log('invalidated');
              MessagesCtrl.view.increaseHeight(height);
            }
          } else {
            log('increasing');
          }
        }
        users = (function() {
          var arr;
          arr = [];
          Threads.findOne({
            '_id': threadId
          }).members.forEach(function(m) {
            return arr.push(m.id);
          });
          return arr;
        })();
        return users.forEach(function(id) {
          return ThreadsStream.emit(id, threadId);
        });
      }
    },
    'mouseenter .smile-hover': function() {
      return $('.smile-hover').addClass('_hover');
    },
    'mouseenter .gif-hover': function() {
      return $('.gif-hover').addClass('_hover');
    },
    'mouseenter .more-hover': function() {
      return $('.more-hover').addClass('_hover');
    },
    'mouseleave .smile-hover': function() {
      return $('.smile-hover').removeClass('_hover');
    },
    'mouseleave .gif-hover': function() {
      return $('.gif-hover').removeClass('_hover');
    },
    'mouseleave .more-hover': function() {
      return $('.more-hover').removeClass('_hover');
    }
  });
  this.MessagesCtrl = {
    view: {
      textareaHeight: 0,
      step: 18,
      linesNumber: 1,
      increaseHeight: function(height) {
        var gradBottom;
        $('#userMessage').height($('#userMessage').height() + this.step);
        $('#messages-cont').height($('#messages-cont').height() - this.step);
        $('#new-message').height($('#new-message').height() + this.step);
        this.textareaHeight = $('#userMessage').get(0).scrollHeight;
        gradBottom = parseInt($('.grad.bottom').css('bottom'), 10);
        $('.grad.bottom').css('bottom', gradBottom + MessagesCtrl.view.step + 'px');
        return this.linesNumber = Math.floor($('#messageHeightMeter').get(0).scrollHeight / this.step);
      },
      decreaseHeight: function(height) {
        var gradBottom;
        log('decreasing');
        $('#userMessage').height($('#userMessage').height() - this.step);
        $('#messages-cont').height($('#messages-cont').height() + this.step);
        $('#new-message').height($('#new-message').height() - this.step);
        gradBottom = parseInt($('.grad.bottom').css('bottom'), 10);
        $('.grad.bottom').css('bottom', gradBottom - MessagesCtrl.view.step + 'px');
        MessagesCtrl.view.textareaHeight = $('#userMessage').get(0).scrollHeight;
        return this.linesNumber = Math.floor($('#messageHeightMeter').get(0).scrollHeight / this.step);
      },
      clear: function() {}
    },
    sendMessage: function(threadId, userId, message, type, attach) {
      return Meteor.call('sendMessage', threadId, userId, message, type, attach, function(err, res) {
        if (err) {
          return MainCtrl.notify('Упсики(', 'Сообщение не передано, попробуйте еще раз', 'error');
        } else {
          return log('Все ок! Сообщение отправлено!!');
        }
      });
    },
    utils: {
      notifyWriting: function(id) {
        var $elem;
        $elem = $('#threads-list').find('[data-threadId="' + id + '"]');
        if ($elem.length > 0) {
          if (this.timeout) {
            clearTimeout(this.timeout);
          }
          $elem.addClass('_writing');
          return this.timeout = setTimeout(function() {
            return $elem.removeClass('_writing');
          }, 500);
        }
      }
    }
  };
}

if (Meteor.isServer) {
  Meteor.methods({
    'sendMessage': function(threadId, userId, message, type, attach) {
      var setTotal;
      message = {
        userId: userId,
        date: new Date(),
        message: message,
        type: type,
        attach: false
      };
      setTotal = Threads.findOne({
        '_id': threadId
      }).total + 1;
      return Threads.update(threadId, {
        $push: {
          'messages': message
        },
        $set: {
          'total': setTotal
        }
      });
    },
    'sendAudio': function(threadId, userId, audio) {
      var message;
      message = {
        userId: userId,
        date: new Date(),
        message: audio,
        type: 'audio',
        attach: false
      };
      Threads.update(threadId, {
        $push: {
          'messages': message
        }
      });
      console.log('message Sent');
      return console.log(threadId);
    },
    'deleteMessage': function() {
      return console.log('delete');
    },
    'listObjects': function(bucket) {
      var f, params, s3;
      s3 = new AWS.S3();
      f = new Future();
      params = {
        Bucket: bucket
      };
      s3.listObjects(params, function(err, data) {
        if (err) {
          console.log(err, err.stack);
          return f["return"](false);
        } else {
          console.log(data);
          return f["return"](data);
        }
      });
      return f.wait();
    },
    'updateUsersThreadsRec': function(userId, doc, fieldNames, modifier, options) {
      var lastMessage;
      lastMessage = {
        date: modifier.$push.messages.date,
        type: modifier.$push.messages.type,
        message: modifier.$push.messages.message
      };
      Meteor.users.update({
        'profile.com.messenger.threads.threadId': doc._id
      }, {
        $set: {
          'profile.com.messenger.threads.$.allRead': false
        }
      }, {
        multi: true
      });
      Meteor.users.update({
        'profile.com.messenger.threads.threadId': doc._id
      }, {
        $set: {
          'profile.com.messenger.threads.$.lastMessage': lastMessage
        }
      }, {
        multi: true
      });
      Meteor.users.find({
        'profile.com.messenger.threads.threadId': doc._id
      }).fetch().forEach(function(user) {
        var id, newCount, newUnread;
        id = user._id;
        newCount = Meteor.users.findOne({
          '_id': id
        }).profile.com.messenger.count + 1;
        newUnread = Meteor.users.findOne({
          '_id': id
        }).profile.com.messenger.unread + 1;
        return Meteor.users.update({
          '_id': id
        }, {
          $set: {
            'profile.com.messenger.count': newCount
          },
          $set: {
            'profile.com.messenger.unreadCount': newUnread
          }
        });
      });
      console.log('Members.com.messenger updated');
      console.log(Meteor.users.find({
        'profile.com.messenger.threads.threadId': doc._id
      }).fetch());
      return console.log(doc._id);
    },
    'setThreadStatus': function(id) {
      var threadUnread, totalUnread;
      threadUnread = Threads.findOne({
        '_id': id
      }).unreadCount;
      totalUnread = Meteor.user;
      Meteor.users.update({
        'profile.com.messenger.threads.threadId': id
      }, {
        $set: {
          'profile.com.messenger.threads.$.allRead': true
        }
      }, {
        multi: true
      });
      Meteor.users.update({
        'profile.com.messenger.threads.threadId': id
      }, {
        $set: {
          'profile.com.messenger.threads.$.allRead': true
        }
      }, {
        multi: true
      });
      return console.log('Thread status updated to true!!');
    }
  });
}

})();

//# sourceMappingURL=522f144f242f6801df241803f64a513009ad4dee.map
