import express from "express"
import cors from "cors"
import 'dotenv/config'
import cookieParser from "cookie-parser"
import connectDB  from "./config/mongodb.js"
import authRouter from './routes/authRoutes.js'
import userRouter from "./routes/userRoutes.js"


const app = express();
const port = process.env.PORT || 4000
connectDB()


app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: ["https://mern-auth-orcin.vercel.app","http://localhost:5173"],
  credentials: true
}));

// api endpoints
app.get('/',(req,res)=>{
    return res.send('api working fine')
})
app.use('/api/auth',authRouter)
app.use('/api/user',userRouter)

app.listen(port, ()=> console.log(`server started on PORT:${port}`))