import { routes } from "@clog/libs";
import Link from "next/link";

const InquiryPage: React.FC = () => {
  return (
    <div>
      <h1>{routes.inquiry.label}</h1>

      <Link href={routes.inquiry.create.url}>
        {routes.inquiry.create.label}
      </Link>
    </div>
  );
};

export default InquiryPage;
