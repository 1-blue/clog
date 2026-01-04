import { routes } from "@clog/libs";

interface IProps {
  communityId: string;
}

const CommunityDetailPage: React.FC<IProps> = ({ communityId }) => {
  return (
    <div>
      <h1>{routes.community.detail.label}</h1>
      <h1>{routes.community.detail.url(communityId)}</h1>
    </div>
  );
};

export default CommunityDetailPage;
