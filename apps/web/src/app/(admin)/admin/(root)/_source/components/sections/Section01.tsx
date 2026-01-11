import Link from "next/link";
import { routes } from "@clog/libs";
import { Button } from "#/src/components/ui/button";

const Section01: React.FC = () => {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-2xl font-bold">관리자 대시보드</h3>

      <Link href={routes.home.url}>
        <Button size="lg" variant="default">
          사용자 모드
        </Button>
      </Link>
    </div>
  );
};

export default Section01;
