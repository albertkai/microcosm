(function(){
Template.__define__("johariAside", (function() {
  var view = this;
  return [ HTML.INPUT({
    id: "userId",
    type: "hidden",
    value: function() {
      return Spacebars.mustache(view.lookup("id"));
    }
  }), "\n\n    ", HTML.DIV({
    "class": "johari-aside"
  }, "\n\n        ", HTML.Raw('<div class="container">\n\n            <div class="johari-insert "></div>\n\n        </div>'), "\n\n        ", HTML.DIV({
    "class": "johari-start"
  }, "\n\n            ", HTML.DIV({
    "class": "container"
  }, "\n\n                ", HTML.Raw("<h3>ДОБРОГО</h3>"), "\n                ", HTML.Raw("<h4>времени суток!</h4>"), "\n\n                ", HTML.DIV({
    "class": "circle huge"
  }, "\n\n                    ", HTML.P("\n                        Ваш друг", HTML.Raw("<br>"), "\n                        ", Blaze.View(function() {
    return Spacebars.mustache(view.lookup("name"));
  }), " считает", HTML.Raw("<br>"), "\n                        вас очень близким", HTML.Raw("<br>"), "\n                        человеком, и просит вас ", HTML.Raw("<br>"), "\n                        помочь в прохождении очень", HTML.Raw("<br>"), " интересного теста. Он ", HTML.Raw("<br>"), "\n                        называется ОКНО ДЖОХАРИ, и", HTML.Raw("<br>"), "\n                        является одним из самых", HTML.Raw("<br>"), "\n                        интересных и объективных", HTML.Raw("<br>"), "\n                        психологических", HTML.Raw("<br>"), "\n                        тестов\n                    "), "\n\n                "), "\n\n                ", HTML.Raw('<div class="circle small">\n\n                    <p>\n                        Сейчас вам<br>\n                        нужно будет выбрать<br>\n                        из предложенного списка<br>\n                        5 свойств характера, которые<br>\n                        наиболее полно охарактеризуют<br>\n                        вашего друга. Пожалуйста,<br>\n                        отнеситесь к этому<br>\n                        серьезно:)\n                    </p>\n\n                </div>'), "\n\n                ", HTML.Raw('<button id="johari-go">ПОЕХАЛИ</button>'), "\n\n            "), "\n\n        "), "\n\n    ") ];
}));

Template.__define__("johari", (function() {
  var view = this;
  return HTML.DIV({
    id: "johari-container",
    "class": "flip-cont-wrap"
  }, "\n\n        ", HTML.DIV({
    "class": "verso"
  }, "\n\n            ", HTML.DIV({
    "class": "flip-cont"
  }, "\n\n                ", HTML.Raw("<h3>ВЫБЕРИТЕ СПИСОК ЧЕРТ, ПРИСУЩИХ, КАК ВЫ СЧИТАЕТЕ, ВАШЕЙ ЛИЧНОСТИ:</h3>"), "\n\n                ", Spacebars.include(view.lookupTemplate("johariTraits")), "\n\n                ", HTML.Raw('<button id="submit-johari">ВЫБРАТЬ</button>'), "\n\n            "), "\n\n        "), "\n\n        ", HTML.DIV({
    "class": "recto"
  }, "\n\n            ", HTML.DIV({
    id: "registration-finished",
    "class": "flip-cont"
  }, "\n\n                ", HTML.Raw('<h3 class="bigger">Спасибо!</h3>'), "\n                ", HTML.Raw("<h4>Результаты сохранены</h4>"), "\n                ", HTML.Raw("<p>Вот ссылка, перейдя по которой близкие вам люди смогут также охарактеризовать вашу личность:</p>"), "\n                ", HTML.H4(HTML.A({
    href: function() {
      return [ "http://microcosm.com/johari/", Spacebars.mustache(Spacebars.dot(view.lookup("currentUser"), "_id")) ];
    }
  }, "http://microcosm.com/johari/", Blaze.View(function() {
    return Spacebars.mustache(Spacebars.dot(view.lookup("currentUser"), "_id"));
  }))), "\n                ", HTML.Raw("<p>Мы рекомендуем скидывать ее людям, которые вас достаточно хорошо знают, тогда результаты будут намного объективнее</p>"), "\n\n                ", HTML.Raw("<h3>Вот и все! Регистрация закончена!</h3>"), "\n                ", HTML.Raw("<h4>Надеюсь это не заняло у вас много времени!</h4>"), "\n\n                ", HTML.Raw('<button id="registration-finish"><i class="fa fa-user"></i> МОЙ ПРОФИЛЬ!</button>'), "\n\n            "), "\n\n        "), "\n\n\n    ");
}));

Template.__define__("johariAsideContent", (function() {
  var view = this;
  return HTML.DIV({
    id: "johari-container",
    "class": "flip-cont-wrap"
  }, "\n\n        ", HTML.DIV({
    "class": "verso"
  }, "\n\n            ", HTML.DIV({
    "class": "flip-cont"
  }, "\n\n                ", HTML.Raw("<h3>ВЫБЕРИТЕ СПИСОК ЧЕРТ, ПРИСУЩИХ, КАК ВЫ СЧИТАЕТЕ, ЛИЧНОСТИ ВАШЕГО ДРУГА:</h3>"), "\n\n                ", Spacebars.include(view.lookupTemplate("johariTraits")), "\n\n                ", HTML.Raw('<button id="submit-johari">ВЫБРАТЬ</button>'), "\n\n            "), "\n\n        "), "\n\n        ", HTML.DIV({
    "class": "recto"
  }, "\n\n            ", HTML.DIV({
    id: "johari-aside-final",
    "class": "flip-cont"
  }, "\n\n                ", HTML.Raw("<h3>Спасибо!</h3>"), "\n                ", HTML.H4("Ваши результаты приняты! ", Blaze.View(function() {
    return Spacebars.mustache(view.lookup("name"));
  }), " скажет вам спасибо!"), "\n                ", HTML.Raw("<p>Джохари - это одна из методик тестирования на новом революционном проекте, который поможет вам:</p>"), "\n                ", HTML.Raw("<p>1 - лучше узнать себя, свои склонности, особенности характера и прочее</p>"), "\n                ", HTML.Raw("<p>2 - лучше лучше своих друзей, насколько вы совместимы, почему у вас согут быть конфликты и как их избежать</p>"), "\n                ", HTML.Raw("<p>3 - и наконец - начать общаться со множеством интересных людей со всего света, которые максимально подходят именно вам!</p>"), "\n                ", HTML.P(Blaze.View(function() {
    return Spacebars.mustache(view.lookup("username"));
  }), " ждет вас на проекте:"), "\n\n\n                ", HTML.Raw("<button>m i c r o c o s m</button>"), "\n            "), "\n\n        "), "\n\n    ");
}));

Template.__define__("johariTraits", (function() {
  var view = this;
  return HTML.Raw('<div class="traits">\n\n        <div class="column">\n\n        </div>\n        <div class="column">\n\n        </div>\n        <div class="column">\n\n        </div>\n        <div class="column">\n\n        </div>\n        <div class="column">\n\n        </div>\n\n    </div>');
}));

Template.__define__("johariYours", (function() {
  var view = this;
  return HTML.Raw("<h1>Упсики, вы уже заполняли свое окно. Эту ссылку нужно скидывать близким людям.</h1>");
}));

})();
