import { Consumer, EachMessagePayload } from "kafkajs";
import getKafka from "./client";
import { TOPICS } from "./topics";

const consumerInstance = new Map<string, Consumer>();


const getConsumer = async (groupId: string): Promise<Consumer> => {
    if (consumerInstance.has(groupId)) return consumerInstance.get(groupId)!;

    const consumer = getKafka().consumer({groupId});
    await consumer.connect();
    consumerInstance.set(groupId, consumer)
    return consumer;
    
}

export const startLogStreamConsumer =  async (onMessage: (jobId: string, log: string)=> void) => {
    const consumer = await getConsumer("frontend-log-consumer");
    await consumer.subscribe({topic: TOPICS.BUILD_LOG, fromBeginning: false});
    await consumer.run({
      eachMessage: async ({message}: EachMessagePayload) =>{
        const {jobId, log} = JSON.parse(message.value?.toString() || '{}');
        if (jobId && log) onMessage(jobId, log);
      }
    });
};

export const startBuildJobConsumer = async (onJob: (jobId: string, repoUrl: string, branch: string)=> void)=>{
    const consumer = await getConsumer("build-job-consumer");
    await consumer.subscribe({topic: TOPICS.BUILD_JOB, fromBeginning: false});
    await consumer.run({
        eachMessage: async ({message}: EachMessagePayload) =>{
          const {jobId, repoUrl, branch} = JSON.parse(message.value?.toString() || '{}');
            if (jobId)  onJob(jobId, repoUrl, branch);
        }
    })
}

export const startAiConsumer = async (onBuildComplete: (jobId: string, logs: string[])=> void) =>{
  const consumer = await getConsumer("ai-consumer")
  await consumer.subscribe({topic: TOPICS.BUILD_LOG, fromBeginning: false})
  const logsBuffer = new Map<string, string[]>();
  await consumer.run({
    eachMessage: async ({message}: EachMessagePayload)=>{
      const {jobId, log, type} = JSON.parse(message.value?.toString() || '{}')

      if (!logsBuffer.get(jobId)) logsBuffer.set(jobId, []);

      if (type === 'log'){
        logsBuffer.get(jobId)?.push(log)
      };

      if (type === 'done'){
        let logs = logsBuffer.get(jobId) || [];
        onBuildComplete(jobId, logs);
        logsBuffer.delete(jobId);
      };
    }
  });
}

export const startDBLogConsumer = async (onBuildLog: (jobId: string, logs: string)=> void) =>{
  const consumer = await getConsumer("db-log-consumer");
  await consumer.subscribe({topic: TOPICS.BUILD_LOG, fromBeginning: false});
  await consumer.run({
    eachMessage: async ({ message }: EachMessagePayload) =>{
      const {jobId, log} = JSON.parse(message.value?.toString() || '{}')
      if (jobId) onBuildLog(jobId, log)
    }
  });
};

export const startDBJobConsumer = async (onBuildJob: (jobId: string, name: string, repoUrl: string, branch: string) => void) =>{
  const consumer = await getConsumer("db-job-consumer");
  await consumer.subscribe({topic: TOPICS.BUILD_JOB, fromBeginning: false});
  await consumer.run({
    eachMessage: async ({message}: EachMessagePayload) => {
      const {jobId, name, repoUrl, branch} = JSON.parse(message.value?.toString() || '{}')
      if (jobId) onBuildJob(jobId, name, repoUrl, branch)
    }
  });
};
