const express = require("express");
const router = express.Router();
const mongoose = require('mongoose')
const path = require('path')
const db = mongoose.connection

mongoose.connect('mongodb://localhost/images', {useNewUrlParser: true, useUnifiedTopology: true})
db.on('error', console.error.bind(console, 'connection error:'))
const imageSchema = new mongoose.Schema({
  _id: String,
  img : {
    data: Buffer,
    ContentType : String
  }
})
const imageModel = mongoose.model('imageModel', imageSchema)
db.once('open', ()=>{
  console.log('Connection to DB Successful')
})

router.get('/:menuid', (req, res, next)=>{
  let fileid = req.params.menuid;
  console.log(fileid);
  imageModel.findOne({'_id': fileid}, (err, result)=>{
    if(err){
      next(err)
    }
    //the above is not a get error, its a db not found, error, so needs to vbe resolved differently
    else{
      if(result==null){
        console.log(__dirname);
        res.sendFile(path.join(__dirname, '/static_paths/404.html'));
      }
      else{
        res.setHeader('content-type', 'image/png');
        res.send(result.img.data);
      }
    }

    function handle_error(err){
      console.log(err);
      res.sendStatus(400);
      res.send('Uh-Oh! Looks like this image is not available.')
    }
  })
})

module.exports = router;