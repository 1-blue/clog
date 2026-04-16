import { useCallback, useState } from "react";

import {
  uploadWithPresignedUrl,
  type PresignedAssetType,
} from "#web/libs/upload/presignedUpload";

/** 단일 파일 presigned 업로드 (진행 상태 포함) */
export function usePresignedUpload(assetType: PresignedAssetType = "images") {
  const [isUploading, setIsUploading] = useState(false);

  const upload = useCallback(
    async (file: File) => {
      setIsUploading(true);
      try {
        return await uploadWithPresignedUrl(file, assetType);
      } finally {
        setIsUploading(false);
      }
    },
    [assetType],
  );

  return { upload, isUploading };
}
