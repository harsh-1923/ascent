const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="font-[family-name:var(--font-geist-sans)] w-screen min-h-screen pt-10 sm:pt-20">
      {children}
    </div>
  );
};

export default layout;
