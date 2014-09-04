(function(){
Template.__define__("profile", (function() {
  var view = this;
  return HTML.SECTION({
    "class": "profile"
  }, "\n\n        ", HTML.INPUT({
    id: "userId",
    type: "hidden",
    value: function() {
      return Spacebars.mustache(view.lookup("userId"));
    }
  }), "\n\n        ", HTML.DIV({
    "class": "top",
    style: function() {
      return [ "background-image: url(http://d1jfn2lab933y3.cloudfront.net/", Spacebars.mustache(view.lookup("backgroundImage")), ")" ];
    }
  }, "\n            ", Spacebars.include(view.lookupTemplate("profileTop")), "\n        "), "\n\n        ", HTML.DIV({
    "class": "main-info"
  }, "\n            ", Spacebars.include(view.lookupTemplate("profileMainInfo")), "\n        "), HTML.Raw('\n\n        <footer>\n            <div class="container">\n                This is footer!!\n            </div>\n        </footer>\n\n    '));
}));

Template.__define__("profileTop", (function() {
  var view = this;
  return [ HTML.Raw('<button id="showMenu" class="menu-toggle">\n        m i c r o c o s m\n    </button>\n    <button id="show-notifications" class="notifications-toggle">\n        <i class="fa fa-bell"></i>\n    </button>\n    <input id="changeBackground" type="file">\n    '), HTML.H1({
    "class": "heading"
  }, "\n        ", HTML.DIV({
    "class": "container"
  }, "\n            ", HTML.P(Blaze.View(function() {
    return Spacebars.mustache(Spacebars.dot(view.lookup("profile"), "firstName"));
  }), " ", Blaze.View(function() {
    return Spacebars.mustache(Spacebars.dot(view.lookup("profile"), "secondName"));
  })), "\n\n            ", HTML.Raw('<div class="colors-cont">\n                <div id="dominant"></div>\n                <div></div>\n                <div></div>\n                <div></div>\n            </div>'), "\n\n            ", HTML.Raw('<div class="info-short">\n                <p>77%</p>\n            </div>'), "\n        "), "\n    "), "\n    ", HTML.DIV({
    "class": "container"
  }, "\n        ", HTML.DIV({
    "class": "avatar"
  }, "\n            ", HTML.IMG({
    src: function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("profile"), "avatar"));
    },
    alt: "avatar"
  }), "\n            ", HTML.Raw('<button class="view-pics"><i class="fa fa-camera"></i></button>'), "\n        "), "\n        ", HTML.Raw('<ul class="controls">\n            <li>\n                <button><i class="fa fa-star"></i></button>\n            </li>\n            <li>\n                <button><i class="fa fa-envelope"></i></button>\n                <span>25</span>\n            </li>\n            <li>\n                <button><i class="fa fa-users"></i></button>\n            </li>\n            <li>\n                <button><i class="fa fa-heart"></i></button>\n                <span>3</span>\n            </li>\n        </ul>'), "\n        ", HTML.Raw('<div class="tag-cloud-cont">\n            <div id="tag-cloud" class="tag-cloud"></div>\n            <ul class="pins">\n                <li class="_active"><div class="tltp">личность</div></li>\n                <li><div class="tltp">интересы</div></li>\n                <li><div class="tltp">ценности</div></li>\n            </ul>\n        </div>'), "\n    ") ];
}));

Template.__define__("profileMainInfo", (function() {
  var view = this;
  return [ HTML.NAV({
    "class": "top-menu"
  }, "\n        ", HTML.UL("\n            ", HTML.LI({
    "class": "_active"
  }, Blaze.View(function() {
    return Spacebars.mustache(Spacebars.dot(view.lookup("working"), "personality"));
  }), HTML.Raw("<div></div>")), "\n            ", HTML.LI(Blaze.View(function() {
    return Spacebars.mustache(Spacebars.dot(view.lookup("working"), "ideology"));
  }), HTML.Raw("<div></div>")), "\n            ", HTML.LI(Blaze.View(function() {
    return Spacebars.mustache(Spacebars.dot(view.lookup("working"), "recomendations"));
  }), HTML.Raw("<div></div>")), "\n        "), "\n    "), "\n\n\n    ", HTML.DIV({
    "class": "info-tabs"
  }, "\n\n        ", HTML.DIV({
    "class": "info-tabs-cont"
  }, "\n\n            ", HTML.DIV({
    id: "personality",
    "class": "info-cont"
  }, "\n                ", HTML.DIV({
    "class": "container"
  }, "\n                    ", HTML.DIV({
    "class": "row"
  }, "\n                        ", HTML.ASIDE("\n                            ", HTML.NAV({
    "class": "context-nav sticky"
  }, "\n                                ", HTML.UL("\n                                    ", HTML.Raw('<li class="_active" data-target="main">Основное\n                                        <div></div>\n                                    </li>'), "\n                                    ", Blaze.If(function() {
    return Spacebars.call(Spacebars.dot(view.lookup("currentUser"), "profile", "tests", "bigFive"));
  }, function() {
    return [ "\n                                    ", HTML.LI({
      "data-target": "psychology"
    }, "Психология\n                                        ", HTML.DIV(), "\n                                    "), "\n                                    " ];
  }), "\n                                    ", Blaze.If(function() {
    return Spacebars.call(Spacebars.dot(view.lookup("currentUser"), "profile", "tests", "astro"));
  }, function() {
    return [ "\n                                    ", HTML.LI({
      "data-target": "astrology"
    }, "Астрология\n                                        ", HTML.DIV(), "\n                                    "), "\n                                    " ];
  }), "\n                                    ", Blaze.If(function() {
    return Spacebars.call(Spacebars.dot(view.lookup("currentUser"), "profile", "tests", "johari"));
  }, function() {
    return [ "\n                                    ", HTML.LI({
      "data-target": "johari"
    }, "Джохари\n                                        ", HTML.DIV(), "\n                                    "), "\n                                    " ];
  }), "\n                                "), "\n                                ", HTML.Raw('<button id="open-tests-menu"><i class="fa fa-plus"></i></button>'), "\n                            "), "\n                        "), "\n                        ", HTML.DIV({
    style: "min-height: 700px"
  }, "\n\n                            ", Spacebars.include(view.lookupTemplate("bigFiveOutput")), "\n\n                            ", HTML.Raw('<article id="astrology" class="units">\n\n                                <h2>Астрология</h2>\n\n                                <div id="cosmogramm"></div>\n\n                                <h3>Астрологическая характеристика</h3>\n\n                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Distinctio doloremque eaque inventore nesciunt odio sed temporibus voluptate. Accusantium culpa earum, eius, exercitationem magnam modi necessitatibus officiis perferendis reprehenderit vitae voluptates?</p>\n                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur dicta eligendi nesciunt nihil nostrum, omnis porro possimus quasi quo, ratione repellat saepe velit veniam?</p>\n                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Est, repudiandae.</p>\n                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Commodi deserunt eaque eius exercitationem incidunt inventore nobis rerum voluptatum. Asperiores beatae consectetur enim libero natus nemo perspiciatis voluptatibus. A consectetur cumque distinctio, dolore quia soluta.</p>\n                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A ipsum non quis.</p>\n                            </article>'), "\n\n                            ", Spacebars.include(view.lookupTemplate("johariOutput")), "\n\n                        "), "\n                    "), "\n                "), "\n            "), "\n\n            ", HTML.Raw('<div id="personal-info" class="info-cont">\n                <div class="container">\n\n                    <div class="row">\n                        <aside>\n                            <nav class="context-nav">\n                                <ul>\n                                    <li class="_active">Мировоззрение\n                                        <div></div>\n                                    </li>\n                                </ul>\n                            </nav>\n                        </aside>\n                        <div>\n                            <article>\n                                <h2>Мировоззрение</h2>\n                                <h5>Какие 5 качеств в людях?</h5>\n                                <p>Преданность, открытость, прямолинейность, ум, настойчивость, доброту</p>\n                                <h5>Если бы вам сказали до конца жизни смотреть всего 3 фильма, что бы это было?</h5>\n                            </article>\n                        </div>\n                    </div>\n\n                    <div class="row">\n                        <aside>\n                            <nav class="context-nav">\n                                <ul>\n                                    <li class="_active">Предпочтения\n                                        <div></div>\n                                    </li>\n                                </ul>\n                            </nav>\n                        </aside>\n                        <div>\n                            <article>\n                                <h2>Предпочтения</h2>\n                                <p>Люблю кушать, всякие няшности!</p>\n                            </article>\n                        </div>\n                    </div>\n                </div>\n            </div>'), "\n\n            ", HTML.Raw('<div id="personal-recomendations" class="info-cont">\n                <div class="container">\n                    <div class="row">\n                        <aside>\n                            <nav class="context-nav">\n                                <ul>\n                                    <li class="_active">Основное\n                                        <div></div>\n                                    </li>\n                                    <li>Психология\n                                        <div></div>\n                                    </li>\n                                    <li>Астрология\n                                        <div></div>\n                                    </li>\n                                    <li>Джохари\n                                        <div></div>\n                                    </li>\n                                </ul>\n                            </nav>\n                        </aside>\n                        <div>\n\n                            <div id="cosmogramm" class="units">\n\n                                <h2>Астрология</h2>\n\n                            </div>\n\n                            <div id="psychology" class="units">\n\n                                <h2>Психология</h2>\n\n                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A ab architecto aut blanditiis culpa dolores et ex facilis fugiat harum, id libero, modi nisi optio perferendis quam quasi quis quisquam repellat reprehenderit sit vitae, voluptas!</p>\n                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A ab architecto aut blanditiis culpa dolores et ex facilis fugiat harum quasi quis quisquam repellat reprehenderit sit vitae, voluptas!</p>\n                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A ab architecto aut blanditiis culpa dolores et ex facilis fugiat harum quasi quis quisquam repellat reprehenderit, voluptas!</p>\n\n                            </div>\n\n                            <div id="johari" class="units">\n\n                                <h2>Джохари</h2>\n\n                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A ab architecto aut blanditiis culpa dolores et ex facilis fugiat harum, id libero, modi nisi optio perferendis quam quasi quis quisquam repellat reprehenderit sit vitae, voluptas!</p>\n                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A ab architecto aut blanditiis culpa dolores et ex facilis fugiat harum quasi quis quisquam repellat reprehenderit sit vitae, voluptas!</p>\n                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A ab architecto aut blanditiis culpa dolores et ex facilis fugiat harum quasi quis quisquam repellat reprehenderit, voluptas!</p>\n\n                            </div>\n\n                        </div>\n                    </div>\n                </div>\n            </div>'), "\n\n        "), "\n\n    ") ];
}));

Template.__define__("johariOutput", (function() {
  var view = this;
  return HTML.ARTICLE({
    id: "johari",
    "class": "units"
  }, HTML.Raw('\n\n        <h2>Джохари</h2>\n\n        <div id="johari-cont">\n\n            <p class="desc">ИЗВЕСТНО МНЕ</p>\n            <p class="desc">НЕИЗВЕСТНО МНЕ</p>\n            <p class="desc">ИЗВЕСТНО ОКРУЖАЮЩИМ</p>\n            <p class="desc">НЕИЗВЕСТНО ОКРУЖАЮЩИМ</p>\n\n            <div id="johari-graph">\n\n                <div class="sector">\n                    <div class="circle">\n                        <div id="open-sector" class="traits"></div>\n                    </div>\n                </div>\n                <div class="sector">\n                    <div class="circle">\n                        <div id="blind-sector" class="traits"></div>\n                    </div>\n                </div>\n                <div class="sector">\n                    <div class="circle">\n                        <div id="hidden-sector" class="traits"></div>\n                    </div>\n                </div>\n                <div class="sector">\n                    <div class="circle">\n                        <div id="unknown-sector" class="traits"></div>\n                    </div>\n                </div>\n\n\n            </div>\n\n        </div>\n\n        '), HTML.P({
    "class": "link"
  }, "\n            Ссылка для друзей:", HTML.Raw("<br>"), "\n            ", HTML.SPAN("http://microcosm.com/johari/", Blaze.View(function() {
    return Spacebars.mustache(Spacebars.dot(view.lookup("currentUser"), "_id"));
  })), "\n        "), HTML.Raw("\n\n        <h3>Выводы</h3>\n        <p>Степень целостости личности весьма высока!</p>\n        <p>Как мы видим, черты в открытом секторе (5) преобладают над слепым сектором (3) и скрытым сектором (4)</p>\n        "), HTML.P("Это говорит о том, что ", Blaze.View(function() {
    return Spacebars.mustache(Spacebars.dot(view.lookup("currentUser"), "profile", "firstName"));
  }), " является очень открытым человеком и не имеет ярко выраженных скрытых и незамечаемых сторон личности"), HTML.Raw('\n        <p>Результат очень хороший, продолжайте в том же духе!</p>\n        <p>И все же мы видим такие черты как: милый, открытый, нетерпеливый в скрытом секторе, это говорит о том, что вы не афишируете эти черты, но при этом они являются частью вашей личности. Возможно вам стоит найти положительные моменты в этом и попытаться признать эти черты как часть своей индивидуальности</p>\n        <p>Также в <a class="tltp" data-tltp="Это то, что видят другие, но не замечаете вы">слепом секторе</a> мы видим страстность, инфантильность и фрустрацию, причем черта "фрустрированный" отметили 4 ваших друга. Это говорит о том, что стоит также обратить свое внимание на эти вещи </p>\n        <p>Вцелом все очень неплохо, продолжайте двигаться в том же духе!</p>\n        <button class="paid">$ подробный анализ</button>\n\n\n    '));
}));

Template.__define__("bigFiveOutput", (function() {
  var view = this;
  return HTML.Raw('<article id="psychology" class="units">\n\n        <h2>Психология</h2>\n\n        <div id="primary-output"></div>\n        <div id="secondary-output"></div>\n\n        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A ab architecto aut blanditiis culpa dolores et ex facilis fugiat harum, id libero, modi nisi optio perferendis quam quasi quis quisquam repellat reprehenderit sit vitae, voluptas!</p>\n        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A ab architecto aut blanditiis culpa dolores et ex facilis fugiat harum quasi quis quisquam repellat reprehenderit sit vitae, voluptas!</p>\n        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A ab architecto aut blanditiis culpa dolores et ex facilis fugiat harum quasi quis quisquam repellat reprehenderit, voluptas!</p>\n\n    </article>');
}));

})();
