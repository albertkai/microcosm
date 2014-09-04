(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;
var EJSON = Package.ejson.EJSON;
var MongoInternals = Package['mongo-livedata'].MongoInternals;
var LocalCollection = Package.minimongo.LocalCollection;
var Minimongo = Package.minimongo.Minimongo;
var Deps = Package.deps.Deps;

/* Package-scope variables */
var CollectionHooks, docIds;

(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/matb33:collection-hooks/bind-polyfill.js                                                               //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind                  // 1
                                                                                                                   // 2
if (!Function.prototype.bind) {                                                                                    // 3
  Function.prototype.bind = function (oThis) {                                                                     // 4
    if (typeof this !== "function") {                                                                              // 5
      // closest thing possible to the ECMAScript 5 internal IsCallable function                                   // 6
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");                 // 7
    }                                                                                                              // 8
                                                                                                                   // 9
    var aArgs = Array.prototype.slice.call(arguments, 1),                                                          // 10
        fToBind = this,                                                                                            // 11
        fNOP = function () {},                                                                                     // 12
        fBound = function () {                                                                                     // 13
          return fToBind.apply(this instanceof fNOP && oThis                                                       // 14
                                 ? this                                                                            // 15
                                 : oThis,                                                                          // 16
                               aArgs.concat(Array.prototype.slice.call(arguments)));                               // 17
        };                                                                                                         // 18
                                                                                                                   // 19
    fNOP.prototype = this.prototype;                                                                               // 20
    fBound.prototype = new fNOP();                                                                                 // 21
                                                                                                                   // 22
    return fBound;                                                                                                 // 23
  };                                                                                                               // 24
}                                                                                                                  // 25
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/matb33:collection-hooks/collection-hooks.js                                                            //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
// Relevant AOP terminology:                                                                                       // 1
// Aspect: User code that runs before/after (hook)                                                                 // 2
// Advice: Wrapper code that knows when to call user code (aspects)                                                // 3
// Pointcut: before/after                                                                                          // 4
                                                                                                                   // 5
var advices = {};                                                                                                  // 6
// XXX this only used on the server; should it really be here?                                                     // 7
var publishUserId = new Meteor.EnvironmentVariable();                                                              // 8
var constructor = Meteor.Collection;                                                                               // 9
var proto = new Meteor.Collection(null);                                                                           // 10
                                                                                                                   // 11
var directEnv = new Meteor.EnvironmentVariable();                                                                  // 12
var directOp = function (func) {                                                                                   // 13
  return directEnv.withValue(true, func);                                                                          // 14
};                                                                                                                 // 15
                                                                                                                   // 16
function getUserId() {                                                                                             // 17
  var userId;                                                                                                      // 18
                                                                                                                   // 19
  if (Meteor.isClient) {                                                                                           // 20
    Deps.nonreactive(function () {                                                                                 // 21
      userId = Meteor.userId && Meteor.userId();                                                                   // 22
    });                                                                                                            // 23
  }                                                                                                                // 24
                                                                                                                   // 25
  if (Meteor.isServer) {                                                                                           // 26
    try {                                                                                                          // 27
      // Will throw an error unless within method call.                                                            // 28
      // Attempt to recover gracefully by catching:                                                                // 29
      userId = Meteor.userId && Meteor.userId();                                                                   // 30
    } catch (e) {}                                                                                                 // 31
                                                                                                                   // 32
    if (!userId) {                                                                                                 // 33
      // Get the userId if we are in a publish function.                                                           // 34
      userId = publishUserId.get();                                                                                // 35
    }                                                                                                              // 36
  }                                                                                                                // 37
                                                                                                                   // 38
  return userId;                                                                                                   // 39
}                                                                                                                  // 40
                                                                                                                   // 41
CollectionHooks = {                                                                                                // 42
  defaults: {                                                                                                      // 43
    before: { insert: {}, update: {}, remove: {}, find: {}, findOne: {}, all: {}},                                 // 44
    after: { insert: {}, update: {}, remove: {}, find: {}, findOne: {}, all: {}},                                  // 45
    all: { insert: {}, update: {}, remove: {}, find: {}, findOne: {}, all: {}}                                     // 46
  }                                                                                                                // 47
};                                                                                                                 // 48
                                                                                                                   // 49
CollectionHooks.extendCollectionInstance = function (self) {                                                       // 50
  var collection = Meteor.isClient ? self : self._collection;                                                      // 51
                                                                                                                   // 52
  // Offer a public API to allow the user to define aspects                                                        // 53
  // Example: collection.before.insert(func);                                                                      // 54
  _.each(["before", "after"], function (pointcut) {                                                                // 55
    _.each(advices, function (advice, method) {                                                                    // 56
      Meteor._ensure(self, pointcut, method);                                                                      // 57
      Meteor._ensure(self, "_hookAspects", method);                                                                // 58
                                                                                                                   // 59
      self._hookAspects[method][pointcut] = [];                                                                    // 60
      self[pointcut][method] = function (aspect, options) {                                                        // 61
        var len = self._hookAspects[method][pointcut].push({                                                       // 62
          aspect: aspect,                                                                                          // 63
          options: CollectionHooks.initOptions(options, pointcut, method)                                          // 64
        });                                                                                                        // 65
                                                                                                                   // 66
        return {                                                                                                   // 67
          replace: function (aspect, options) {                                                                    // 68
            self._hookAspects[method][pointcut].splice(len - 1, 1, {                                               // 69
              aspect: aspect,                                                                                      // 70
              options: CollectionHooks.initOptions(options, pointcut, method)                                      // 71
            });                                                                                                    // 72
          },                                                                                                       // 73
          remove: function () {                                                                                    // 74
            self._hookAspects[method][pointcut].splice(len - 1, 1);                                                // 75
          }                                                                                                        // 76
        };                                                                                                         // 77
      };                                                                                                           // 78
    });                                                                                                            // 79
  });                                                                                                              // 80
                                                                                                                   // 81
  // Offer a publicly accessible object to allow the user to define                                                // 82
  // collection-wide hook options.                                                                                 // 83
  // Example: collection.hookOptions.after.update = {fetchPrevious: false};                                        // 84
  self.hookOptions = EJSON.clone(CollectionHooks.defaults);                                                        // 85
                                                                                                                   // 86
  // Wrap mutator methods, letting the defined advice do the work                                                  // 87
  _.each(advices, function (advice, method) {                                                                      // 88
    // Store a reference to the mutator method in a publicly reachable location                                    // 89
    var _super = collection[method];                                                                               // 90
                                                                                                                   // 91
    Meteor._ensure(self, "direct", method);                                                                        // 92
    self.direct[method] = function () {                                                                            // 93
      var args = _.toArray(arguments);                                                                             // 94
      return directOp(function () {                                                                                // 95
        return _super.apply(collection, args);                                                                     // 96
      });                                                                                                          // 97
    };                                                                                                             // 98
                                                                                                                   // 99
    collection[method] = function () {                                                                             // 100
      if (directEnv.get() === true) {                                                                              // 101
        return _super.apply(collection, arguments);                                                                // 102
      }                                                                                                            // 103
                                                                                                                   // 104
      return advice.call(this,                                                                                     // 105
        getUserId(),                                                                                               // 106
        _super,                                                                                                    // 107
        self,                                                                                                      // 108
        self._hookAspects[method] || {},                                                                           // 109
        function (doc) {                                                                                           // 110
          return  _.isFunction(self._transform)                                                                    // 111
                  ? function (d) { return self._transform(d || doc); }                                             // 112
                  : function (d) { return d || doc; };                                                             // 113
        },                                                                                                         // 114
        _.toArray(arguments)                                                                                       // 115
      );                                                                                                           // 116
    };                                                                                                             // 117
  });                                                                                                              // 118
};                                                                                                                 // 119
                                                                                                                   // 120
CollectionHooks.defineAdvice = function (method, advice) {                                                         // 121
  advices[method] = advice;                                                                                        // 122
};                                                                                                                 // 123
                                                                                                                   // 124
CollectionHooks.initOptions = function (options, pointcut, method) {                                               // 125
  return CollectionHooks.extendOptions(CollectionHooks.defaults, options, pointcut, method);                       // 126
};                                                                                                                 // 127
                                                                                                                   // 128
CollectionHooks.extendOptions = function (source, options, pointcut, method) {                                     // 129
  options = _.extend(options || {}, source.all.all);                                                               // 130
  options = _.extend(options, source[pointcut].all);                                                               // 131
  options = _.extend(options, source.all[method]);                                                                 // 132
  options = _.extend(options, source[pointcut][method]);                                                           // 133
  return options;                                                                                                  // 134
};                                                                                                                 // 135
                                                                                                                   // 136
CollectionHooks.getDocs = function (collection, selector, options) {                                               // 137
  var self = this;                                                                                                 // 138
                                                                                                                   // 139
  var findOptions = {transform: null, reactive: false}; // added reactive: false                                   // 140
                                                                                                                   // 141
  /*                                                                                                               // 142
  // No "fetch" support at this time.                                                                              // 143
  if (!self._validators.fetchAllFields) {                                                                          // 144
    findOptions.fields = {};                                                                                       // 145
    _.each(self._validators.fetch, function(fieldName) {                                                           // 146
      findOptions.fields[fieldName] = 1;                                                                           // 147
    });                                                                                                            // 148
  }                                                                                                                // 149
  */                                                                                                               // 150
                                                                                                                   // 151
  // Bit of a magic condition here... only "update" passes options, so this is                                     // 152
  // only relevant to when update calls getDocs:                                                                   // 153
  if (options) {                                                                                                   // 154
    // This was added because in our case, we are potentially iterating over                                       // 155
    // multiple docs. If multi isn't enabled, force a limit (almost like                                           // 156
    // findOne), as the default for update without multi enabled is to affect                                      // 157
    // only the first matched document:                                                                            // 158
    if (!options.multi) {                                                                                          // 159
      findOptions.limit = 1;                                                                                       // 160
    }                                                                                                              // 161
  }                                                                                                                // 162
                                                                                                                   // 163
  // Unlike validators, we iterate over multiple docs, so use                                                      // 164
  // find instead of findOne:                                                                                      // 165
  return collection.find(selector, findOptions);                                                                   // 166
};                                                                                                                 // 167
                                                                                                                   // 168
CollectionHooks.reassignPrototype = function (instance, constr) {                                                  // 169
  var hasSetPrototypeOf = typeof Object.setPrototypeOf === "function";                                             // 170
                                                                                                                   // 171
  if (!constr) constr = Meteor.Collection;                                                                         // 172
                                                                                                                   // 173
  // __proto__ is not available in < IE11                                                                          // 174
  // Note: Assigning a prototype dynamically has performance implications                                          // 175
  if (hasSetPrototypeOf) {                                                                                         // 176
    Object.setPrototypeOf(instance, constr.prototype);                                                             // 177
  } else if (instance.__proto__) {                                                                                 // 178
    instance.__proto__ = constr.prototype;                                                                         // 179
  }                                                                                                                // 180
};                                                                                                                 // 181
                                                                                                                   // 182
Meteor.Collection = function () {                                                                                  // 183
  var ret = constructor.apply(this, arguments);                                                                    // 184
  CollectionHooks.extendCollectionInstance(this);                                                                  // 185
  return ret;                                                                                                      // 186
};                                                                                                                 // 187
                                                                                                                   // 188
Meteor.Collection.prototype = proto;                                                                               // 189
                                                                                                                   // 190
for (var prop in constructor) {                                                                                    // 191
  if (constructor.hasOwnProperty(prop)) {                                                                          // 192
    Meteor.Collection[prop] = constructor[prop];                                                                   // 193
  }                                                                                                                // 194
}                                                                                                                  // 195
                                                                                                                   // 196
if (Meteor.isServer) {                                                                                             // 197
  var _publish = Meteor.publish;                                                                                   // 198
  Meteor.publish = function (name, func) {                                                                         // 199
    return _publish.call(this, name, function () {                                                                 // 200
      // This function is called repeatedly in publications                                                        // 201
      var ctx = this, args = arguments;                                                                            // 202
      return publishUserId.withValue(ctx && ctx.userId, function() {                                               // 203
        return func.apply(ctx, args);                                                                              // 204
      });                                                                                                          // 205
    });                                                                                                            // 206
  };                                                                                                               // 207
                                                                                                                   // 208
  // Make the above available for packages with hooks that want to determine                                       // 209
  // whether they are running inside a publish function or not.                                                    // 210
  CollectionHooks.isWithinPublish = function () {                                                                  // 211
    return publishUserId.get() !== undefined;                                                                      // 212
  };                                                                                                               // 213
}                                                                                                                  // 214
                                                                                                                   // 215
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/matb33:collection-hooks/insert.js                                                                      //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
CollectionHooks.defineAdvice("insert", function (userId, _super, instance, aspects, getTransform, args) {          // 1
  var self = this;                                                                                                 // 2
  var ctx = {context: self, _super: _super, args: args};                                                           // 3
  var callback = _.last(args);                                                                                     // 4
  var async = _.isFunction(callback);                                                                              // 5
  var abort, ret;                                                                                                  // 6
                                                                                                                   // 7
  // args[0] : doc                                                                                                 // 8
  // args[1] : callback                                                                                            // 9
                                                                                                                   // 10
  // before                                                                                                        // 11
  _.each(aspects.before, function (o) {                                                                            // 12
    var r = o.aspect.call(_.extend({transform: getTransform(args[0])}, ctx), userId, args[0]);                     // 13
    if (r === false) abort = true;                                                                                 // 14
  });                                                                                                              // 15
                                                                                                                   // 16
  if (abort) return false;                                                                                         // 17
                                                                                                                   // 18
  function after(id, err) {                                                                                        // 19
    var doc = args[0];                                                                                             // 20
    if (id) {                                                                                                      // 21
      doc = EJSON.clone(args[0]);                                                                                  // 22
      doc._id = id;                                                                                                // 23
    }                                                                                                              // 24
    var lctx = _.extend({transform: getTransform(doc), _id: id, err: err}, ctx);                                   // 25
    _.each(aspects.after, function (o) {                                                                           // 26
      o.aspect.call(lctx, userId, doc);                                                                            // 27
    });                                                                                                            // 28
    return id;                                                                                                     // 29
  }                                                                                                                // 30
                                                                                                                   // 31
  if (async) {                                                                                                     // 32
    args[args.length - 1] = function (err, obj) {                                                                  // 33
      after(obj && obj[0] && obj[0]._id || obj, err);                                                              // 34
      return callback.apply(this, arguments);                                                                      // 35
    };                                                                                                             // 36
    return _super.apply(self, args);                                                                               // 37
  } else {                                                                                                         // 38
    ret = _super.apply(self, args);                                                                                // 39
    return after(ret && ret[0] && ret[0]._id || ret);                                                              // 40
  }                                                                                                                // 41
});                                                                                                                // 42
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/matb33:collection-hooks/update.js                                                                      //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
CollectionHooks.defineAdvice("update", function (userId, _super, instance, aspects, getTransform, args) {          // 1
  var self = this;                                                                                                 // 2
  var ctx = {context: self, _super: _super, args: args};                                                           // 3
  var callback = _.last(args);                                                                                     // 4
  var async = _.isFunction(callback);                                                                              // 5
  var docs, docsIds, fields, abort, prev = {};                                                                     // 6
  var collection = _.has(self, "_collection") ? self._collection : self;                                           // 7
                                                                                                                   // 8
  // args[0] : selector                                                                                            // 9
  // args[1] : mutator                                                                                             // 10
  // args[2] : options (optional)                                                                                  // 11
  // args[3] : callback                                                                                            // 12
                                                                                                                   // 13
  if (_.isFunction(args[2])) {                                                                                     // 14
    callback = args[2];                                                                                            // 15
    args[2] = {};                                                                                                  // 16
  }                                                                                                                // 17
                                                                                                                   // 18
  if (aspects.before || aspects.after) {                                                                           // 19
    fields = getFields(args[1]);                                                                                   // 20
    docs = CollectionHooks.getDocs.call(self, collection, args[0], args[2]).fetch();                               // 21
    docIds = _.map(docs, function (doc) { return doc._id; });                                                      // 22
  }                                                                                                                // 23
                                                                                                                   // 24
  // copy originals for convenience for the "after" pointcut                                                       // 25
  if (aspects.after) {                                                                                             // 26
    if (_.some(aspects.after, function (o) { return o.options.fetchPrevious !== false; }) &&                       // 27
        CollectionHooks.extendOptions(instance.hookOptions, {}, "after", "update").fetchPrevious !== false) {      // 28
      prev.mutator = EJSON.clone(args[1]);                                                                         // 29
      prev.options = EJSON.clone(args[2]);                                                                         // 30
      prev.docs = {};                                                                                              // 31
      _.each(docs, function (doc) {                                                                                // 32
        prev.docs[doc._id] = EJSON.clone(doc);                                                                     // 33
      });                                                                                                          // 34
    }                                                                                                              // 35
  }                                                                                                                // 36
                                                                                                                   // 37
  // before                                                                                                        // 38
  _.each(aspects.before, function (o) {                                                                            // 39
    _.each(docs, function (doc) {                                                                                  // 40
      var r = o.aspect.call(_.extend({transform: getTransform(doc)}, ctx), userId, doc, fields, args[1], args[2]); // 41
      if (r === false) abort = true;                                                                               // 42
    });                                                                                                            // 43
  });                                                                                                              // 44
                                                                                                                   // 45
  if (abort) return false;                                                                                         // 46
                                                                                                                   // 47
  function after(affected, err) {                                                                                  // 48
    var fields = getFields(args[1]);                                                                               // 49
    var docs = CollectionHooks.getDocs.call(self, collection, {_id: {$in: docIds}}, args[2]).fetch();              // 50
                                                                                                                   // 51
    _.each(aspects.after, function (o) {                                                                           // 52
      _.each(docs, function (doc) {                                                                                // 53
        o.aspect.call(_.extend({                                                                                   // 54
          transform: getTransform(doc),                                                                            // 55
          previous: prev.docs && prev.docs[doc._id],                                                               // 56
          affected: affected,                                                                                      // 57
          err: err                                                                                                 // 58
        }, ctx), userId, doc, fields, prev.mutator, prev.options);                                                 // 59
      });                                                                                                          // 60
    });                                                                                                            // 61
  }                                                                                                                // 62
                                                                                                                   // 63
  if (async) {                                                                                                     // 64
    args[args.length - 1] = function (err, affected) {                                                             // 65
      after(affected, err);                                                                                        // 66
      return callback.apply(this, arguments);                                                                      // 67
    };                                                                                                             // 68
    return _super.apply(this, args);                                                                               // 69
  } else {                                                                                                         // 70
    var affected = _super.apply(self, args);                                                                       // 71
    after(affected);                                                                                               // 72
    return affected;                                                                                               // 73
  }                                                                                                                // 74
});                                                                                                                // 75
                                                                                                                   // 76
// This function contains a snippet of code pulled and modified from:                                              // 77
// ~/.meteor/packages/mongo-livedata/collection.js:632-668                                                         // 78
// It's contained in these utility functions to make updates easier for us in                                      // 79
// case this code changes.                                                                                         // 80
var getFields = function (mutator) {                                                                               // 81
  // compute modified fields                                                                                       // 82
  var fields = [];                                                                                                 // 83
  _.each(mutator, function (params, op) {                                                                          // 84
    _.each(_.keys(params), function (field) {                                                                      // 85
      // treat dotted fields as if they are replacing their                                                        // 86
      // top-level part                                                                                            // 87
      if (field.indexOf('.') !== -1)                                                                               // 88
        field = field.substring(0, field.indexOf('.'));                                                            // 89
                                                                                                                   // 90
      // record the field we are trying to change                                                                  // 91
      if (!_.contains(fields, field))                                                                              // 92
        fields.push(field);                                                                                        // 93
    });                                                                                                            // 94
  });                                                                                                              // 95
                                                                                                                   // 96
  return fields;                                                                                                   // 97
};                                                                                                                 // 98
                                                                                                                   // 99
// This function contains a snippet of code pulled and modified from:                                              // 100
// ~/.meteor/packages/mongo-livedata/collection.js                                                                 // 101
// It's contained in these utility functions to make updates easier for us in                                      // 102
// case this code changes.                                                                                         // 103
var getFields = function (mutator) {                                                                               // 104
  // compute modified fields                                                                                       // 105
  var fields = [];                                                                                                 // 106
                                                                                                                   // 107
  _.each(mutator, function (params, op) {                                                                          // 108
    //====ADDED START=======================                                                                       // 109
    if (_.contains(["$set", "$unset", "$inc", "$push", "$pull", "$pop", "$rename", "$pullAll", "$addToSet", "$bit"], op)) {
    //====ADDED END=========================                                                                       // 111
      _.each(_.keys(params), function (field) {                                                                    // 112
        // treat dotted fields as if they are replacing their                                                      // 113
        // top-level part                                                                                          // 114
        if (field.indexOf('.') !== -1)                                                                             // 115
          field = field.substring(0, field.indexOf('.'));                                                          // 116
                                                                                                                   // 117
        // record the field we are trying to change                                                                // 118
        if (!_.contains(fields, field))                                                                            // 119
          fields.push(field);                                                                                      // 120
      });                                                                                                          // 121
    //====ADDED START=======================                                                                       // 122
    } else {                                                                                                       // 123
      fields.push(op);                                                                                             // 124
    }                                                                                                              // 125
    //====ADDED END=========================                                                                       // 126
  });                                                                                                              // 127
                                                                                                                   // 128
  return fields;                                                                                                   // 129
};                                                                                                                 // 130
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/matb33:collection-hooks/remove.js                                                                      //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
CollectionHooks.defineAdvice("remove", function (userId, _super, instance, aspects, getTransform, args) {          // 1
  var self = this;                                                                                                 // 2
  var ctx = {context: self, _super: _super, args: args};                                                           // 3
  var callback = _.last(args);                                                                                     // 4
  var async = _.isFunction(callback);                                                                              // 5
  var docs, abort, prev = [];                                                                                      // 6
  var collection = _.has(self, "_collection") ? self._collection : self;                                           // 7
                                                                                                                   // 8
  // args[0] : selector                                                                                            // 9
  // args[1] : callback                                                                                            // 10
                                                                                                                   // 11
  if (aspects.before || aspects.after) {                                                                           // 12
    docs = CollectionHooks.getDocs.call(self, collection, args[0]).fetch();                                        // 13
  }                                                                                                                // 14
                                                                                                                   // 15
  // copy originals for convenience for the "after" pointcut                                                       // 16
  if (aspects.after) {                                                                                             // 17
    _.each(docs, function (doc) {                                                                                  // 18
      prev.push(EJSON.clone(doc));                                                                                 // 19
    });                                                                                                            // 20
  }                                                                                                                // 21
                                                                                                                   // 22
  // before                                                                                                        // 23
  _.each(aspects.before, function (o) {                                                                            // 24
    _.each(docs, function (doc) {                                                                                  // 25
      var r = o.aspect.call(_.extend({transform: getTransform(doc)}, ctx), userId, doc);                           // 26
      if (r === false) abort = true;                                                                               // 27
    });                                                                                                            // 28
  });                                                                                                              // 29
                                                                                                                   // 30
  if (abort) return false;                                                                                         // 31
                                                                                                                   // 32
  function after(err) {                                                                                            // 33
    _.each(aspects.after, function (o) {                                                                           // 34
      _.each(prev, function (doc) {                                                                                // 35
        o.aspect.call(_.extend({transform: getTransform(doc), err: err}, ctx), userId, doc);                       // 36
      });                                                                                                          // 37
    });                                                                                                            // 38
  }                                                                                                                // 39
                                                                                                                   // 40
  if (async) {                                                                                                     // 41
    args[args.length - 1] = function (err) {                                                                       // 42
      after(err);                                                                                                  // 43
      return callback.apply(this, arguments);                                                                      // 44
    };                                                                                                             // 45
    return _super.apply(self, args);                                                                               // 46
  } else {                                                                                                         // 47
    var result = _super.apply(self, args);                                                                         // 48
    after();                                                                                                       // 49
    return result;                                                                                                 // 50
  }                                                                                                                // 51
});                                                                                                                // 52
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/matb33:collection-hooks/find.js                                                                        //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
CollectionHooks.defineAdvice("find", function (userId, _super, instance, aspects, getTransform, args) {            // 1
  var self = this;                                                                                                 // 2
  var ctx = {context: self, _super: _super, args: args};                                                           // 3
  var ret, abort;                                                                                                  // 4
                                                                                                                   // 5
  // args[0] : selector                                                                                            // 6
  // args[1] : options                                                                                             // 7
                                                                                                                   // 8
  // before                                                                                                        // 9
  _.each(aspects.before, function (o) {                                                                            // 10
    var r = o.aspect.call(ctx, userId, args[0], args[1]);                                                          // 11
    if (r === false) abort = true;                                                                                 // 12
  });                                                                                                              // 13
                                                                                                                   // 14
  if (abort) return false;                                                                                         // 15
                                                                                                                   // 16
  function after(cursor) {                                                                                         // 17
    _.each(aspects.after, function (o) {                                                                           // 18
      o.aspect.call(ctx, userId, args[0], args[1], cursor);                                                        // 19
    });                                                                                                            // 20
  }                                                                                                                // 21
                                                                                                                   // 22
  ret = _super.apply(self, args);                                                                                  // 23
  after(ret);                                                                                                      // 24
                                                                                                                   // 25
  return ret;                                                                                                      // 26
});                                                                                                                // 27
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/matb33:collection-hooks/findone.js                                                                     //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
CollectionHooks.defineAdvice("findOne", function (userId, _super, instance, aspects, getTransform, args) {         // 1
  var self = this;                                                                                                 // 2
  var ctx = {context: self, _super: _super, args: args};                                                           // 3
  var ret, abort;                                                                                                  // 4
                                                                                                                   // 5
  // args[0] : selector                                                                                            // 6
  // args[1] : options                                                                                             // 7
                                                                                                                   // 8
  // before                                                                                                        // 9
  _.each(aspects.before, function (o) {                                                                            // 10
    var r = o.aspect.call(ctx, userId, args[0], args[1]);                                                          // 11
    if (r === false) abort = true;                                                                                 // 12
  });                                                                                                              // 13
                                                                                                                   // 14
  if (abort) return false;                                                                                         // 15
                                                                                                                   // 16
  function after(doc) {                                                                                            // 17
    _.each(aspects.after, function (o) {                                                                           // 18
      o.aspect.call(ctx, userId, args[0], args[1], doc);                                                           // 19
    });                                                                                                            // 20
  }                                                                                                                // 21
                                                                                                                   // 22
  ret = _super.apply(self, args);                                                                                  // 23
  after(ret);                                                                                                      // 24
                                                                                                                   // 25
  return ret;                                                                                                      // 26
});                                                                                                                // 27
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/matb33:collection-hooks/users-compat.js                                                                //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
if (Meteor.users) {                                                                                                // 1
  // If Meteor.users has been instantiated, attempt to re-assign its prototype:                                    // 2
  CollectionHooks.reassignPrototype(Meteor.users);                                                                 // 3
                                                                                                                   // 4
  // Next, give it the hook aspects:                                                                               // 5
  CollectionHooks.extendCollectionInstance(Meteor.users);                                                          // 6
}                                                                                                                  // 7
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['matb33:collection-hooks'] = {
  CollectionHooks: CollectionHooks
};

})();

//# sourceMappingURL=matb33:collection-hooks.js.map
