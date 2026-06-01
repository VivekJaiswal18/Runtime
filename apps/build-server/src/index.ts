import {startBuildJobConsumer} from "@repo/kafka";
import {ECSClient, LaunchType, RunTaskCommand} from "@aws-sdk/client-ecs";

const ecs = new ECSClient({
    region: process.env.REGION!,
});

startBuildJobConsumer(async(jobId, repoUrl, branch)=>{
    await ecs.send(
        new RunTaskCommand({
            cluster: process.env.CLUSTER,
            taskDefinition: process.env.BUILD_TASK_DEFINITION,
            launchType: process.env.LAUNCH_TYPE as LaunchType,
            networkConfiguration:{
                awsvpcConfiguration: {
                    subnets: process.env.SUBNET!.split(","),
                    securityGroups: [process.env.SECURITY_GROUPS!],
                    assignPublicIp: "ENABLED",
                }
            },
            overrides: {
                containerOverrides:[{
                    name: "build-server-task-config-container-1-fargate",
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
})


