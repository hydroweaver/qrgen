const express = require('express')
const mongoose = require('mongoose')
const multer = require('multer')
const path = require('path')
const router = express.Router();
const imagemodel = require('../imagemodel');
// var imageModel = mongoose.model('imageModel')

// const upload = multer({dest:"./menu_uploads/"})

var storage = multer.memoryStorage()
// var upload = multer({limits: {fileSize: 2000000 },dest:'/menu_uploads/'})
var upload = multer({ storage: storage })

router.post('/', upload.single('menu_image'), (req, res)=>{
  console.log("Uploading file...")
  const doc = new imagemodel({
    _id : 'image' + Date.now().toString(),
    img: {
      // data :  Buffer.from(req.file.buffer.toString('base64'), 'base64'),
      data :  req.file.buffer,
      ContentType : 'image/png'
    }
  });
  doc.save().then(()=>{
    res.send(doc._id);
  }).catch(err=>{
    res.send("Some DB Error")
    console.log(err)
  })
})

module.exports = router;