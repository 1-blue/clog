import { prisma } from "@clog/db/prisma";

import AdminPageHeader from "#web/components/admin/AdminPageHeader";
import { Card } from "#web/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "#web/components/ui/table";

import ReviewDeleteButton from "./_source/components/ReviewDeleteButton";

const ReviewsPage = async () => {
  const reviews = await prisma.gymReview.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      rating: true,
      content: true,
      createdAt: true,
      user: { select: { id: true, nickname: true } },
      gym: { select: { id: true, name: true } },
    },
  });

  return (
    <>
      <AdminPageHeader
        title="리뷰 관리"
        description="부적절한 리뷰를 삭제합니다."
      />
      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>암장</TableHead>
              <TableHead>작성자</TableHead>
              <TableHead>평점</TableHead>
              <TableHead>내용</TableHead>
              <TableHead>작성일</TableHead>
              <TableHead className="w-24 text-right">액션</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="text-xs">{r.gym.name}</TableCell>
                <TableCell className="text-xs">{r.user.nickname}</TableCell>
                <TableCell className="text-xs">{r.rating}</TableCell>
                <TableCell className="max-w-sm truncate text-xs">
                  {r.content}
                </TableCell>
                <TableCell className="text-xs">
                  {new Date(r.createdAt).toLocaleDateString("ko-KR")}
                </TableCell>
                <TableCell className="text-right">
                  <ReviewDeleteButton reviewId={r.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </>
  );
};

export default ReviewsPage;
