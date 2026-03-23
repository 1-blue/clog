export default function NavLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="flex-1">{children}</main>
      {/* 하단 네비게이션 */}
      <nav className="sticky bottom-0 border-t bg-background">
        <div className="flex h-14 items-center justify-around">
          {/* TODO: 네비게이션 아이템 추가 */}
        </div>
      </nav>
    </>
  );
}
