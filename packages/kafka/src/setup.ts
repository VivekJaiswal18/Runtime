// import getKafka from './client';
// import { TOPICS } from './topics';

// export const setupTopics = async () => {
//   const admin = getKafka().admin();
//   await admin.connect();

//   await admin.createTopics({
//     waitForLeaders: true,
//     topics: [
//       { topic: TOPICS.BUILD_JOB, numPartitions: 3, replicationFactor: 1 },
//       { topic: TOPICS.BUILD_LOG, numPartitions: 3, replicationFactor: 1 },
//     ]
//   });

//   await admin.disconnect();
//   console.log('Kafka topics created');
// };