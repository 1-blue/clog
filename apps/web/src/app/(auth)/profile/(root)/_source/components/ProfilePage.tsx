import { routes } from "@clog/libs";
import Link from "next/link";

const ProfilePage: React.FC = () => {
  return (
    <div>
      <h1>{routes.profile.label}</h1>
      <h1>{routes.profile.url}</h1>

      <Link href={routes.profile.edit.url}>{routes.profile.edit.label}</Link>
    </div>
  );
};

export default ProfilePage;
