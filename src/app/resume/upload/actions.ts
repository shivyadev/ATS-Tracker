"use server";

import { currentUser } from "@clerk/nextjs/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { generateFileName } from "@/lib/crypto";

const s3 = new S3Client({
  region: process.env.AWS_BUCKET_REGION!,
  credentials: {
    accessKeyId: process.env.NEXT_AWS_ACCESS_KEY!,
    secretAccessKey: process.env.NEXT_AWS_SECRET_ACCESS_KEY!,
  },
});

type GetSignedURLParams = {
  type: string;
  size: number;
  checksum: string;
};

export async function getSignedURL({
  type,
  size,
  checksum,
}: GetSignedURLParams) {
  const user = await currentUser();

  if (!user) return { failure: "Unauthorized User" };

  const fileKey = generateFileName();

  const putObjectCommand = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: fileKey,
    ContentType: type,
    ContentLength: size,
    ChecksumSHA256: checksum,
  });

  const signedURL = await getSignedUrl(s3, putObjectCommand, {
    expiresIn: 60,
  });

  return { success: { url: signedURL, fileKey: fileKey } };
}
