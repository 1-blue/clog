import { routes } from "@clog/libs";

const CommunityCreatePage: React.FC = () => {
  return (
    <div>
      <h1>{routes.community.create.label}</h1>
      <h1>{routes.community.create.url}</h1>
    </div>
  );
};

export default CommunityCreatePage;
