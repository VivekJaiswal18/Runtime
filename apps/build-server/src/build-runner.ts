import { exec } from "node:child_process"; 
import { publishBuildLog } from "@repo/kafka";
import { promisify } from "node:util";
import { readFile, stat } from "node:fs/promises";
// import path from "node:path";

// const repoDir = "cd home/app/output";
// const repoDir = "cwd cd home/app/output && npm install && npm run build";

const jobId = process.env.JOB_ID!;

const repo = "cd /home/app/output && npm install && npm run build";
if(!process.env.PRESIGNED_URL){
    throw new Error("Missing Presigned upload URL!")
}
// const uploadZip = `cd /home/app/output && zip -r dist.zip dist && curl --upload-file dist.zip "${process.env.PRESIGNED_URL}"`
const distZip = `cd /home/app/output && zip -r dist.zip dist`
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
        await execAsync(distZip)
        exec("ls /home/app/output/dist", (err, stdout, stderr)=>{
            if(err){
                console.log("Error in runner", err)
            }
        console.log(stdout)
        })
        const zipPath = "/home/app/output/dist.zip"
        const fileSize = (await stat(zipPath)).size;
        // const distFiles = await readdir(distPath, {withFileTypes: true, recursive: true})
        // const distFiles = await readdir("/home/app/output/dist.zip", {withFileTypes: true, recursive: true})
        // for (const file of distFiles){
            
        //     if(!file.isFile()) continue

        //     const filePath = path.join(distPath, file.name)
        //     const content = await readFile(filePath)
        //     await fetch("http://", {
        //         method: "PUT",
        //         body: content,
        //         headers:{
        //             ContentType: "application/octet-stream"
        //         }
        //     })
        //     const uploadDist = await fetch(process.env.PRESIGNED_URL!, {
        //         method: "PUT",
        //         body: file,
        //         headers: {
        //             ContentType: "application/octet-stream"
        //         },
        //     })
        // }
        const buffer = await readFile(zipPath);
        const uploadZipDist = await fetch(process.env.PRESIGNED_URL!, {
                method: "PUT",
                body: new Uint8Array(buffer),
                headers: {
                    "Content-Type": "application/zip",
                    "Content-Length": fileSize.toString()
                },
            })
            if (!uploadZipDist.ok){
                throw new Error(`Error in uploading build artifacts to S3 ${uploadZipDist.status}`)
            }
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