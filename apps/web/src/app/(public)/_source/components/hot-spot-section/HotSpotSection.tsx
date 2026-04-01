import HotSpotCardList from "./HotSpotCardList";
import HotSpotHeader from "./HotSpotHeader";

const HotSpotSection: React.FC = () => {
  return (
    <section className="flex flex-col gap-4">
      <HotSpotHeader />

      <HotSpotCardList />
    </section>
  );
};

export default HotSpotSection;
