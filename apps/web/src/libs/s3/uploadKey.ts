/** 실행 환경 세그먼트 — S3 객체 키 앞부분 */
export const getUploadRunEnv = (): "development" | "production" =>
  process.env.NODE_ENV === "production" ? "production" : "development";

export const UPLOAD_ASSET_TYPES = ["images", "videos"] as const;
export type UploadAssetType = (typeof UPLOAD_ASSET_TYPES)[number];

/**
 * S3 객체 키: `{실행환경}/{타입}/{원본파일명}_{시간값}.{확장자}`
 * (버킷명은 PutObject의 Bucket에만 사용)
 */
export function buildUploadObjectKey(
  originalFilename: string,
  type: UploadAssetType,
): string {
  const runEnv = getUploadRunEnv();
  const ts = Date.now();

  const basename = originalFilename.split(/[/\\]/).pop() ?? originalFilename;
  const lastDot = basename.lastIndexOf(".");
  let nameWithoutExt = lastDot > 0 ? basename.slice(0, lastDot) : basename;
  let ext = lastDot > 0 ? basename.slice(lastDot + 1) : "";

  nameWithoutExt = nameWithoutExt.replace(/[^\w.\-가-힣]/g, "_").slice(0, 120);
  if (!nameWithoutExt) nameWithoutExt = "file";

  ext = ext.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  if (!ext) {
    ext = type === "videos" ? "mp4" : "jpg";
  }

  const finalName = `${nameWithoutExt}_${ts}.${ext}`;
  return `${runEnv}/${type}/${finalName}`;
}

function encodeS3KeyPath(key: string): string {
  return key.split("/").map(encodeURIComponent).join("/");
}

/** 가상 호스팅 스타일 공개 URL */
export function buildPublicObjectUrl(key: string): string {
  const bucket = process.env.AWS_S3_BUCKET ?? "climbing-log";
  const region = process.env.AWS_REGION ?? "ap-northeast-2";
  const pathKey = encodeS3KeyPath(key);
  return `https://${bucket}.s3.${region}.amazonaws.com/${pathKey}`;
}
