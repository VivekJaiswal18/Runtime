import {startBuildJobConsumer} from "@repo/kafka";
import {exec} from "child_process";

startBuildJobConsumer(async(jobId, branch, repoUrl)=>{
    exec(`
            docker run --rm \
            -e JOB_ID="${jobId}" \
            -e BRANCH="${branch}" \
            -e REPO_URL="${repoUrl}" \
            build-server
        `);
})