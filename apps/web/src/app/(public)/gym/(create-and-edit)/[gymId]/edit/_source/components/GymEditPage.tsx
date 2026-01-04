import { routes } from "@clog/libs";

interface IProps {
  gymId: string;
}

const GymEditPage: React.FC<IProps> = ({ gymId }) => {
  return (
    <div>
      <h1>{routes.gym.edit.label}</h1>
      <h1>{routes.gym.edit.url(gymId)}</h1>
    </div>
  );
};

export default GymEditPage;
