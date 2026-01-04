import { routes } from "@clog/libs";

interface IProps {
  gymId: string;
}

const GymDetailPage: React.FC<IProps> = ({ gymId }) => {
  return (
    <div>
      <h1>{routes.gym.detail.label}</h1>
      <h1>{routes.gym.detail.url(gymId)}</h1>
    </div>
  );
};

export default GymDetailPage;
