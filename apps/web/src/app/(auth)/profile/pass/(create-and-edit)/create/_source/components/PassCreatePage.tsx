import { routes } from "@clog/libs";

const PassCreatePage: React.FC = () => {
  return (
    <div>
      <h1>{routes.profile.pass.create.label}</h1>
      <h1>{routes.profile.pass.create.url}</h1>
    </div>
  );
};

export default PassCreatePage;
