import { routes } from "@clog/libs";

interface IProps {
  communityId: string;
}

const CommunityEditPage: React.FC<IProps> = ({ communityId }) => {
  return (
    <div>
      <h1>{routes.community.edit.label}</h1>
      <h1>{routes.community.edit.url(communityId)}</h1>
    </div>
  );
};

export default CommunityEditPage;
