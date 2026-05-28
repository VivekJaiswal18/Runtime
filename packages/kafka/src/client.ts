import { Kafka } from 'kafkajs';


let kafkaInstance: Kafka | null = null;

export default function getKafka(): Kafka {
  if (kafkaInstance) return kafkaInstance;

const KAFKA_CA_CERT_B64 = process.env.KAFKA_CA_CERT_B64;
const  KAFKA_CLIENT_CERT = process.env.KAFKA_CLIENT_CERT;
const KAFKA_CLIENT_KEY = process.env.KAFKA_CLIENT_KEY;
const KAFKA_BROKERS = process.env.KAFKA_BROKERS;

if (!KAFKA_CA_CERT_B64) throw new Error("No KAFKA_CA_CERT_B64 present")
if (!KAFKA_CLIENT_CERT) throw new Error("No KAFKA_CLIENT_CERT present")
if (!KAFKA_CLIENT_KEY) throw new Error("No KAFKA_CLIENT_KEY present")
if (!KAFKA_BROKERS) throw new Error("No KAFKA_BROKERS present")

  kafkaInstance = new Kafka({
    // clientId: process.env.KAFKA_CLIENT_ID || 'runtime',
    brokers: KAFKA_BROKERS.split(','),
    ...(process.env.KAFKA_SSL === 'true' && {
      ssl: {
        ca:   [Buffer.from(KAFKA_CA_CERT_B64, 'base64').toString()],
        cert: Buffer.from(KAFKA_CLIENT_CERT, 'base64').toString(),
        key:  Buffer.from(KAFKA_CLIENT_KEY, 'base64').toString(),
      }
    }),
  });
  return kafkaInstance;
};
