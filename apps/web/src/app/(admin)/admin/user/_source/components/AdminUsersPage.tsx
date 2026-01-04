import { routes } from "@clog/libs";

const AdminUserPage: React.FC = () => {
  return (
    <div>
      <h1>{routes.admin.user.label}</h1>
      <h1>{routes.admin.user.url}</h1>
    </div>
  );
};

export default AdminUserPage;
