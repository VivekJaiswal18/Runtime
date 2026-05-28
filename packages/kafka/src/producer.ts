// packages/kafka/producer.js
import { Producer } from 'kafkajs';
import getKafka from './client';
import { TOPICS } from './topics';

let producerInstance: Producer | null = null;

type BuildJobPayload = {
    jobId: string,
    repoUrl: string,
    branch: string,
}

type BuildLogPayload = {
    jobId: string,
    message: string,
    type: string,
}

const getProducer = async () => {
  if (producerInstance) return producerInstance;
  
  producerInstance = getKafka().producer();
  await producerInstance.connect();
  return producerInstance;
};


export const publishBuildJob = async ({jobId, repoUrl, branch}: BuildJobPayload) => {
  const producer = await getProducer();
  
  await producer.send({
    topic: TOPICS.BUILD_JOB,        
    messages: [{
      key: jobId,
      value: JSON.stringify({ jobId, repoUrl, branch })
    }]
  });
};

export const publishBuildLog = async ({jobId, message, type = 'log'}: BuildLogPayload) => {
  const producer = await getProducer();

  await producer.send({
    topic: TOPICS.BUILD_LOG,        
    messages: [{
      key: jobId,
      value: JSON.stringify({ jobId, message, type, timestamp: Date.now() })
    }]
  });
};

export const disconnectProducer = async () => {
  if (producerInstance) await producerInstance.disconnect();
};
