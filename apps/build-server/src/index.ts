import { exec } from "node:child_process"; 

// const repoDir = "cd home/app/output";
// const repoDir = "cwd cd home/app/output && npm install && npm run build";
console.log(5);
const repo = "cd /home/app/output pnpm install && npm run build";

const build = exec(repo);
console.log(9);
//@ts-ignore
build.stdout.on('data', (data)=>{
    console.log(data.toString())
});
//@ts-ignore
build.stdout.on('error', (error)=>{
    console.log(error.toString())
})
//@ts-ignore
build.stdout.on('close', (close)=>{
    console.log(`Build complete, ${close}`)
})
console.log("20")