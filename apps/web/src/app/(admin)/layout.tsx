import AdminShell from "#web/components/admin/AdminShell";
import { requireAdminPage } from "#web/libs/auth/requireAdminPage";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  await requireAdminPage();
  return <AdminShell>{children}</AdminShell>;
};

export default AdminLayout;
