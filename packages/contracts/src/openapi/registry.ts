import {
  extendZodWithOpenApi,
  OpenAPIRegistry,
} from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

/** Clog API 전체(공개 + 어드민) OpenAPI 레지스트리 싱글톤. */
export const apiRegistry = new OpenAPIRegistry();

/** @deprecated 기존 import 호환용 — `apiRegistry` 사용 */
export const adminRegistry = apiRegistry;

export { z };
