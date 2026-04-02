const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <main className="mx-auto w-full max-w-[1280px] px-4 pt-6 pb-28 sm:px-8 sm:pt-10 sm:pb-32 lg:px-12 lg:pb-40">
      {children}
    </main>
  );
};

export default Layout;
