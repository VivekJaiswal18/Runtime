import { Consumer, EachMessagePayload } from "kafkajs";
import getKafka from "./client";
import { TOPICS } from "./topics";
import { StatementResultingChanges } from "node:sqlite";

let consumerInstance = new Map<string, Consumer>();


const getConsumer = async (groupId: string): Promise<Consumer> => {
    if (consumerInstance.has(groupId)) return consumerInstance.get(groupId)!;

    const consumer = getKafka().consumer({groupId});
    await consumer.connect();
    consumerInstance.set(groupId, consumer)
    return consumer;
    
}

export const startLogStreamConsumer = async (
  onMessage: (jobId: string, data: string) => void
) => {
  const consumer = await getConsumer('frontend-streamers');
  await consumer.subscribe({ topic: TOPICS.BUILD_LOG, fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ message }: EachMessagePayload) => {
      const jobId = message.key?.toString();
      const data  = message.value?.toString();
      if (jobId && data) onMessage(jobId, data);
    }
  });
};

export const startAIConsumer = async (
  onBuildComplete: (jobId: string, logs: string[]) => void
) => {
  const consumer = await getConsumer('ai-summarizer');
  await consumer.subscribe({ topic: TOPICS.BUILD_LOG, fromBeginning: false });

  const logBuffer = new Map<string, string[]>();

  await consumer.run({
    eachMessage: async ({ message }: EachMessagePayload) => {
      const data = JSON.parse(message.value?.toString() || '{}');
      const { jobId, type, log } = data;

      if (!logBuffer.has(jobId)) logBuffer.set(jobId, []);

      if (type === 'log') {
        logBuffer.get(jobId)!.push(log);
      }

      if (type === 'done') {
        const logs = logBuffer.get(jobId) || [];
        await onBuildComplete(jobId, logs);  
        logBuffer.delete(jobId);             
      }
    }
  });
};

export const startDBConsumer = async (
  onMessage: (jobId: string, data: object) => void
) => {
  const consumer = await getConsumer('db-persister');
  await consumer.subscribe({ topic: TOPICS.BUILD_LOG, fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ message }: EachMessagePayload) => {
      const data = JSON.parse(message.value?.toString() || '{}');
      if (data.jobId) await onMessage(data.jobId, data);
    }
  });
};

export const startBuildJobConsumer = async (
  onJob: (jobId: string, repoUrl: string, branch: string) => void
) => {
  const consumer = await getConsumer('build-workers');
  await consumer.subscribe({ topic: TOPICS.BUILD_JOB, fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ message }: EachMessagePayload) => {
      const { jobId, repoUrl, branch } = JSON.parse(message.value?.toString() || '{}');
      if (jobId) await onJob(jobId, repoUrl, branch);
    }
  });
};
