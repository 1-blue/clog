import { routes } from "@clog/libs";
import Link from "next/link";

const AdminPage: React.FC = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <h1>/admin</h1>
        <h1>관리자 대시보드</h1>
      </div>

      <div className="flex flex-col gap-4">
        <Link href={routes.admin.gym.url}>{routes.admin.gym.label}</Link>
        <Link href={routes.admin.community.url}>
          {routes.admin.community.label}
        </Link>
        <Link href={routes.admin.inquiry.url}>
          {routes.admin.inquiry.label}
        </Link>
        <Link href={routes.admin.user.url}>{routes.admin.user.label}</Link>
      </div>
    </div>
  );
};

export default AdminPage;
