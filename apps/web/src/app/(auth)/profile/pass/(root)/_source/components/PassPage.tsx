import { routes } from "@clog/libs";
import Link from "next/link";

const PassPage: React.FC = () => {
  return (
    <div>
      <h1>{routes.profile.pass.label}</h1>
      <h1>{routes.profile.pass.url}</h1>

      <Link href={routes.profile.pass.create.url}>
        {routes.profile.pass.create.label}
      </Link>
    </div>
  );
};

export default PassPage;
