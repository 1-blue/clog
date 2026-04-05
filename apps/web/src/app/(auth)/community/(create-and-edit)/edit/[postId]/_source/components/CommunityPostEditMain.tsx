"use client";

import { FormProvider, type FieldErrors } from "react-hook-form";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { openapi } from "#web/apis/openapi";
import TopBar from "#web/components/layout/TopBar";
import { ROUTES } from "#web/constants";
import usePostMutations from "#web/hooks/mutations/posts/usePostMutations";
import useMe from "#web/hooks/useMe";

import CommunityPostCategoryField from "../../../../_source/components/community-post-form/CommunityPostCategoryField";
import CommunityPostContentField from "../../../../_source/components/community-post-form/CommunityPostContentField";
import CommunityPostFormStickyBar from "../../../../_source/components/community-post-form/CommunityPostFormStickyBar";
import CommunityPostImageField from "../../../../_source/components/community-post-form/CommunityPostImageField";
import CommunityPostTagsField from "../../../../_source/components/community-post-form/CommunityPostTagsField";
import CommunityPostTitleField from "../../../../_source/components/community-post-form/CommunityPostTitleField";
import useCommunityPostForm, {
  toUpdatePostBody,
  type TCommunityPostFormData,
} from "../../../../_source/hooks/useCommunityPostForm";

interface IProps {
  postId: string;
}

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

const CommunityPostEditMain: React.FC<IProps> = ({ postId }) => {
  const router = useRouter();
  const { me } = useMe();

  const { data: post } = openapi.useSuspenseQuery(
    "get",
    "/api/v1/posts/{postId}",
    { params: { path: { postId } } },
    { select: (d) => d.payload },
  );

  useEffect(() => {
    if (me?.id && me.id !== post.authorId) {
      router.replace(ROUTES.COMMUNITY.DETAIL.path(postId));
    }
  }, [me?.id, post.authorId, postId, router]);

  const methods = useCommunityPostForm({
    defaultValues: {
      category: post.category,
      title: post.title,
      content: post.content,
      tags: [...post.tags],
      imageUrls: post.imageUrls ?? [],
    },
  });

  const { handleSubmit } = methods;
  const { postPatchMutation } = usePostMutations();

  const onValid = (data: TCommunityPostFormData) => {
    postPatchMutation.mutate({
      params: { path: { postId } },
      body: toUpdatePostBody(data),
    });
  };

  return (
    <>
      <FormProvider {...methods}>
        <div className="min-h-svh bg-background pb-[calc(7.25rem+env(safe-area-inset-bottom,0px))]">
          <TopBar
            showQuickActions={false}
            className="bg-background/95"
            title="게시글 수정"
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
        label="수정"
        pending={postPatchMutation.isPending}
        onSubmit={() => {
          void handleSubmit(onValid, scrollToFirstInvalid)();
        }}
      />
    </>
  );
};

export default CommunityPostEditMain;
