(function(){
Template.__body__.__contentParts.push(Blaze.View('body_content_'+Template.__body__.__contentParts.length, (function() {
  var view = this;
  return "";
})));
Meteor.startup(Template.__body__.__instantiate);

Template.__define__("mainLayout", (function() {
  var view = this;
  return [ HTML.Raw('<div id="main-loader"></div>\n\n    <!--<div id="system-process" class="_visible">-->\n        <!--<div class="wrap">-->\n            <!--<img src="/img/loading.gif" alt=""/>-->\n        <!--</div>-->\n    <!--</div>-->\n\n    <div id="go-up">\n        ^<br>\n        В<br>\n        В<br>\n        Е<br>\n        Р<br>\n        Х<br>\n    </div>\n\n    '), Spacebars.include(view.lookupTemplate("modal")), "\n\n    ", Spacebars.include(view.lookupTemplate("messages")), "\n\n    ", HTML.DIV({
    id: "perspective",
    "class": "perspective"
  }, "\n        ", HTML.DIV({
    "class": "main-wrap"
  }, "\n            ", HTML.DIV({
    "class": "wrapper"
  }, "\n                ", Spacebars.include(view.lookupTemplate("yield")), "\n            "), "\n        "), "\n        ", HTML.DIV({
    id: "main-menu"
  }, "\n\n            ", HTML.Raw('<div class="logo">\n                <p>M I C R O C O S M</p>\n                <p>the real social network</p>\n            </div>'), "\n            \n            ", HTML.DIV({
    "class": "avatar"
  }, "\n                ", HTML.IMG({
    src: function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("currentUser"), "profile", "avatar"));
    },
    alt: ""
  }), "\n            "), "\n\n            ", HTML.P({
    "class": "first-name"
  }, Blaze.View(function() {
    return Spacebars.mustache(Spacebars.dot(view.lookup("currentUser"), "profile", "firstName"));
  })), "\n            ", HTML.P({
    "class": "last-name"
  }, Blaze.View(function() {
    return Spacebars.mustache(Spacebars.dot(view.lookup("currentUser"), "profile", "secondName"));
  })), "\n            ", HTML.Raw('<a href="#" class="logout">выйти</a>'), "\n\n            ", HTML.Raw("<hr>"), "\n\n            ", HTML.Raw('<nav>\n                <ul>\n                    <li><a href="/cosmos"><i class="fa fa-globe"></i> Общение</a></li>\n                    <li><a href="/people"><i class="fa fa-users"></i> Люди</a></li>\n                    <li><a href="/news"><i class="fa fa-calendar"></i> В жизни</a></li>\n                    <li><a id="open-settings" href="/settings"><i class="fa fa-cogs"></i> Настройки</a></li>\n                </ul>\n            </nav>'), "\n\n            ", HTML.Raw("<hr>"), "\n\n            ", HTML.Raw("<h4>Новости</h4>"), "\n\n        "), "\n        ", HTML.Raw('<div id="notifications-cont">\n\n            <h3><i class="fa fa-bell"></i> НОВОСТИ</h3>\n            <h4>Мои оповещения <button><i class="fa fa-angle-up"></i></button></h4>\n            <div id="user-updates" class="news-cont">\n                <div class="filters">\n                    <ul>\n                        <li>\n                            <button>1</button>\n                        </li>\n                        <li>\n                            <button>2</button>\n                        </li>\n                        <li>\n                            <button>3</button>\n                        </li>\n                        <li>\n                            <button>4</button>\n                        </li>\n                        <li>\n                            <button>5</button>\n                        </li>\n                    </ul>\n                </div>\n                <ul>\n                    <li>\n                        <div>\n                            <div>\n                                <div><i class="fa fa-calendar"></i></div>\n                            </div>\n                        </div>\n                        <div>\n                            <h5><a href="">Андрей Андреев</a> <span>2 часа назад</span></h5>\n                            <p>Приглашает вас на встречу <a href="">Неделя Франции в Доме Кино 23.01.2014</a></p>\n                        </div>\n                    </li>\n                    <li>\n                        <div>\n                            <div>\n                                <div><i class="fa fa-heart"></i></div>\n                            </div>\n                        </div>\n                        <div>\n                            <h5><a href="">Лидия власова</a> <span>3 часа назад</span></h5>\n                            <p>Лайкнула вашу страничку</p>\n                        </div>\n                    </li>\n                    <li>\n                        <div>\n                            <div>\n                                <div><i class="fa fa-envelope"></i></div>\n                            </div>\n                        </div>\n                        <div>\n                            <h5><a href="">Лида Юрьева</a> <span>3 часа назад</span></h5>\n                            <p>"Привет, судя по всему мы очень похожа, хотелось бы проверить действительно ли это так))"</p>\n                        </div>\n                    </li>\n                </ul>\n            </div>\n\n            <h4>Обновления друзей <button><i class="fa fa-angle-up"></i></button></h4>\n            <div id="users-updates" class="news-cont">\n                <ul>\n                    <li>\n                        <div>\n                            <div>\n                                <div><i class="fa fa-users"></i></div>\n                            </div>\n                        </div>\n                        <div>\n                            <h5><a href="">Андрей Андреев</a> <span>2 часа назад</span></h5>\n                            <p>Добавил в друзья <a href="">Никиту Старцева</a></p>\n                        </div>\n                    </li>\n                    <li>\n                        <div>\n                            <div>\n                                <div><i class="fa fa-users"></i></div>\n                            </div>\n                        </div>\n                        <div>\n                            <h5><a href="">Люба Дюжева</a> <span>2 часа назад</span></h5>\n                            <p>Прошла тест "Соционика"</p>\n                        </div>\n                    </li>\n                    <li>\n                        <div>\n                            <div>\n                                <div><i class="fa fa-users"></i></div>\n                            </div>\n                        </div>\n                        <div>\n                            <h5><a href="">Кирилл ахметов</a> <span>3 часа назад</span></h5>\n                            <p>Посетит премьеру фильма "Чугунный скороход" в кинотеатре Аврора 23.09.2015</p>\n                        </div>\n                    </li>\n                </ul>\n            </div>\n\n        </div>'), "\n    ") ];
}));

Template.__define__("registrationLayout", (function() {
  var view = this;
  return Spacebars.include(view.lookupTemplate("yield"));
}));

})();
