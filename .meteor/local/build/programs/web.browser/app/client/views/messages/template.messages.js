(function(){
Template.__define__("messages", (function() {
  var view = this;
  return [ HTML.Raw('<div class="recorder _initial">\n\n        <div id="close-recorder" class="close-it"><i class="fa fa-times"></i></div>\n\n        <div class="top-controls">\n            <p>00:00 / 00:34</p>\n            <div class="line-cont">\n                <div class="line"></div>\n            </div>\n        </div>\n\n        <div class="central-circle">\n\n            <button id="start-rec">\n                <i class="fa fa-microphone"></i>\n                <p><i class="fa fa-circle"></i> rec</p>\n            </button>\n            <button id="stop-rec">\n                <p>0:23/1:00</p>\n                <i class="fa fa-stop"></i>\n            </button>\n\n            <div>\n                <button id="send-audio"><i class="fa fa-check"></i><br>ОТПРАВИТЬ</button>\n                <button id="rec-new">НОВОЕ</button>\n            </div>\n\n        </div>\n\n        <div class="lower-controls _paused">\n            <div>\n                <button class="play"><i class="fa fa-play"></i></button>\n            </div>\n            <div>\n                <button class="backward"><i class="fa fa-backward"></i></button>\n                <button class="pause"><i class="fa fa-pause"></i></button>\n                <button class="forward"><i class="fa fa-forward"></i></button>\n            </div>\n        </div>\n\n    </div>\n\n    '), HTML.DIV({
    "class": "modal-page messages _opened"
  }, "\n\n        ", HTML.Raw('<div class="close-it"><i class="fa fa-times"></i></div>'), "\n\n        ", HTML.DIV({
    "class": "modal-insert"
  }, "\n\n            ", HTML.Raw('<div class="heading"><i class="fa fa-envelope"></i> Lazytalk</div>'), "\n\n            ", HTML.DIV({
    "class": "body"
  }, "\n                ", HTML.ASIDE("\n                    ", HTML.Raw('<div class="search">\n                        <input id="messagesSearch" type="text" placeholder="поиск...">\n                        <button id="newMessage"><i class="fa fa-edit"></i></button>\n                    </div>'), "\n                    ", HTML.UL({
    id: "threads-list"
  }, "\n                        ", HTML.Raw('<!--<li class="_active">-->'), "\n                            ", HTML.Raw("<!--<div>-->"), "\n                                ", HTML.Raw('<!--<img src="http://graph.facebook.com/1276327615/picture/?type=large" alt="avatar"/>-->'), "\n                            ", HTML.Raw("<!--</div>-->"), "\n                            ", HTML.Raw("<!--<div>-->"), "\n                                ", HTML.Raw('<!--<h5>Альберт Константинопольский <sup><i class="fa fa-circle"></i></sup></h5>-->'), "\n                                ", HTML.Raw('<!--<p>"Привет братишка, давно не виделись, хотел бы тебя пригласить на концерт крутой группы"</p>-->'), "\n                                ", HTML.Raw("<!--<p><span>13:24</span> <span>сегодня</span></p>-->"), "\n                            ", HTML.Raw("<!--</div>-->"), "\n                        ", HTML.Raw("<!--</li>-->"), "\n                        ", HTML.Raw('<!--<li class="_unwatched _writing">-->'), "\n                            ", HTML.Raw("<!--<div>-->"), "\n                                ", HTML.Raw('<!--<img src="http://graph.facebook.com/1276327615/picture/?type=large" alt="avatar"/>-->'), "\n                            ", HTML.Raw("<!--</div>-->"), "\n                            ", HTML.Raw("<!--<div>-->"), "\n                                ", HTML.Raw("<!--<h5>Альберт Константинопольский</h5>-->"), "\n                                ", HTML.Raw('<!--<p>"Привет братишка, давно не виделись, хотел бы тебя пригласить на концерт крутой группы"</p>-->'), "\n                                ", HTML.Raw("<!--<p><span>13:24</span> <span>сегодня</span></p>-->"), "\n                                ", HTML.Raw('<!--<div class="writing-message"><i class="fa fa-pencil"></i></div>-->'), "\n                            ", HTML.Raw("<!--</div>-->"), "\n                        ", HTML.Raw("<!--</li>-->"), "\n                            ", Blaze.Each(function() {
    return Spacebars.call(Spacebars.dot(view.lookup("currentUser"), "profile", "com", "messenger", "threads"));
  }, function() {
    return [ "\n                            ", HTML.LI({
      "data-threadid": function() {
        return Spacebars.mustache(view.lookup("threadId"));
      },
      "class": function() {
        return Blaze.Unless(function() {
          return Spacebars.call(view.lookup("allRead"));
        }, function() {
          return "_unwatched";
        });
      }
    }, "\n                                ", HTML.DIV("\n                                    ", HTML.IMG({
      src: function() {
        return Blaze.Each(function() {
          return Spacebars.call(view.lookup("members"));
        }, function() {
          return Blaze.View(function() {
            return Spacebars.mustache(view.lookup("avatar"));
          });
        });
      },
      alt: "avatar"
    }), "\n                                "), "\n                                ", HTML.DIV("\n                                    ", HTML.H5(Blaze.Each(function() {
      return Spacebars.call(view.lookup("members"));
    }, function() {
      return [ Blaze.View(function() {
        return Spacebars.mustache(view.lookup("firstName"));
      }), " ", Blaze.View(function() {
        return Spacebars.mustache(view.lookup("lastName"));
      }) ];
    })), "\n                                    ", HTML.P(Blaze.View(function() {
      return Spacebars.makeRaw(Spacebars.mustache(view.lookup("showMessage"), Spacebars.dot(view.lookup("lastMessage"), "message"), Spacebars.dot(view.lookup("lastMessage"), "type")));
    })), "\n                                    ", HTML.P(HTML.SPAN(Blaze.View(function() {
      return Spacebars.mustache(view.lookup("showDate"), Spacebars.dot(view.lookup("lastMessage"), "date"));
    }))), "\n                                    ", HTML.DIV({
      "class": "writing-message"
    }, HTML.I({
      "class": "fa fa-pencil"
    })), "\n                                "), "\n                            "), "\n                            " ];
  }), "\n                    "), "\n                    ", HTML.Raw('<div class="filters">\n                        <div class="button-group">\n                            <button id="all-time-messages" class="_active">Все время</button>\n                            <button id="daily-messages">Сегодня</button>\n                            <button id="weekly-messages">Непрочит.</button>\n                        </div>\n                    </div>'), "\n                "), "\n                ", HTML.Raw('<div id="messages-insert"></div>'), "\n            "), "\n\n\n        "), "\n\n    ") ];
}));

Template.__define__("messagesCont", (function() {
  var view = this;
  return [ HTML.Raw('<div class="grad top"></div>\n\n    '), HTML.DIV({
    id: "messages-top"
  }, "\n        ", HTML.A({
    href: "#"
  }, Blaze.View(function() {
    return Spacebars.mustache(view.lookup("getHeaderName"), view.lookup("members"));
  }), HTML.Raw('<sup> <i class="fa fa-circle"></i></sup>')), "\n        ", HTML.Raw('<button id="record-audio"><span>rec <i class="fa fa-circle"></i></span> аудио</button>'), "\n    "), "\n    ", HTML.DIV({
    id: "messages-cont"
  }, "\n\n        ", Blaze.Each(function() {
    return Spacebars.call(view.lookup("messages"));
  }, function() {
    return [ "\n            ", Spacebars.include(view.lookupTemplate("message")), "\n        " ];
  }), "\n        ", HTML.Raw('<!--<div class="message audio">-->'), "\n            ", HTML.Raw('<!--<div class="avatar"><img src="http://graph.facebook.com/1276327615/picture/?type=large" alt="avatar"/></div>-->'), "\n            ", HTML.Raw('<!--<p class="message-date">22.04.2014  23:33</p>-->'), "\n            ", HTML.Raw('<!--<div class="body">-->'), "\n                ", HTML.Raw('<!--<div class="audiowave"></div>-->'), "\n                ", HTML.Raw('<!--<p class="time">0:00 / 0:43</p>-->'), "\n                ", HTML.Raw('<!--<div class="controls _paused">-->'), "\n                    ", HTML.Raw("<!--<div>-->"), "\n                        ", HTML.Raw('<!--<button class="play"><i class="fa fa-play"></i></button>-->'), "\n                    ", HTML.Raw("<!--</div>-->"), "\n                    ", HTML.Raw("<!--<div>-->"), "\n                        ", HTML.Raw('<!--<button class="backward"><i class="fa fa-backward"></i></button>-->'), "\n                        ", HTML.Raw('<!--<button class="pause"><i class="fa fa-pause"></i></button>-->'), "\n                        ", HTML.Raw('<!--<button class="forward"><i class="fa fa-forward"></i></button>-->'), "\n                    ", HTML.Raw("<!--</div>-->"), "\n                ", HTML.Raw("<!--</div>-->"), "\n                ", HTML.Raw('<!--<div class="playback-position"></div>-->'), "\n            ", HTML.Raw("<!--</div>-->"), "\n        ", HTML.Raw("<!--</div>-->"), "\n    "), "\n    ", HTML.DIV({
    id: "new-message"
  }, "\n\n        ", HTML.DIV({
    id: "message-input"
  }, "\n            ", HTML.TEXTAREA({
    name: "",
    id: "userMessage",
    cols: "30",
    rows: "10",
    placeholder: "написать сообщение..",
    "data-threadid": function() {
      return Spacebars.mustache(view.lookup("_id"));
    }
  }), "\n            ", HTML.Raw('<button id="add-smile" class="smile-hover"><i class="fa fa-smile-o"></i></button>'), "\n            ", HTML.Raw('<button id="add-gif" class="gif-hover">gif</button>'), "\n            ", HTML.Raw('<button id="add-more" class="more-hover"><i class="fa fa-caret-down"></i></button>'), "\n        "), "\n\n        ", HTML.Raw('<div id="choose-smile" class="attach smile-hover">\n            <div class="angle"></div>\n            <div class="attach-cont rage">\n                <div class="smile"></div>\n                <div class="smile"></div>\n                <div class="smile"></div>\n                <div class="smile"></div>\n                <div class="smile"></div>\n                <div class="smile"></div>\n                <div class="smile"></div>\n                <div class="smile"></div>\n                <div class="smile"></div>\n                <div class="smile"></div>\n                <div class="smile"></div>\n                <div class="smile"></div>\n                <div class="smile"></div>\n                <div class="smile"></div>\n                <div class="smile"></div>\n                <div class="smile"></div>\n                <div class="smile"></div>\n                <div class="smile"></div>\n                <div class="smile"></div>\n                <div class="smile"></div>\n                <div class="smile"></div>\n                <div class="smile"></div>\n                <div class="smile"></div>\n                <div class="smile"></div>\n                <div class="smile"></div>\n                <div class="smile"></div>\n                <div class="smile"></div>\n                <div class="smile"></div>\n                <div class="smile"></div>\n                <div class="smile"></div>\n                <div class="smile"></div>\n                <div class="smile"></div>\n                <div class="smile"></div>\n                <div class="smile"></div>\n                <div class="smile"></div>\n                <div class="smile"></div>\n                <div class="smile"></div>\n            </div>\n        </div>'), "\n        ", HTML.Raw('<div id="choose-gif" class="attach gif-hover">\n            <div class="angle"></div>\n            <div class="attach-cont meme">\n                <div class="smile"></div>\n                <div class="smile"></div>\n                <div class="smile"></div>\n                <div class="smile"></div>\n                <div class="smile"></div>\n                <div class="smile"></div>\n                <div class="smile"></div>\n                <div class="smile"></div>\n                <div class="smile"></div>\n                <div class="smile"></div>\n                <div class="smile"></div>\n                <div class="smile"></div>\n                <div class="smile"></div>\n                <div class="smile"></div>\n                <div class="smile"></div>\n                <div class="smile"></div>\n                <div class="smile"></div>\n                <div class="smile"></div>\n                <div class="smile"></div>\n                <div class="smile"></div>\n                <div class="smile"></div>\n            </div>\n        </div>'), "\n\n        ", HTML.Raw('<div id="choose-more" class="attach more-hover">\n            <div class="angle"></div>\n            <ul>\n                <li id="attach-photo">Добавить фото</li>\n                <li id="make-photo">Добавить еще</li>\n            </ul>\n        </div>'), "\n\n    "), HTML.Raw('\n    <div class="grad bottom"></div>\n    <div id="messageHeightMeter"><div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A alias beatae commodi cupiditate deserunt dolore doloremque ducimus ea eos et exercitationem, impedit nam necessitatibus neque nostrum odio officia omnis pariatur perspiciatis, possimus quod repellat temporibus, tenetur ullam veritatis voluptas voluptatem.</div></div>') ];
}));

Template.__define__("message", (function() {
  var view = this;
  return HTML.DIV({
    "class": function() {
      return [ "message ", Spacebars.mustache(view.lookup("getYours"), view.lookup("userId")) ];
    },
    "data-id": function() {
      return Spacebars.mustache(view.lookup("_id"));
    }
  }, HTML.Raw('\n        <div class="avatar"><img src="http://graph.facebook.com/1276327615/picture/?type=large" alt="avatar"></div>\n        '), HTML.P({
    "class": "message-date"
  }, Blaze.View(function() {
    return Spacebars.mustache(view.lookup("showDate"), view.lookup("date"));
  })), "\n        ", HTML.DIV({
    "class": "body"
  }, "\n            ", Blaze.View(function() {
    return Spacebars.makeRaw(Spacebars.mustache(view.lookup("message")));
  }), "\n        "), "\n    ");
}));

Template.__define__("noThreads", (function() {
  var view = this;
  return "";
}));

})();
