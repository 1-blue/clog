"use client";

import { FormProvider, type FieldErrors } from "react-hook-form";

import TopBar from "#web/components/layout/TopBar";
import usePostMutations from "#web/hooks/mutations/posts/usePostMutations";

import useCommunityPostForm, {
  toCreatePostBody,
  type TCommunityPostFormData,
} from "../../hooks/useCommunityPostForm";
import CommunityPostCategoryField from "../community-post-form/CommunityPostCategoryField";
import CommunityPostContentField from "../community-post-form/CommunityPostContentField";
import CommunityPostFormStickyBar from "../community-post-form/CommunityPostFormStickyBar";
import CommunityPostImageField from "../community-post-form/CommunityPostImageField";
import CommunityPostTagsField from "../community-post-form/CommunityPostTagsField";
import CommunityPostTitleField from "../community-post-form/CommunityPostTitleField";

const scrollToFirstInvalid = (errors: FieldErrors<TCommunityPostFormData>) => {
  const order: (keyof TCommunityPostFormData)[] = [
    "category",
    "title",
    "content",
    "tags",
    "imageUrls",
  ];
  for (const key of order) {
    if (errors[key]) {
      const el = document.querySelector<HTMLElement>(
        `[data-community-post-field="${String(key)}"]`,
      );
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      break;
    }
  }
};

const CommunityPostCreateMain: React.FC = () => {
  const methods = useCommunityPostForm();
  const { handleSubmit } = methods;
  const { postCreateMutation } = usePostMutations();

  const onValid = (data: TCommunityPostFormData) => {
    postCreateMutation.mutate({ body: toCreatePostBody(data) });
  };

  return (
    <>
      <FormProvider {...methods}>
        <div className="min-h-svh bg-background pb-[calc(7.25rem+env(safe-area-inset-bottom,0px))]">
          <TopBar
            showQuickActions={false}
            className="bg-background/95"
            title="커뮤니티 글쓰기"
          />
          <div className="mx-auto flex max-w-lg flex-col gap-6 pt-5">
            <div data-community-post-field="category">
              <CommunityPostCategoryField />
            </div>
            <div data-community-post-field="title">
              <CommunityPostTitleField />
            </div>
            <div data-community-post-field="imageUrls">
              <CommunityPostImageField />
            </div>
            <div data-community-post-field="content">
              <CommunityPostContentField />
            </div>
            <div data-community-post-field="tags">
              <CommunityPostTagsField />
            </div>
          </div>
        </div>
      </FormProvider>
      <CommunityPostFormStickyBar
        label="등록"
        pending={postCreateMutation.isPending}
        onSubmit={() => {
          void handleSubmit(onValid, scrollToFirstInvalid)();
        }}
      />
    </>
  );
};

export default CommunityPostCreateMain;
