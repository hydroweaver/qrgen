const express = require('express');
const cors = require('cors');
const qrcode = require('qrcode');
const fs = require('fs');
const multer = require('multer');
const upload = multer({dest:"./menu_uploads/"});
const path = require('path');
const { deepStrictEqual } = require('assert');
const { callbackify } = require('util');

const handleError = (err, res) => {
    res
      .status(500)
      .contentType("text/plain")
      .end("Oops! Something went wrong!");
  };

app = express();
app.use(cors());
//app.use(express.static(__dirname + '\\menu_uploads'));

app.get('/', (req, res)=>{
    //dat only refers to fulfilled
    qrcode.toDataURL("https://stackoverflow.com/questions/24071390/horizontally-centering-an-images-in-an-iframe-within-a-div").then((dat)=>{
        res.send(dat);
    }).catch(err=>{
        res.send("Error" + err);
    });
});

app.get('/menu_uploads/:image_name', (req, res)=>{
    console.log(image_name);
    res.sendFile(__dirname + '\\menu_uploads\\xyz_jpeg.jpeg');
});

after_upload = (req, res)=>{
    // var qrgen = document.getElementById("menu");
    // qrgen.src = "./menu_uploads/xyz.png"
    console.log('Inside Next')
    //res.send("Complete");
    res.set('Content-Type', 'text/html')
    res.send('<img src="' +'./menu_uploads/' +'xyz_jpeg.jpeg"></img>');
    //preview image

    //create static page with image

    //save static page

    //generate QR code based on static page
}

app.post('/upload', upload.single('menu_image'), after_upload ,function (req, res, next) {
    // console.log(req.file);
    var uploaded_menu_folder = req.file.destination;
    var uploaded_scrambled_filename = req.file.filename; 
    var uploaded_menu_filename = req.file.originalname;
    var src = path.join(__dirname, uploaded_menu_folder, uploaded_scrambled_filename);
    var dest = path.join(__dirname, uploaded_menu_folder, uploaded_menu_filename);
    var src_stream = fs.createReadStream(src);
    var dest_stream = fs.createWriteStream(dest);
    src_stream.pipe(dest_stream);
    // src.on('end', function() { res.render('complete'); });
    // src.on('error', function(err) { res.render('error'); });
    next();
});

app.listen(3000, ()=>{
    console.log('Running on local at 3000');
});