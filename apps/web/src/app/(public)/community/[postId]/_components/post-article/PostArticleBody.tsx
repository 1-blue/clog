"use client";

interface IProps {
  content: string;
  tags: string[];
}

const PostArticleBody: React.FC<IProps> = ({ content, tags }) => {
  return (
    <div className="flex flex-col gap-4 text-base leading-loose wrap-break-word break-keep text-on-surface">
      <p className="rounded-sm bg-primary/20 px-3 py-1 whitespace-pre-wrap">
        {content}
      </p>

      {tags.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="cursor-default rounded-full bg-surface-container-highest/60 px-3.5 py-1.5 text-xs text-on-surface-variant"
            >
              #{tag}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default PostArticleBody;
