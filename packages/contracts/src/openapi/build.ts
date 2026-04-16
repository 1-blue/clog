import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";

import { apiRegistry } from "./registry";

import "./paths";

/**
 * registry 에 등록된 path·component 로 생성된 OpenAPI 문서.
 * 최종적으로 apps/web/openapi.yaml 생성에 사용한다.
 */
export const buildOpenApiDocument = (): Record<string, unknown> => {
  const generator = new OpenApiGeneratorV3(apiRegistry.definitions);
  const doc = generator.generateDocument({
    openapi: "3.0.0",
    info: {
      title: "Clog API",
      version: "1.0.0",
      description: "클라이밍 커뮤니티 앱 API",
    },
    servers: [{ url: "/" }],
  });
  return JSON.parse(JSON.stringify(doc)) as Record<string, unknown>;
};
