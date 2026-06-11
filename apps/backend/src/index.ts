import "dotenv/config";
import express from "express";
import { prisma } from "@repo/db";
import {publishBuildJob, startAiConsumer, startDBLogConsumer, startLogStreamConsumer} from "@repo/kafka";
import {v4} from "uuid";
import {compare, hash} from "bcrypt";
import {generateAccessToken, generateRefreshToken, chunkBuildLogs, generateSummary, indexDeploymentLogsSummary} from "./utils.ts";
import {authenticate,  AuthReq} from "./middlewares/auth.middleware.ts";
import { userInfo } from "os";
import cors from "cors";
import cookieParser from "cookie-parser"
import test from "./deploy/deploy.ts";
import {indexDeploymentLogs}  from "./utils.ts"
import { FormatJsonObjectConfig$outboundSchema } from "@openrouter/sdk/models";


const app = express(); 
app.use(cookieParser());
app.use(cors({
    origin: "http://runtime-frontend-lb-305484414.ap-southeast-2.elb.amazonaws.com",
    credentials: true
}))

app.use(express.json());

// startLogStreamConsumer(async (jobId, log)=>{

// })

startAiConsumer(async (jobId, logs)=>{
    const logText = Array.isArray(logs) ? logs.join("\n") : logs;
    const deployment = await prisma.deployment.update({
        where: {id: Number(jobId)},
        data: {logs: logText}
    })
    const response = await indexDeploymentLogs(jobId, logs,)
    
    const summary = await generateSummary(logs)
    await indexDeploymentLogsSummary(jobId, summary)
    await prisma.deployment.update({
        where: {id: Number(jobId)},
        data: {summary: summary}
    })
})

// startDBLogConsumer(async (jobId, logs)=>{
    
//     })

app.post("/signup", async (req, res)=>{
    console.log("reached")
    try {
        const {username, email, password} = req.body;
        const hashPassword = await hash(password, 10)
        
        const user = await prisma.user.create({
            data:{
                username,
                email,
                password:hashPassword
            }
        });
        const refreshToken = generateRefreshToken(user)
        const accessToken = generateAccessToken(user)
        await prisma.user.update({
            where: {id: user.id},
            data: {refreshToken: refreshToken}
        })
        res.cookie("refreshToken", refreshToken, {httpOnly: true, secure: true, sameSite: "strict", maxAge: 10 * 24 * 60 * 60 * 1000})
        res.status(200).json({accessToken})
        }
        catch(error){
            console.log(error);
            res.status(500).json("User Signup not done")
        }
});
//@ts-ignore
app.post("/login", async (req, res)=>{
    try{
    const {email, password} = req.body;
    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    })
    if (!user){
        return res.status(401).json("User not found")
    }

    const isPasswordValid = await compare(password, user.password)
    if (!isPasswordValid){
        return res.status(401).json("Password incorrect")
    }

    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)
    res.cookie("refreshToken", refreshToken, {httpOnly: true, secure: true, sameSite: "strict", maxAge: 10 * 24 * 60 * 60 * 1000})
    res.status(200).json({accessToken})
    }
    catch(error){
        res.status(500).json(`Error ${error}`)
    }
});
//@ts-ignore
app.post("/logout", authenticate, async(req, res)=>{
    try{
        const {user} = req as AuthReq;
        await prisma.user.update({
       where: {id: user.id},
       data: {refreshToken: null} 
    })
      res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict"
    });
    res.status(200).json("User logged out successfully")
    }
    catch(error){
        return res.status(500).json("User not logged out successfully")
    }
})
//@ts-ignore
app.post("/deploy", authenticate, async (req, res)=>{
    const {user} = req as AuthReq;
    const {repoUrl, branch, name} = req.body;
    try{
    const job = await prisma.project.create({
        //@ts-ignore
        data:  {
            userId: user.id,
            repoUrl: repoUrl,
            name: name
        }
    })    

    const deployment = await prisma.deployment.create({
        data: {
            projectId: job.id,
            deploymentUrl: "",
            status: "queued",
            logs: "",
            summary: "",
            //@ts-ignore
            commitHash: "",
            branch: branch
        }
    })
    await publishBuildJob({
        jobId: String(deployment.id), 
        name: name, 
        repoUrl: repoUrl,
        branch
    });

    res.status(200).send(`${name} is queued for deployment!`)
    }
    catch(error){
        res.status(501).json(`Error queuing your project ${name} with error - ${error}`)
    }
});

app.post("/deployments", async (req, res)=>{
    const response = await test("this is for testing")
    // console.log(JSON.stringify(response, null, 2));
    res.json(response)
    //@ts-ignore
    // console.log(response.data[0].embedding.length)
})

// app.psot("/metrics", )
app.listen(8080);