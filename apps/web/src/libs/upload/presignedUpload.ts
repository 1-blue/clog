import { fetchClient } from "#web/apis/openapi";

export type PresignedAssetType = "images" | "videos";

/** Presigned URL로 S3에 직접 PUT 후 공개 URL 반환 */
export async function uploadWithPresignedUrl(
  file: File,
  type: PresignedAssetType,
): Promise<string> {
  const contentType =
    file.type || (type === "images" ? "image/jpeg" : "video/mp4");

  const { data, error } = await fetchClient.POST("/api/v1/upload/presigned", {
    body: {
      filename: file.name || (type === "images" ? "image.jpg" : "video.mp4"),
      contentType,
      type,
    },
  });

  if (error || !data?.payload) {
    throw new Error("업로드 URL을 받지 못했습니다.");
  }

  const { presignedUrl, publicUrl } = data.payload;

  const putRes = await fetch(presignedUrl, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": contentType },
  });

  if (!putRes.ok) {
    throw new Error("파일 업로드에 실패했습니다.");
  }

  return publicUrl;
}
