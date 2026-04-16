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

import PostDeleteButton from "./_source/components/PostDeleteButton";

const PostsPage = async () => {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      title: true,
      category: true,
      createdAt: true,
      author: { select: { id: true, nickname: true } },
    },
  });

  return (
    <>
      <AdminPageHeader
        title="게시글 관리"
        description="부적절한 게시글을 삭제합니다."
      />
      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>제목</TableHead>
              <TableHead>카테고리</TableHead>
              <TableHead>작성자</TableHead>
              <TableHead>작성일</TableHead>
              <TableHead className="w-24 text-right">액션</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="max-w-xs truncate">{p.title}</TableCell>
                <TableCell className="text-xs">{p.category}</TableCell>
                <TableCell className="text-xs">{p.author.nickname}</TableCell>
                <TableCell className="text-xs">
                  {new Date(p.createdAt).toLocaleDateString("ko-KR")}
                </TableCell>
                <TableCell className="text-right">
                  <PostDeleteButton postId={p.id} title={p.title} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </>
  );
};

export default PostsPage;
