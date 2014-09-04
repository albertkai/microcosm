(function(){
Template.__define__("hello", (function() {
  var view = this;
  return HTML.SECTION({
    id: "hello"
  }, "\n\n        ", HTML.SECTION({
    "class": "top"
  }, "\n            ", HTML.DIV({
    "class": "container"
  }, "\n                ", Spacebars.include(view.lookupTemplate("loginButtons")), "\n                ", HTML.Raw('<div class="login-cont">\n                    <div><a>войти</a> | <a>регистрация</a></div>\n                </div>'), "\n                ", HTML.Raw("<h1>H o M I E s</h1>"), "\n            "), "\n        "), HTML.Raw('\n\n        <section class="info">\n            <div class="container">\n                <div>\n                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci cum id, iure placeat porro rem veniam voluptates voluptatibus. Aut cumque dolores enim esse nulla tempore ullam voluptates. Ab distinctio, ipsum.</p>\n                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias assumenda consequuntur et excepturi maxime, nesciunt non omnis quam soluta velit!</p>\n                </div>\n                <aside>\n                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores eligendi in ipsa perspiciatis quae quas reprehenderit tempora. Accusamus, obcaecati saepe?</p>\n                </aside>\n            </div>\n        </section>\n\n    '));
}));

})();
