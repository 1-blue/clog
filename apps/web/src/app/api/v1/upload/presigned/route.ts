import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { z } from "zod";

import { errorResponse, json, requireAuth } from "#web/libs/api";
import {
  buildPublicObjectUrl,
  buildUploadObjectKey,
  UPLOAD_ASSET_TYPES,
  type UploadAssetType,
} from "#web/libs/s3/uploadKey";

const requestSchema = z.object({
  filename: z.string().min(1),
  contentType: z.string().min(1),
  type: z.enum(UPLOAD_ASSET_TYPES),
});

function assertContentTypeMatchesAssetType(
  contentType: string,
  assetType: UploadAssetType,
): boolean {
  if (assetType === "images") return contentType.startsWith("image/");
  if (assetType === "videos") return contentType.startsWith("video/");
  return false;
}

/** 브라우저 PUT은 체크섬 헤더를 보내지 않으므로, 기본(WHEN_SUPPORTED) 시 URL에 붙는 CRC32 쿼리로 S3가 400을 반환하지 않게 함 */
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const bucket = process.env.AWS_S3_BUCKET;

/** S3 Presigned URL 발급 — 객체 키: `{실행환경}/{images|videos}/{원본명}_{timestamp}.{ext}` */
export const POST = async (request: Request) => {
  const { error } = await requireAuth();
  if (error) return error;

  console.log("🐬 process.env.AWS_REGION >> ", process.env.AWS_REGION);
  console.log(
    "🐬 process.env.AWS_ACCESS_KEY_ID >> ",
    process.env.AWS_ACCESS_KEY,
  );
  console.log(
    "🐬 process.env.AWS_SECRET_ACCESS_KEY >> ",
    process.env.AWS_SECRET_ACCESS_KEY,
  );
  console.log("🐬 process.env.AWS_S3_BUCKET >> ", process.env.AWS_S3_BUCKET);

  try {
    const raw = await request.json();
    const parsed = requestSchema.safeParse(raw);
    if (!parsed.success) {
      return errorResponse(
        "filename, contentType, type(images|videos)이 필요합니다.",
      );
    }

    const { filename, contentType, type } = parsed.data;

    if (!assertContentTypeMatchesAssetType(contentType, type)) {
      return errorResponse(
        type === "images"
          ? "이미지 업로드에는 image/* Content-Type이 필요합니다."
          : "동영상 업로드에는 video/* Content-Type이 필요합니다.",
      );
    }

    const key = buildUploadObjectKey(filename, type);
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType,
    });

    const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 300 });
    const publicUrl = buildPublicObjectUrl(key);

    return json({
      presignedUrl,
      publicUrl,
      key,
      bucket,
      type,
    });
  } catch (error) {
    console.error("🐬 error >> ", error);
    return errorResponse("업로드 URL 생성에 실패했습니다.");
  }
};
