const mongoose = require('mongoose')
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
const imagemodel = mongoose.model('imagemodel', imageSchema)
db.once('open', ()=>{
  console.log('Connection to DB Successful')
})

module.exports = mongoose.model('imagemodel', imageSchema)