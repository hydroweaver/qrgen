const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
const fs = require('fs')
const db = mongoose.connection

app = express()
app.use(cors())

mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true, useUnifiedTopology: true})
db.on('error', console.error.bind(console, 'connection error:'))
const testSchema = new mongoose.Schema({
  name: String
})
const testModel = mongoose.model('testModel', testSchema)
db.once('open', ()=>{
  console.log('Connection to DB Successful')
})

app.get('/', (req, res)=>{
  res.send("Welcome!")
})

app.get('/:menuID', (req, res)=>{
  var searchQuery = req.params.menuID
  testModel.find({name:searchQuery.toString()}, (err, results)=>{
    if(err){
      console.log(err)
    }
    else if(results.length == 0){
      res.send("No Matching Values")
    }
    else{
      res.send(results)
    }
  })
})

app.post('/', (req, res)=>{
  console.log("here")
  var rand = Math.round(Math.random()*10000000)
  const doc = new testModel({name: rand.toString()})
  doc.save().then(()=>{
    res.send(rand + " Saved to DB")
  }).catch(err=>{
    res.send("Some DB Error")
    console.log(err)
  })
})

app.listen(3000, ()=>{
  console.log("Server Running at 3000")
})