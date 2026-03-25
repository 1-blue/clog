import type { components } from "#web/@types/openapi";

type TGymImage = components["schemas"]["GymImage"];

interface IProps {
  images: TGymImage[];
}

const GymPhotosTabContent: React.FC<IProps> = ({ images }) => {
  return (
    <section className="px-6 py-8">
      {images.length > 1 ? (
        <div className="scrollbar-hide flex gap-2 overflow-x-auto">
          {images.map((img) => (
            <div
              key={img.id}
              className="size-28 shrink-0 overflow-hidden rounded-xl sm:size-32"
            >
              <img
                src={img.url}
                alt=""
                className="size-full object-cover"
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="py-6 text-center text-sm text-on-surface-variant">
          추가 사진이 없습니다
        </p>
      )}
    </section>
  );
};

export default GymPhotosTabContent;
