import "dotenv/config";
import express from "express";
import { prisma } from "@repo/db";
import {publishBuildJob} from "@repo/kafka";
import {v4} from "uuid";

const app = express(); 

app.use(express.json());

app.post("/signup", async (req, res)=>{
    try {
        const {username, email, password} = req.body;
    await prisma.user.create({
        data:{
            username,
            email,
            password
        }
    })
    res.send("User Signed Up")
    }
    catch(error){
        console.log(error);
        res.json("User Signup not done")
    }
});

// app.post("/login", (req, res)=>{
//     req.body = 
// })

app.post("/deploy", async (req, res)=>{
    const {repoUrl, branch, name} = req.body;
    const jobId = v4();
    
    await publishBuildJob({jobId, name, repoUrl, branch});
    res.send(`${[jobId, repoUrl, name]} is deployed`)
});

// app.get("/deployments", (req, res)=>{

// })

// app.psot("/metrics", )
app.listen(8080);