import { Injectable } from "@nestjs/common";
import { PutObjectCommand, GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

@Injectable()
export class MinioS3Service {
  private readonly client: S3Client;
  private readonly bucket: string;

  constructor() {
    const endpoint = process.env.MINIO_ENDPOINT;
    const region = process.env.MINIO_REGION ?? "us-east-1";
    const accessKeyId = process.env.MINIO_ACCESS_KEY;
    const secretAccessKey = process.env.MINIO_SECRET_KEY;
    const bucket = process.env.MINIO_BUCKET;

    if (!endpoint) throw new Error("MINIO_ENDPOINT is required");
    if (!accessKeyId) throw new Error("MINIO_ACCESS_KEY is required");
    if (!secretAccessKey) throw new Error("MINIO_SECRET_KEY is required");
    if (!bucket) throw new Error("MINIO_BUCKET is required");

    this.bucket = bucket;
    this.client = new S3Client({
      region,
      endpoint,
      forcePathStyle: true,
      credentials: { accessKeyId, secretAccessKey }
    });
  }

  getBucket() {
    return this.bucket;
  }

  async presignPutObject(objectKey: string, contentType?: string): Promise<string> {
    const cmd = new PutObjectCommand({
      Bucket: this.bucket,
      Key: objectKey,
      ContentType: contentType
    });
    return await getSignedUrl(this.client, cmd, { expiresIn: 60 * 10 });
  }

  async presignGetObject(objectKey: string): Promise<string> {
    const cmd = new GetObjectCommand({
      Bucket: this.bucket,
      Key: objectKey
    });
    return await getSignedUrl(this.client, cmd, { expiresIn: 60 * 10 });
  }
}

