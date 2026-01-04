import { routes } from "@clog/libs";

interface IProps {
  passId: string;
}

const PassEditPage: React.FC<IProps> = ({ passId }) => {
  return (
    <div>
      <h1>{routes.profile.pass.edit.label}</h1>
      <h1>{routes.profile.pass.edit.url(passId)}</h1>
    </div>
  );
};

export default PassEditPage;
