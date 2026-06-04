import "dotenv/config";
import express from "express";
import { prisma } from "@repo/db";
import {publishBuildJob, startLogStreamConsumer} from "@repo/kafka";
import {v4} from "uuid";
import {compare, hash} from "bcrypt";
import {generateAccessToken, generateRefreshToken} from "./utils.ts";
import authenticate from "./middlewares/auth.middleware.ts";

const app = express(); 

app.use(express.json());

app.post("/signup", async (req, res)=>{
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
app.post("/login", authenticate, async (req, res)=>{
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

})

app.post("/deploy", async (req, res)=>{
    const {repoUrl, branch, name} = req.body;
    const jobId = v4();
    let logs: string[] = []
    await publishBuildJob({jobId, name, repoUrl, branch});
    await startLogStreamConsumer(async (jobId, log)=>{
        // let logs: string[] = [];
        logs.push(log)
        console.log(logs);
    })
    res.send(`${[jobId, repoUrl, name, logs]} is deployed`)
});

// app.get("/deployments", (req, res)=>{

// })

// app.psot("/metrics", )
app.listen(8080);