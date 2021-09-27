const express = require('express')
const mongoose = require('mongoose')
const multer = require('multer')
const path = require('path')
// const upload = multer({dest:"./menu_uploads/"})
const db = mongoose.connection

var storage = multer.memoryStorage()
// var upload = multer({limits: {fileSize: 2000000 },dest:'/menu_uploads/'})
var upload = multer({ storage: storage })

app = express()
// app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.use(express.static('static_paths'))

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

app.get('/', (req, res)=>{
  res.send("Welcome!")
})

//https://newbedev.com/express-js-prevent-get-favicon-ico
// Didn't use express favicon
app.get('/favicon.ico', function(req, res) { 
  res.sendStatus(204);
});

//USE FORM DATA IN POSTMAN TO UPLOAD!
app.post('/uploadpicture', upload.single('menu_image'), (req, res)=>{
  console.log("Uploading file...")
  console.log(req);
  const doc = new imageModel({
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

//https://steemit.com/utopian-io/@morningtundra/storing-and-retreiving-images-in-mongodb-with-nodejs
//helped to understand this, but the main problem was /favicon.ico which was getting called
//everytime and terminating the server
app.get('/:menuid', (req, res, next)=>{
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



app.listen(3000, ()=>{
  console.log("Server Running at 3000")
})


//image preview - see the https://stackoverflow.com/questions/33279153/rest-api-file-ie-images-processing-best-practices
//flow for preview, not 2 uploads, only 1
//add dates & access counter
//merge qr generation with db save