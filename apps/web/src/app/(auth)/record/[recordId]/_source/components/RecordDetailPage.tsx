import { routes } from "@clog/libs";
import Link from "next/link";

interface IProps {
  recordId: string;
}

const RecordDetailPage: React.FC<IProps> = ({ recordId }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <h1>{routes.record.detail.label}</h1>
        <h1>{routes.record.detail.url(recordId)}</h1>
      </div>

      <div className="flex flex-col gap-2">
        <Link href={routes.record.edit.url(recordId)}>
          {routes.record.edit.label}
        </Link>
      </div>
    </div>
  );
};

export default RecordDetailPage;
