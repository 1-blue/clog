import { routes } from "@clog/libs";

const ProfileSettingPage: React.FC = () => {
  return (
    <div>
      <h1>{routes.profile.setting.label}</h1>
      <h1>{routes.profile.setting.url}</h1>
    </div>
  );
};

export default ProfileSettingPage;
