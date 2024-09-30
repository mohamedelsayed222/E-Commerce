import express  from "express";
import dotenv from 'dotenv'
import bootstrap  from "./src/index.routes.js";
dotenv.config()
const app =express()
const port =process.env.PORT


bootstrap(app,express)
app.listen(port,()=>{
    console.log(`App Running on port ${port}`);
})
