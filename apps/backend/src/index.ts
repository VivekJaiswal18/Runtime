import "dotenv/config";
import express from "express";
import { prisma } from "@repo/db";

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
    const {url, name} = req.body;

    res.send(`${name} is deployed`)
})

app.listen(8080);