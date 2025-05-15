import express from "express"
import serverless from "serverless-http"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import helmet from "helmet"
import ExpressMongoSanitize from "express-mongo-sanitize"
import { v2 as cloudinary } from 'cloudinary'
import cors from 'cors'

import authRouter from './routes/authRouter.js'
import productRouter from './routes/productRouter.js'
import lapanganRouter from './routes/lapanganRouter.js'
import orderRouter from './routes/orderRouter.js'
import jadwalRouter from './routes/jadwalRouter.js'
import pemesananRouter from './routes/pemesananRouter.js'
import transaksiRouter from './routes/transaksiRouter.js'
import mabarRouter from './routes/mabarRouter.js'
import eventRouter from './routes/eventRouter.js'
import ratingRouter from './routes/ratingRouter.js'
import { notFound, errorHandler } from "./middleware/errorMiddleware.js"
import mongoose from "mongoose"

dotenv.config()

const app = express()

// Konfigurasi CORS
const corsOptions = {
  origin: ['http://127.0.0.1:8000', 'http://localhost:8000'],
  credentials: true,
}
app.use(cors(corsOptions))

cloudinary.config({
  cloud_name: "de9cyaoqo",
  api_key: 193388313656343,
  api_secret: "qYF6EPlE381NVDneflc7AxHOtmk"
})

// Middleware
app.use(helmet())
app.use(ExpressMongoSanitize())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static('./public'))

// Routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/product', productRouter)
app.use('/api/v1/lapangan', lapanganRouter)
app.use('/api/v1/order', orderRouter)
app.use('/api/v1/jadwal', jadwalRouter)
app.use('/api/v1/pemesanan', pemesananRouter)
app.use('/api/v1/transaksi', transaksiRouter)
app.use('/api/v1/event', eventRouter)
app.use('/api/v1/mabar', mabarRouter)
app.use('/api/v1/rating', ratingRouter)

// Error Handling
app.use(notFound)
app.use(errorHandler)

// Database
const uri = process.env.DATABASE
async function connectToDatabase() {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log("Connected to MongoDB Atlas!")
  } catch (error) {
    console.error("MongoDB connection error:", error)
    process.exit(1)
  }
}

connectToDatabase()

// Export handler for Vercel
export default serverless(app)
