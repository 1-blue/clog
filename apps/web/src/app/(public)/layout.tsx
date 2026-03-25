import NavShell from "#web/components/layout/NavShell";

const PublicLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <NavShell>{children}</NavShell>;
};
export default PublicLayout;
