import { routes } from "@clog/libs";

const ProfileEditPage: React.FC = () => {
  return (
    <div>
      <h1>{routes.profile.edit.label}</h1>
      <h1>{routes.profile.edit.url}</h1>
    </div>
  );
};

export default ProfileEditPage;
