import Link from "next/link";
import { Building2, MessageCircle, User } from "lucide-react";
import { routes } from "@clog/libs";
import { cn } from "@clog/libs";

type TManagementType = "gym" | "user" | "community";

interface ManagementCard {
  type: TManagementType;
  title: string;
  subtitle: string;
  route: { label: string; url: string };
  icon: React.ComponentType<{ className?: string }>;
  colors: {
    bg: string;
    icon: string;
    link: string;
  };
}

const managementCards: ManagementCard[] = [
  {
    type: "gym",
    title: "암장 관리",
    subtitle: "암장 정보 추가, 수정, 삭제",
    route: routes.admin.gym,
    icon: Building2,
    colors: {
      bg: "bg-blue-50",
      icon: "text-blue-600",
      link: "text-blue-600",
    },
  },
  {
    type: "user",
    title: "사용자 관리",
    subtitle: "사용자 정보 조회 및 관리",
    route: routes.admin.user,
    icon: User,
    colors: {
      bg: "bg-green-50",
      icon: "text-green-600",
      link: "text-green-600",
    },
  },
  {
    type: "community",
    title: "커뮤니티 관리",
    subtitle: "게시글 및 댓글 관리",
    route: routes.admin.community,
    icon: MessageCircle,
    colors: {
      bg: "bg-purple-50",
      icon: "text-purple-600",
      link: "text-purple-600",
    },
  },
];

const Section03: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {managementCards.map((card) => {
        const IconComponent = card.icon;
        return (
          <Link
            key={card.type}
            href={card.route.url}
            className="clog-section hover:shadow-md"
          >
            <div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-lg",
                card.colors.bg
              )}
            >
              <IconComponent className={cn("size-6", card.colors.icon)} />
            </div>

            <div className="flex flex-col gap-1">
              <h3 className="text-xl font-bold">{card.title}</h3>
              <p className="text-sm text-gray-500">{card.subtitle}</p>
            </div>

            <div className={cn("text-sm font-medium", card.colors.link)}>
              관리하기 →
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default Section03;
