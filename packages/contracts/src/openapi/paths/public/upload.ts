import { apiRegistry, z } from "../../registry";
import { singleResponse } from "../common";

apiRegistry.registerPath({
  method: "post",
  path: "/api/v1/upload/presigned",
  operationId: "createPresignedUploadUrl",
  summary: "S3 Presigned URL 생성",
  tags: ["Upload"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            filename: z.string().min(1),
            contentType: z.string().min(1),
            type: z.enum(["images", "videos"]),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: singleResponse(
            z.object({
              presignedUrl: z.string().url(),
              key: z.string(),
              publicUrl: z.string().url(),
            }),
          ),
        },
      },
    },
  },
});
