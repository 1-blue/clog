"use client";

import { ArrowLeft } from "lucide-react";
import { FormProvider, type FieldErrors } from "react-hook-form";
import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { openapi } from "#web/apis/openapi";
import AppTopBar from "#web/components/layout/AppTopBar";
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
    "tagInput",
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
      tagInput: post.tags.join(", "),
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
        <div className="min-h-svh bg-background pb-[calc(4.5rem+max(1.25rem,env(safe-area-inset-bottom)))]">
          <AppTopBar
            showNotification={false}
            className="bg-background/95"
            left={
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <Link
                  href={ROUTES.COMMUNITY.DETAIL.path(postId)}
                  className="flex size-10 shrink-0 items-center justify-center rounded-full text-on-surface hover:bg-surface-container-high"
                  aria-label="뒤로"
                >
                  <ArrowLeft className="size-5" strokeWidth={2} />
                </Link>
                <h1 className="min-w-0 flex-1 truncate text-center text-base font-semibold text-on-surface">
                  게시글 수정
                </h1>
                <span className="size-10 shrink-0" aria-hidden />
              </div>
            }
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
            <div data-community-post-field="tagInput">
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
