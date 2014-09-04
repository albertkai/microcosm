if Meteor.isServer

  Meteor.methods {

    uploadPic: (pic)->

      s3 = new AWS.S3()

      buffer = new Buffer(pic.data, 'binary')

      newName = do ->
        extention = _.last pic.name.split('.')
        randomName = Random.id()
        randomName + '.' + extention

      origImage =  {
        Key: 'user_media/' + newName
        ContentType: pic.type
        Body: buffer
        Bucket: 'microcosm'
      }

      f = new Future()

      s3.putObject origImage, (err, data)->
        if err
          console.log err
          f.return(false)
        else
          console.log 'object ' + pic.name + ' with new name ' + newName + ' uploaded to S3! Congrats!'
          f.return(newName)

      f.wait()

    uploadWithThumb: (pics)->

      s3 = new AWS.S3()

      origBuffer = new Buffer(pics[0].data, 'binary')

      resizedBuffer = new Buffer(pics[1].data, 'binary')

      newName = do ->
        extention = _.last pics[0].fileInfo.name.split('.')
        randomName = Random.id()
        {
        orig: randomName + '.' + extention
        thumb: randomName + '_thumb.' + extention
        }


      origImage =  {
        Key: newName.orig
        ContentType: pics[0].fileInfo.type
        Body: origBuffer
        Bucket: 'microcosm'
      }

      resizedImage =  {
        Key: newName.thumb
        ContentType: pics[0].fileInfo.type
        Body: resizedBuffer
        Bucket: 'microcosm'
      }

      f = new Future()

      s3.putObject origImage, (err, data)->
        if err
          console.log err
          f.return(false)
        else
          console.log 'object ' + pics[0].fileInfo.name + 'named ' + newName.orig + ' uploaded to S3! Congrats!'
          f.return(true)

      f.wait()

      f = new Future()

      s3.putObject resizedImage, (err, data)->
        if err
          console.log err
          f.return(false)
        else
          console.log 'object ' + pics[1].fileInfo.name + ' thumb named' + newName.thumb + 'uploaded to S3'
          f.return(true)

      f.wait()

      newName.orig

    deletePic: (pic)->

      s3 = new AWS.S3()

      params = {
        Bucket: 'microcosm'
        Key: 'user_media/' + pic
      }

      f = new Future()

      s3.deleteObject params, (err, data)->
        if (err)
          console.log(err, err.stack)
          f.return(false)
        else
          console.log('object ' + pic + ' deleted from S3')
          f.return(true)

      f.wait()


    deletePics: (pics)->

      if pics.length > 0

        s3 = new AWS.S3()

        params = {
          Bucket: 'microcosm',
          Delete: {
            Objects: []
          }
        }

        pics.forEach (pic)->
          obj = {}
          obj['Key'] = pic
          params.Delete.Objects.push obj

        f = new Future()

        s3.deleteObjects params, (err, data)->
          if (err)
            console.log(err, err.stack)
            f.return(false)
          else
            console.log('object ' + pics + ' deleted from S3')
            f.return(true)

        f.wait()

      else

        console.log 'no pics to delete'

        true

  }

if Meteor.isClient

  @Media = {

    uploadPic: (e, pic, file, callback)->

      Meteor.call 'uploadPic', pic, (err, res)->
        if err
          MainCtrl.hideLoader()
          MainCtrl.notify('Ошибка сервера, пожалуйста попробуйте позже!', 'error')
        else
          if res
            callback(res)
          else
            MainCtrl.hideLoader()
            MainCtrl.notify('Ошибка сервера, пожалуйста попробуйте позже!', 'error')

    updatePic: (e, pic, file, currentPic, callback)->

      Meteor.call 'deletePic', currentPic, (err, res)->

        if err

          MainCtrl.notify('Ошибка сервера, пожалуйста попробуйте позже!', 'error')

        else

          if res

            Media.uploadPic(e, pic, file, callback)

          else

            MainCtrl.notify('Ошибка сервера, пожалуйста попробуйте позже!', 'error')

    resizeAndUpload: (id, file, width, height)->

      log 'triggered upload with resize'

      pic = {}
      resizedPic = {}

      deferred = $.Deferred()

      resize = ()->
        reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onLoad = (e)->
          $.canvasResize(file, {
            width: width,
            height: height,
            crop: false,
            quality: 80,
            callback: (data)->
              deferred.resolve(data)
              console.log {data: data}
          })
        deferred.promise()


      originalFile = ()->
        reader = new FileReader()
        deferred = $.Deferred()
        reader.readAsBinaryString(file)
        reader.onload = (e)->
          ifile = reader.result
          deferred.resolve(ifile)
          console.log {reader: ifile}
        deferred.promise()



      $.when(originalFile(), resize()).done (ifile, resizedFile)=>
        console.log 'resolved'
        pic['fileInfo'] = file
        pic['data'] = ifile
        resizedPic['fileInfo'] = file
        resizedPic['data'] = resizedFile
        console.log pic
        console.log resizedPic
        Meteor.call 'uploadWithThumb', [pic, resizedPic], (err, res)->
          if err

            MainCtrl.notify('Ошибка сервера, пожалуйста попробуйте позже!', 'error')

          else

            if res

              console.log res

              Gallery.update id, {$push: {'images': res}}, ->

                MainCtrl.notify 'Изображение ' + res + ' добавлено!', 'success'

                MainCtrl.hideLoader()

            else

              MainCtrl.notify('Ошибка сервера, пожалуйста попробуйте позже!', 'error')

    deletePic: (pic)->

      Meteor.call 'deletePic', pic, (err, res)->

        if err

          MainCtrl.notify('Ошибка сервера, пожалуйста попробуйте позже!', 'error')

        else

          if res

            MainCtrl.notify 'Изображение успешно удалено!', 'success'

          else

            MainCtrl.notify('Ошибка сервера, пожалуйста попробуйте позже!', 'error')

    deletePics: (pics)->

      Meteor.call 'deletePics', pics, (err, res)->

        if err

          MainCtrl.notify('Ошибка сервера, пожалуйста попробуйте позже!', 'error')

        else

          if res

            MainCtrl.notify 'Изображения успешно удалено!', 'success'

          else

            MainCtrl.notify('Ошибка сервера, пожалуйста попробуйте позже!', 'error')

  }