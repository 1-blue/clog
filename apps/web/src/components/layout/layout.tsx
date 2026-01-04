import Tabbar from "./tabbar";

const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div className="bg-main-50">
      <main className="mx-auto min-h-screen max-w-7xl pb-20">{children}</main>
      <Tabbar />
    </div>
  );
};

export default Layout;
