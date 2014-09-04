(function(){__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
if (Meteor.isServer) {
  Meteor.methods({
    uploadPic: function(pic) {
      var buffer, f, newName, origImage, s3;
      s3 = new AWS.S3();
      buffer = new Buffer(pic.data, 'binary');
      newName = (function() {
        var extention, randomName;
        extention = _.last(pic.name.split('.'));
        randomName = Random.id();
        return randomName + '.' + extention;
      })();
      origImage = {
        Key: 'user_media/' + newName,
        ContentType: pic.type,
        Body: buffer,
        Bucket: 'microcosm'
      };
      f = new Future();
      s3.putObject(origImage, function(err, data) {
        if (err) {
          console.log(err);
          return f["return"](false);
        } else {
          console.log('object ' + pic.name + ' with new name ' + newName + ' uploaded to S3! Congrats!');
          return f["return"](newName);
        }
      });
      return f.wait();
    },
    uploadWithThumb: function(pics) {
      var f, newName, origBuffer, origImage, resizedBuffer, resizedImage, s3;
      s3 = new AWS.S3();
      origBuffer = new Buffer(pics[0].data, 'binary');
      resizedBuffer = new Buffer(pics[1].data, 'binary');
      newName = (function() {
        var extention, randomName;
        extention = _.last(pics[0].fileInfo.name.split('.'));
        randomName = Random.id();
        return {
          orig: randomName + '.' + extention,
          thumb: randomName + '_thumb.' + extention
        };
      })();
      origImage = {
        Key: newName.orig,
        ContentType: pics[0].fileInfo.type,
        Body: origBuffer,
        Bucket: 'microcosm'
      };
      resizedImage = {
        Key: newName.thumb,
        ContentType: pics[0].fileInfo.type,
        Body: resizedBuffer,
        Bucket: 'microcosm'
      };
      f = new Future();
      s3.putObject(origImage, function(err, data) {
        if (err) {
          console.log(err);
          return f["return"](false);
        } else {
          console.log('object ' + pics[0].fileInfo.name + 'named ' + newName.orig + ' uploaded to S3! Congrats!');
          return f["return"](true);
        }
      });
      f.wait();
      f = new Future();
      s3.putObject(resizedImage, function(err, data) {
        if (err) {
          console.log(err);
          return f["return"](false);
        } else {
          console.log('object ' + pics[1].fileInfo.name + ' thumb named' + newName.thumb + 'uploaded to S3');
          return f["return"](true);
        }
      });
      f.wait();
      return newName.orig;
    },
    deletePic: function(pic) {
      var f, params, s3;
      s3 = new AWS.S3();
      params = {
        Bucket: 'microcosm',
        Key: 'user_media/' + pic
      };
      f = new Future();
      s3.deleteObject(params, function(err, data) {
        if (err) {
          console.log(err, err.stack);
          return f["return"](false);
        } else {
          console.log('object ' + pic + ' deleted from S3');
          return f["return"](true);
        }
      });
      return f.wait();
    },
    deletePics: function(pics) {
      var f, params, s3;
      if (pics.length > 0) {
        s3 = new AWS.S3();
        params = {
          Bucket: 'microcosm',
          Delete: {
            Objects: []
          }
        };
        pics.forEach(function(pic) {
          var obj;
          obj = {};
          obj['Key'] = pic;
          return params.Delete.Objects.push(obj);
        });
        f = new Future();
        s3.deleteObjects(params, function(err, data) {
          if (err) {
            console.log(err, err.stack);
            return f["return"](false);
          } else {
            console.log('object ' + pics + ' deleted from S3');
            return f["return"](true);
          }
        });
        return f.wait();
      } else {
        console.log('no pics to delete');
        return true;
      }
    }
  });
}

if (Meteor.isClient) {
  this.Media = {
    uploadPic: function(e, pic, file, callback) {
      return Meteor.call('uploadPic', pic, function(err, res) {
        if (err) {
          MainCtrl.hideLoader();
          return MainCtrl.notify('Ошибка сервера, пожалуйста попробуйте позже!', 'error');
        } else {
          if (res) {
            return callback(res);
          } else {
            MainCtrl.hideLoader();
            return MainCtrl.notify('Ошибка сервера, пожалуйста попробуйте позже!', 'error');
          }
        }
      });
    },
    updatePic: function(e, pic, file, currentPic, callback) {
      return Meteor.call('deletePic', currentPic, function(err, res) {
        if (err) {
          return MainCtrl.notify('Ошибка сервера, пожалуйста попробуйте позже!', 'error');
        } else {
          if (res) {
            return Media.uploadPic(e, pic, file, callback);
          } else {
            return MainCtrl.notify('Ошибка сервера, пожалуйста попробуйте позже!', 'error');
          }
        }
      });
    },
    resizeAndUpload: function(id, file, width, height) {
      var deferred, originalFile, pic, resize, resizedPic;
      log('triggered upload with resize');
      pic = {};
      resizedPic = {};
      deferred = $.Deferred();
      resize = function() {
        var reader;
        reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onLoad = function(e) {
          return $.canvasResize(file, {
            width: width,
            height: height,
            crop: false,
            quality: 80,
            callback: function(data) {
              deferred.resolve(data);
              return console.log({
                data: data
              });
            }
          });
        };
        return deferred.promise();
      };
      originalFile = function() {
        var reader;
        reader = new FileReader();
        deferred = $.Deferred();
        reader.readAsBinaryString(file);
        reader.onload = function(e) {
          var ifile;
          ifile = reader.result;
          deferred.resolve(ifile);
          return console.log({
            reader: ifile
          });
        };
        return deferred.promise();
      };
      return $.when(originalFile(), resize()).done((function(_this) {
        return function(ifile, resizedFile) {
          console.log('resolved');
          pic['fileInfo'] = file;
          pic['data'] = ifile;
          resizedPic['fileInfo'] = file;
          resizedPic['data'] = resizedFile;
          console.log(pic);
          console.log(resizedPic);
          return Meteor.call('uploadWithThumb', [pic, resizedPic], function(err, res) {
            if (err) {
              return MainCtrl.notify('Ошибка сервера, пожалуйста попробуйте позже!', 'error');
            } else {
              if (res) {
                console.log(res);
                return Gallery.update(id, {
                  $push: {
                    'images': res
                  }
                }, function() {
                  MainCtrl.notify('Изображение ' + res + ' добавлено!', 'success');
                  return MainCtrl.hideLoader();
                });
              } else {
                return MainCtrl.notify('Ошибка сервера, пожалуйста попробуйте позже!', 'error');
              }
            }
          });
        };
      })(this));
    },
    deletePic: function(pic) {
      return Meteor.call('deletePic', pic, function(err, res) {
        if (err) {
          return MainCtrl.notify('Ошибка сервера, пожалуйста попробуйте позже!', 'error');
        } else {
          if (res) {
            return MainCtrl.notify('Изображение успешно удалено!', 'success');
          } else {
            return MainCtrl.notify('Ошибка сервера, пожалуйста попробуйте позже!', 'error');
          }
        }
      });
    },
    deletePics: function(pics) {
      return Meteor.call('deletePics', pics, function(err, res) {
        if (err) {
          return MainCtrl.notify('Ошибка сервера, пожалуйста попробуйте позже!', 'error');
        } else {
          if (res) {
            return MainCtrl.notify('Изображения успешно удалено!', 'success');
          } else {
            return MainCtrl.notify('Ошибка сервера, пожалуйста попробуйте позже!', 'error');
          }
        }
      });
    }
  };
}

})();

//# sourceMappingURL=s3.coffee.js.map
