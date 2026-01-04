import { routes } from "@clog/libs";
import Link from "next/link";

interface IProps {
  inquiryId: string;
}

const InquiryDetailPage: React.FC<IProps> = ({ inquiryId }) => {
  return (
    <div>
      <h1>{routes.inquiry.detail.label}</h1>
      <p>{routes.inquiry.detail.url(inquiryId)}</p>

      <Link href={routes.inquiry.edit.url(inquiryId)}>
        {routes.inquiry.edit.label}
      </Link>
    </div>
  );
};

export default InquiryDetailPage;
