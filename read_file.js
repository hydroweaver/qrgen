const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')
const multer = require('multer')
const db = mongoose.connection

mongoose.connect('mongodb://localhost/xyz', {useNewUrlParser: true, useUnifiedTopology: true})
db.on('error', console.error.bind(console, 'connection error:'))
const imageSchema = new mongoose.Schema({
  image: Buffer,
  ContentType : String
})
const imageModel = mongoose.model('imageModel', imageSchema)
db.once('open', ()=>{
  console.log('Connection to DB Successful')
})


imageModel.find({_id:'60e345d17536e1364851bcc8'}, (err, results)=>{
    if(err){
      console.log(err)
    }
    else if(results.length == 0){
      res.send("No Matching Values")
    }
    else{
      console.log(results);
    }
  })



