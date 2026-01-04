import { routes } from "@clog/libs";
import { Link } from "lucide-react";

const RecordPage: React.FC = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <h1>{routes.record.url}</h1>
        <h1>{routes.record.label}</h1>
      </div>

      <div className="flex flex-col gap-2">
        <Link href={routes.record.create.url}>
          {routes.record.create.label}
        </Link>
      </div>
    </div>
  );
};

export default RecordPage;
