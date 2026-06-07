import {startBuildJobConsumer} from "@repo/kafka";
import {ECSClient, LaunchType, RunTaskCommand} from "@aws-sdk/client-ecs";

const ecs = new ECSClient({
    region: process.env.REGION!,
});

startBuildJobConsumer(async(jobId, repoUrl, branch)=>{
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

