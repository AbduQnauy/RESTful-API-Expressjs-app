const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const multer = require('multer')
const feedRoutes = require('./routes/feed')
const authRoutes = require('./routes/auth')

const app = express()
// //////////////////Storage Engine Setup////////////////////////
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images')
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${new Date().toISOString().replace(/^202|[-:TZ]/g, '')}${
        file.originalname
      }`
    )
  },
})

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}
app.use(express.json())

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
)

app.use('/images', express.static(path.join(__dirname, 'images')))
// CORS set headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  next()
})

app.use('/feed', feedRoutes)
app.use('/auth', authRoutes)

app.use((error, req, res, next) => {
  console.log(error)
  res
    .status(error.statusCode || 500)
    .json({ message: error.message, data: error.data })
})

mongoose
  .connect(
    'mongodb://127.0.0.1:27017/messages?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.10.1'
  )
  .then((result) => {
    console.log('Connected')
    const server = app.listen(8080)
    const io = require('./socket').init(server)
    io.on('connection', (socket) => {
      console.log('Clinet Connected')
    })
  })
  .catch((err) => console.error(err))
