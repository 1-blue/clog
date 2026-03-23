import type { Metadata } from "next";

interface SharedMetadataParams {
  title: string;
  description?: string;
  keywords?: string[];
}

export const getSharedMetadata = ({
  title,
  description = "clog",
  keywords = [],
}: SharedMetadataParams): Metadata => ({
  title: `${title} | clog`,
  description,
  keywords,
});
