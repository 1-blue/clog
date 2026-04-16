/**
 * registry(공개 + 어드민) 로부터 최종 OpenAPI yaml 을 생성한다.
 */
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import yaml from "js-yaml";

import { buildOpenApiDocument } from "@clog/contracts";

type TOpenApiDoc = {
  paths?: Record<string, unknown>;
  components?: { schemas?: Record<string, unknown> };
};

const yamlPath = resolve(__dirname, "..", "openapi.yaml");
const doc = buildOpenApiDocument() as TOpenApiDoc;

writeFileSync(
  yamlPath,
  yaml.dump(doc, { lineWidth: 120, noRefs: true }),
  "utf8",
);

const totalPathCount = Object.keys(doc.paths ?? {}).length;
console.log(`✅ openapi.yaml 생성 완료 — 총 ${totalPathCount}개`);
