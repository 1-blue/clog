import { routes } from "@clog/libs";

const AdminGymPage: React.FC = () => {
  return (
    <div>
      <h1>{routes.admin.gym.label}</h1>
      <h1>{routes.admin.gym.url}</h1>
    </div>
  );
};

export default AdminGymPage;
