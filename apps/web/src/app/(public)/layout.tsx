import BottomBarShell from "#web/components/layout/BottomBarShell";

const PublicLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <BottomBarShell>{children}</BottomBarShell>;
};
export default PublicLayout;
