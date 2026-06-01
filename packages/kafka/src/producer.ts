import { Producer } from 'kafkajs';
import getKafka from './client';
import { TOPICS } from './topics';

let producerInstance: Producer | null = null;

type BuildJobPayload = {
    jobId: string,
    name: string,
    repoUrl: string,
    branch: string,
}

type BuildLogPayload = {
    jobId: string,
    log: string,
    type?: string,
}

const getProducer = async () => {
  if (producerInstance) return producerInstance;
  
  producerInstance = getKafka().producer();
  await producerInstance.connect();
  return producerInstance;
};


export const publishBuildJob = async ({jobId, name, repoUrl, branch}: BuildJobPayload) => {
  const producer = await getProducer();
  
  await producer.send({
    topic: TOPICS.BUILD_JOB,        
    messages: [{
      key: jobId,
      value: JSON.stringify({ jobId, name, repoUrl, branch })
    }]
  });
};

export const publishBuildLog = async ({jobId, log, type = "log"}: BuildLogPayload) => {
  const producer = await getProducer();

  await producer.send({
    topic: TOPICS.BUILD_LOG,        
    messages: [{
      key: jobId,
      value: JSON.stringify({ jobId, log, type, timestamp: Date.now() })
    }]
  });
};

export const disconnectProducer = async () => {
  if (producerInstance) await producerInstance.disconnect();
};
