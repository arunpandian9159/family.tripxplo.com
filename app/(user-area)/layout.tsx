const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Main Content */}
      <main className="flex-1 pb-20 lg:pb-0">{children}</main>
    </div>
  );
};

export default Layout;
