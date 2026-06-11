import { OpenRouter } from "@openrouter/sdk";
import {QdrantClient} from "@qdrant/js-client-rest"
const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY
});

const client = new QdrantClient({
  url: process.env.VECTOR_DB_CLUSTER_ENDPOINT!,
  apiKey: process.env.VECTOR_DB_API_KEY!
})

export default async function embedding (context: string ){
const embedding = await openrouter.embeddings.generate({
  requestBody: {
    model: "nvidia/llama-nemotron-embed-vl-1b-v2:free",
    input: [
      {
        content: [
          { type: "text", text: context },
          // { type: "text", text: "What is in this image?" },
        ]
      }
    ],
    encodingFormat: "float"
  }
});

// await client.upsert()
return embedding
// console.log(JSON.stringify(embedding, null, 2));
// console.log(embedding.valueOf(data));
// console.log(embedding.data[0].embedding.length);
}

