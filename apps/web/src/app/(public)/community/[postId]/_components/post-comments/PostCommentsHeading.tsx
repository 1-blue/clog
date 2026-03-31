interface IProps {
  commentCount: number;
}

const PostCommentsHeading: React.FC<IProps> = ({ commentCount }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
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
    </div>
  );
};

export default PostCommentsHeading;
