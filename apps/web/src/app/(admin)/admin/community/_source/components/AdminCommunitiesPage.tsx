import { routes } from "@clog/libs";

const AdminCommunityPage: React.FC = () => {
  return (
    <div>
      <h1>{routes.admin.community.label}</h1>
      <h1>{routes.admin.community.url}</h1>
    </div>
  );
};

export default AdminCommunityPage;
