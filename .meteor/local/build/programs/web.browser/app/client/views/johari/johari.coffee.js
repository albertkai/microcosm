(function(){__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Template.johariAside.rendered = function() {
  var $cont;
  $cont = $(this.find('.johari-start'));
  $cont.addClass('_visible');
  setTimeout(function() {
    return $cont.find('h3').addClass('_visible');
  }, 100);
  setTimeout(function() {
    return $cont.find('h4').addClass('_visible');
  }, 1200);
  setTimeout(function() {
    return $cont.find('.circle').first().addClass('_visible');
  }, 4000);
  setTimeout(function() {
    return $cont.find('.circle').first().next().addClass('_visible');
  }, 8000);
  setTimeout(function() {
    return $cont.find('button').addClass('_visible');
  }, 12000);
  return log('johari intro initialized');
};

Template.johari.events({
  'click #submit-johari': function(e) {
    var results;
    e.preventDefault();
    if ($('.trait._selected').length === 5) {
      results = {};
      $(e.currentTarget).siblings('.traits').find('.trait').each(function() {
        var alias;
        alias = $(this).data('value');
        log(alias);
        log($(this).hasClass('_selected'));
        if ($(this).hasClass('_selected')) {
          return results[alias] = 1;
        } else {
          return results[alias] = 0;
        }
      });
      log('Results of initializing johari test, passing results to Johari::init:');
      log(results);
      return Johari.init(Meteor.user(), results, function() {
        var $cont;
        $cont = $('#johari-container');
        return $cont.removeClass('flip').addClass('_ready');
      });
    } else if ($('.trait._selected').length < 5) {
      return MainCtrl.notify('Упсики!:(', 'Вы должны выбрать ровно 5 определений личности!', 'error');
    } else if ($('.trait._selected').length > 5) {
      return MainCtrl.notify('Пиздец!:)', 'Зачем ты занимаешься бредом?))', 'error');
    }
  },
  'click #registration-finish': function(e) {
    var username;
    e.preventDefault();
    $('#johari-container').removeClass('_ready');
    $('.background').removeClass('_visible');
    Meteor.users.update(Meteor.user()._id, {
      $set: {
        'profile.registration.status': 'tested'
      }
    });
    username = Meteor.user().profile.username;
    setTimeout(function() {
      return window.location.href = '/';
    }, 400);
    return log('Registration passed!');
  }
});

Template.johariAside.events({
  'click #johari-go': function() {
    var $cont;
    $cont = $('.johari-aside').find('.johari-start');
    $cont.find('*').removeClass('_visible');
    return setTimeout(function() {
      $cont.removeClass('_visible');
      return UI.insert(UI.render(Template.johariAsideContent), $('.johari-insert').get(0));
    }, 1000);
  }
});

Template.johariAsideContent.events({
  'click #submit-johari': function(e) {
    var id, results;
    e.preventDefault();
    if ($('.trait._selected').length === 5) {
      $('#johari-container').removeClass('flip').addClass('_ready');
      id = $('#userId').val();
      results = {};
      $('.trait').each(function() {
        var alias;
        alias = $(this).data('value');
        if ($(this).hasClass('_selected')) {
          return results[alias] = 1;
        } else {
          return results[alias] = 0;
        }
      });
      return Johari.add(id, results);
    } else if ($('.trait._selected').length < 5) {
      return MainCtrl.notify('Упсики!:(', 'Вы должны выбрать ровно 5 определений личности!', 'error');
    } else if ($('.trait._selected').length > 5) {
      return MainCtrl.notify('Пиздец!:)', 'Зачем ты занимаешься бредом?))', 'error');
    }
  }
});

Template.johariTraits.rendered = function() {
  var counter, gender, lang, markup, targetCol, translated;
  setTimeout((function(_this) {
    return function() {
      return $('.flip-cont-wrap').addClass('flip');
    };
  })(this), 200);
  gender = 'male';
  translated = [];
  markup = '';
  for (lang in Meteor.i18nMessages.johari[gender]) {
    translated.push({
      text: __('johari.' + gender + '.' + lang),
      alias: lang
    });
  }
  counter = 0;
  targetCol = $(this.find('.column')).first();
  return translated.forEach(function(trait) {
    var traitMarkup;
    traitMarkup = '<p class="trait" data-value="' + trait.alias + '"><span>' + trait.text + '</span></p>';
    if (counter < 11) {
      targetCol.append(traitMarkup);
      return counter++;
    } else {
      log('alter');
      counter = 1;
      targetCol = targetCol.next();
      return targetCol.append(traitMarkup);
    }
  });
};

Template.johariTraits.events({
  'click .trait': function(e) {
    if (!$(e.currentTarget).hasClass('_selected')) {
      if ($('.trait._selected').length < 5) {
        return $(e.currentTarget).addClass('_selected');
      } else {
        return MainCtrl.notify('Вы пытаетесь выбрать больше 5 пунктов', 'Можете убрать выделение с другой черты, если считаете, что эта подходит больше', 'error');
      }
    } else {
      return $(e.currentTarget).removeClass('_selected');
    }
  },
  'click #submit-johari': function(e) {
    var results;
    e.preventDefault();
    results = {};
    $('.trait').each(function() {
      var alias;
      alias = $(this).data('value');
      if ($(this).hasClass('_selected')) {
        return results[alias] = 1;
      } else {
        return results[alias] = 0;
      }
    });
    return Johari.init(Meteor.user(), results);
  }
});

})();

//# sourceMappingURL=87c637dc379a394ecd9c248e66a8d82f6933b8c7.map
