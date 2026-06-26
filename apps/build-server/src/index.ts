import {startBuildJobConsumer} from "@repo/kafka";
import {ECSClient, LaunchType, RunTaskCommand} from "@aws-sdk/client-ecs";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const ecs = new ECSClient({
    region: process.env.REGION!
});

const s3Client = new S3Client({
region: process.env.S3_REGION!
})

startBuildJobConsumer(async(jobId, repoUrl, branch)=>{
    const presignedUrl = await getPresignedUrl(jobId)
    const response =     await ecs.send(
        new RunTaskCommand({
            cluster: process.env.CLUSTER,
            taskDefinition: process.env.BUILD_TASK_DEFINITION,
            launchType: process.env.LAUNCH_TYPE as LaunchType,
            networkConfiguration:{
                awsvpcConfiguration: {
                    subnets: process.env.SUBNET!.split(","),
                    securityGroups: process.env.SECURITY_GROUPS!.split(","),
                    // securityGroups: [process.env.SECURITY_GROUPS!],
                    assignPublicIp: "ENABLED",
                }
            },
            overrides: {
                containerOverrides:[{
                    name: "build-runner-task-config-container-1-fargate",
                    environment: [
                        {
                            name: "JOB_ID",
                            value: jobId,
                        },
                        {
                            name: "GIT_REPOSITORY_LINK",
                            value: repoUrl,
                        },
                        {
                            name: "BRANCH",
                            value: branch
                        },
                        {
                            name: "PRESIGNED_URL",
                            value: presignedUrl
                        }
                    ],
                }],
            },
        })
    )
    if (response.failures?.length){
        console.error(response.failures)
    }
    else{
        console.log(response.$metadata)
    }
})

async function getPresignedUrl(jobId: string){
    const command = new PutObjectCommand({
        Bucket: process.env.BUCKET,
        Key: `artifacts/${jobId}/dist.zip`,
        ContentType: 'application/zip'
    })

    const url = await getSignedUrl(
        s3Client,
        command,
        {
            expiresIn: 600
        }
    );

    return url

}