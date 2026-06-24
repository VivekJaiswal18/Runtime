import { exec } from "node:child_process"; 
import { publishBuildLog } from "@repo/kafka";
import { readdir } from "node:fs/promises";
import { promisify } from "node:util";
import { reduceEachLeadingCommentRange } from "typescript";
// const repoDir = "cd home/app/output";
// const repoDir = "cwd cd home/app/output && npm install && npm run build";

const jobId = process.env.JOB_ID!;

const repo = "cd /home/app/output && npm install && npm run build";
if(!process.env.PRESIGNED_URL){
    throw new Error("Missing Presigned upload URL!")
}
const uploadZip = `cd /home/app/output && zip -r dist.zip dist && curl --upload-file dist.zip "${process.env.PRESIGNED_URL}"`
const execAsync = promisify(exec)

await publishBuildLog({
    jobId: jobId,
    log: "Build Started",
    type: "log"
})
const build = exec(repo);

build.stdout?.on('data', async (data)=>{
    try{
    await publishBuildLog({
        jobId: jobId,
        log: data.toString(),
        type: "log"
    })
    }
    catch(error){
        console.log("Kafka log publish failed", error)
    }
});

build.stderr?.on('data', async (data)=>{
    try{
    await publishBuildLog({
        jobId: jobId,
        log: data.toString(),
        type: "log"
    })
    }
    catch(error){
        console.log("Kafka log publish failed", error)
    }
})

build.on('close', async(code)=>{
    try{
        if(code !== 0){
            await publishBuildLog({
                jobId,
                log:`Error during build with exit code: ${code}`,
                type:"error"
            });
            return;
        }

        await publishBuildLog({
            jobId,
            log:"Build Complete",
            type:"done"
        });
        // const localDir = "home/app/output/dist"
        // await upoadDist(localDir, jobId)
        exec("ls /home/app/output/dist", (err, stdout, stderr)=>{
            if(err){
                console.log("Error in runner", err)
            }
        console.log(stdout)
        })
        await execAsync(uploadZip)
        exec("ls /home/app/output/dist.zip", (err, stdout, stderr)=>{
            if(err){
                console.log("Error in runner zip", err)
            }
        console.log(stdout)
        })
    }
    finally{
        setTimeout(()=>{
            process.exit(code ?? 0)
        },1000)
    }
});

build.on("error", async(error) =>{
    await publishBuildLog({
        jobId: jobId,
        log: `Error: ${error.message}`,
        type: "error"
    })
    process.exit(1)
})

// async function upoadDist(localDir: string, s3prefix: string){
//     const entries  = await readdir(localDir, {recursive: true, withFileTypes: true})
//     for (const entry in entries){
//         if (!entry.isFile()) continue;
        
//         const 
//     }
// }