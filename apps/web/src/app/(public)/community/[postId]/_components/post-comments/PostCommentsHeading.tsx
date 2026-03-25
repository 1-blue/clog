interface IProps {
  commentCount: number;
}

const PostCommentsHeading = ({ commentCount }: IProps) => {
  return (
    <div className="mb-8 flex items-center justify-between border-b border-outline-variant/10 pb-4">
      <h3 className="flex items-center gap-2 text-lg font-bold text-on-surface">
        댓글{" "}
        <span className="text-sm font-normal text-primary/80">
          {commentCount}
        </span>
      </h3>
      <span className="text-xs font-medium text-on-surface-variant">
        최신순
      </span>
    </div>
  );
};

export default PostCommentsHeading;
