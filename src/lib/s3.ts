import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

const client = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  forcePathStyle: true,
  region: 'auto',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? ''
  }
});

export async function uploadImageBuffer(key: string, body: any, contentType: string) {
  await client.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType
    })
  );

  return `${process.env.S3_PUBLIC_BASE_URL}/${key}`;
}
