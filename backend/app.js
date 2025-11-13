import express from "express";
import {config} from "dotenv";
import cookieParser from 'cookie-parser';
import fileUpload from "express-fileupload"

import cors from "cors";
import {connection} from "./databse/connection.js"
import { errorMiddleware } from "./middlewares/error.js";
import userRouter from "./routes/userRouter.js";
import jobRouter from "./routes/jobRouter.js";
import applcationRouter from "./routes/applicationRouter.js";
import { newsLetterCron } from "./automation/newLetterCron.js";



const app = express();
config({path:"./config/.env"});

app.use(cors({
    origin:[process.env.FRONTEND_URL],
    methods:["GET", "POST","PUT","DELETE"],
    credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
}));

app.use("/api/v1/user", userRouter);
app.use("/api/v1/job", jobRouter);
app.use("/api/v1/application", applcationRouter);
app.use("/api/v1/job", jobRouter);

newsLetterCron()

app.get('/', (req,res)=>{
    res.status(200).json({
        message: 'Server is running successfully'
    })
})

connection();
app.use(errorMiddleware)
export default app;