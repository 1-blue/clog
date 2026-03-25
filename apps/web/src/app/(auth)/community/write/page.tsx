"use client";

import { useState } from "react";

import type { CommunityCategory } from "@clog/utils";

import TopBar from "#web/components/layout/TopBar";
import MultiImageUploader from "#web/components/shared/MultiImageUploader";
import { Input } from "#web/components/ui/input";
import { Textarea } from "#web/components/ui/textarea";
import usePostMutations from "#web/hooks/mutations/posts/usePostMutations";

import CategorySelector from "./_source/components/CategorySelector";

const CommunityWritePage = () => {
  const [category, setCategory] = useState<CommunityCategory>("FREE");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const { postCreateMutation } = usePostMutations();

  const submit = () => {
    const tagList = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    postCreateMutation.mutate({
      body: {
        category,
        title,
        content,
        tags: tagList.length > 0 ? tagList : undefined,
        ...(imageUrls.length > 0 ? { imageUrls } : {}),
      },
    });
  };

  return (
    <div className="pb-8">
      <TopBar
        showBack
        title="커뮤니티 글쓰기"
        action={
          <button
            type="button"
            onClick={() => submit()}
            disabled={
              title.length < 2 ||
              content.length < 10 ||
              postCreateMutation.isPending
            }
            className="rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground disabled:opacity-50"
          >
            등록
          </button>
        }
      />

      <div className="space-y-5 px-4 pt-4">
        {/* 카테고리 */}
        <CategorySelector category={category} setCategory={setCategory} />

        {/* 제목 */}
        <div>
          <label className="text-sm font-medium text-on-surface">제목</label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            maxLength={100}
            className="mt-1 rounded-xl bg-surface-container-high px-3 py-3 text-sm text-on-surface placeholder:text-on-surface-variant"
          />
        </div>

        {/* 이미지 */}
        <div>
          <label className="text-sm font-medium text-on-surface">이미지</label>
          <div className="mt-2">
            <MultiImageUploader
              urls={imageUrls}
              onUrlsChange={setImageUrls}
              maxFiles={10}
            />
          </div>
        </div>

        {/* 본문 */}
        <div>
          <label className="text-sm font-medium text-on-surface">내용</label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력하세요 (최소 10자)"
            rows={10}
            className="mt-1 min-h-60 resize-none rounded-xl bg-surface-container-high px-3 py-3 text-sm text-on-surface placeholder:text-on-surface-variant"
          />
          <p className="mt-1 text-right text-xs text-on-surface-variant">
            {content.length}/5000
          </p>
        </div>

        {/* 태그 */}
        <div>
          <label className="text-sm font-medium text-on-surface">
            태그 (쉼표로 구분)
          </label>
          <Input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="볼더링, 초보, 서울"
            className="mt-1 rounded-xl bg-surface-container-high px-3 py-3 text-sm text-on-surface placeholder:text-on-surface-variant"
          />
        </div>
      </div>
    </div>
  );
};
export default CommunityWritePage;
