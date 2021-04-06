const express = require('express')
const multer = require('multer')
const path = require('path');
const ejs = require('ejs');
const port = 3000
const app = express()

// set storage engine
const storageEngine = multer.diskStorage({
    destination: './public/upload/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }


})

// init upload
const upload = multer({
    storage: storageEngine,
    limits: { fileSize: 1000000 },
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb)
    }
}).single('Myimage')



// validate image
const checkFileType = (file, cb) => {
    // allowed file extention
    const fileType = /jpeg|jpg|png|gif/
    // check ext
    const extName = fileType.test(path.extname(file.originalname).toLowerCase());


    // check mimetype
    const mimetype = fileType.test(file.mimetype)
    if (mimetype && extName) {
        return cb(null, true)
    } else {
        return cb('Error: image only')
    }
}

app.use(express.static(path.join('./public')));
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('index')
})

// handle uplaod
app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.render('index', {
                msg: err
            })
        }
        else {
            if (req.file === undefined) {
                res.render('index', {
                    msg: 'Please Select an Image'
                })
            } else {
                res.render('index', {
                    msg: 'File Uploaded',
                    file: `/upload/${req.file.filename}`
                })
            }
        }
    })
})


app.listen(port, () => {
    console.log(`server is running port ${port}`);
})