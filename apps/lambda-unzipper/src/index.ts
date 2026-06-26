import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import AdmZip from "adm-zip";
import path from "node:path";

const s3 = new S3Client({ region: process.env.AWS_REGION! });

export const handler = async (event: any) => {
  for (const record of event.Records) {
    const sourceBucket = record.s3.bucket.name; //the s3 event triggering will be the source here
    const sourceKey = decodeURIComponent(record.s3.object.key.replace(/\+/g, " "));

    if (!sourceKey.endsWith("dist.zip")) return;

    const jobId = sourceKey.split("/")[1];

    const zipObj = await s3.send(
      new GetObjectCommand({
        Bucket: sourceBucket,
        Key: sourceKey,
      })
    );

    const zipBuffer = Buffer.from(await zipObj.Body!.transformToByteArray());
    const zip = new AdmZip(zipBuffer);

    const entries = zip.getEntries();

    for (const entry of entries) {
      if (entry.isDirectory) continue;

      let relativePath = entry.entryName;

      relativePath = relativePath.replace(/^dist\//, "");

      const targetKey = `sites/${jobId}/${relativePath}`;

      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.STATIC_BUCKET!,
          Key: targetKey,
          Body: entry.getData(),
          ContentType: getContentType(relativePath),
        })
      );
    }

    console.log(`Deployment ${jobId} extracted successfully`);
  }
};

function getContentType(filePath: string) {
  const ext = path.extname(filePath);

  if (ext === ".html") return "text/html";
  if (ext === ".js") return "application/javascript";
  if (ext === ".css") return "text/css";
  if (ext === ".json") return "application/json";
  if (ext === ".svg") return "image/svg+xml";
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".ico") return "image/x-icon";

  return "application/octet-stream";
}
