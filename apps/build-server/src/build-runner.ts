import { exec } from "node:child_process"; 
import { publishBuildLog } from "@repo/kafka";
// const repoDir = "cd home/app/output";
// const repoDir = "cwd cd home/app/output && npm install && npm run build";

const jobId = process.env.JOB_ID!;

const repo = "cd /home/app/output && npm install && npm run build";

const build = exec(repo);


build.stdout?.on('data', async (data)=>{
    await publishBuildLog({
        jobId: jobId,
        log: data.toString(),
        type: "log"
    })
});

build.stderr?.on('data', async (data)=>{
    await publishBuildLog({
        jobId: jobId,
        log: data.toString(),
        type: "log"
    })
})

build.on('close', async (code)=>{
    if (code !== 0){
    await publishBuildLog({
        jobId: jobId,
        log: `Error during build with exit code: ${code}`,
        type: "error"
    })
    process.exit(1)
    }
    await publishBuildLog({
        jobId: jobId,
        log: "Build Complete",
        type: "done"
    })
    process.exit(0)
})

build.on("error", async(error) =>{
    await publishBuildLog({
        jobId: jobId,
        log: `Error: ${error.message}`,
        type: "error"
    })
    process.exit(1)
})
