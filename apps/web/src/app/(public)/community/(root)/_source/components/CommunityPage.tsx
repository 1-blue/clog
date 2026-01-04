import { routes } from "@clog/libs";

const CommunityPage: React.FC = () => {
  return (
    <div>
      <h1>{routes.community.label}</h1>
      <h1>{routes.community.url}</h1>
    </div>
  );
};

export default CommunityPage;
