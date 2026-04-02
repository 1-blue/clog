import BottomBarShell from "#web/components/layout/BottomBarShell";

const PublicLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <main className="mx-auto w-full max-w-3xl px-2.5">
      <BottomBarShell>{children}</BottomBarShell>;
    </main>
  );
};
export default PublicLayout;
