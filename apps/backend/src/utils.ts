import jwt from "jsonwebtoken";
import {QdrantClient} from "@qdrant/js-client-rest";
import embedding from "./deploy/deploy.ts"
import { OpenRouter } from "@openrouter/sdk";
import { v4 } from "uuid";

interface userPayload{
    id: number,
    username: string
    email: string,
}

const client = new QdrantClient({
    url: process.env.VECTOR_DB_CLUSTER_ENDPOINT!,
    apiKey: process.env.VECTOR_DB_API_KEY!
});

export function generateRefreshToken(user: userPayload){
    return jwt.sign(
        {
            id: user.id,
            username: user.username,
            email: user.email
        },
        process.env.JWT_REFRESH_SECRET!,
        {
            expiresIn: '10d'
        }
    )
}

export async function generateAccessToken(user: userPayload){
    return jwt.sign(
        {
            id: user.id,
            username: user.username,
            email: user.email,
        },
        process.env.JWT_ACCESS_SECRET!,
        {
            expiresIn: "6h"
        }
)
}




type ChunkOptions = {
    maxChars?: number;   
    overlapLines?: number; 
  };
  
  export function chunkBuildLogs(
    logLines: string[],
    options: ChunkOptions = {}
  ): string[] {
    const maxChars = options.maxChars ?? 1500;
    const overlapLines = options.overlapLines ?? 2;
  
    const lines = logLines
      .join("\n")
      .split("\n")
      .map((line) => line.trimEnd())
      .filter((line) => line.length > 0)
      .filter((line) => !isNoiseLine(line));
  
    if (lines.length === 0) return [];
  
    const chunks: string[] = [];
    let current: string[] = [];
    let currentLen = 0;
  
    for (const line of lines) {
      const lineLen = line.length + 1;
  
      if (lineLen > maxChars) {
        if (current.length > 0) {
          chunks.push(current.join("\n"));
          current = [];
          currentLen = 0;
        }
        for (let i = 0; i < line.length; i += maxChars) {
          chunks.push(line.slice(i, i + maxChars));
        }
        continue;
      }
  
      if (currentLen + lineLen > maxChars && current.length > 0) {
        chunks.push(current.join("\n"));
  
        current = current.slice(-overlapLines);
        currentLen = current.reduce((sum, l) => sum + l.length + 1, 0);
      }
  
      current.push(line);
      currentLen += lineLen;
    }
  
    if (current.length > 0) {
      chunks.push(current.join("\n"));
    }
  
    return chunks;
  }
  
  function isNoiseLine(line: string): boolean {
    return (
      // line.startsWith("npm warn") === false && false || 
      /^\s*$/.test(line) ||
      line.includes("\r") 
    );
  }
      
  export async function indexDeploymentLogs(
    // deployment_id: string,
    jobId: string,
    logs: string[]
  ){
    
    const chunks = chunkBuildLogs(logs)
    for (let i= 0; i < chunks.length; i++){
      const text = chunks[i];
      const response = await embedding(text!)
      console.log("utils", response)
      //@ts-ignore
      const vector = response.data[0].embedding; 
      console.log("utils vector", vector)
      try{
        const res = await client.upsert("deploymen_logs", {
            points: [
                {
                    id: v4(),
                    vector,
                    payload: {
                        jobId, 
                        chunkIndex: i,
                        totalChunks: chunks.length,
                        text,
                        type: "log"
                    }
                }
            ]
        })
        console.log("util res", res)
      }
      catch(error){
        console.log("util error", error)
      }

    }
  }

  export async function indexDeploymentLogsSummary(
    // deployment_id: string,
    jobId: string,
    logSummary: string
  ){

    if (!logSummary.trim) return;

        const response = await embedding(logSummary)
        // @ts-ignore
        const vector = response.data[0].embedding; 

        await client.upsert("deployment-summary", {
            points: [
                {
                    // id: `${deployment_id}`,
                    // id: `${jobId}`,
                    id: v4(),
                    vector,
                    payload: {
                        // deployment_id, 
                        jobId,
                        text: logSummary,
                        type: "summary"
                    }
                }
            ]
        })

        // console.log("from utils", point)

    }

//@ts-ignore
  export async function generateSummary(/*deployment_id,*/ logs){
    
    const openroter = new OpenRouter({
        apiKey: process.env.OPENROUTER_API_KEY
    })
    const logText = Array.isArray(logs) ? logs.join("\n") : logs;
    const response = await openroter.chat.send({
      chatRequest:{
        model: "openai/gpt-oss-120b:free",
        messages: [
            {
                role: "system",
                content: "Summarize this deployment build logs in 4-5 sentences. Focus on outcome, errors and key steps. Be concise."
            },
            {
                role: "user",
                content: logText
            }
        ],
        stream: false
      }
    })
    return response.choices[0]?.message.content
  }