import type { components } from "#web/@types/openapi";
import ImageStripLightbox from "#web/components/shared/ImageStripLightbox";

type TGymImage = components["schemas"]["GymImage"];

interface IProps {
  images: TGymImage[];
  gymName: string;
}

const GymPhotosTabContent: React.FC<IProps> = ({ images, gymName }) => {
  const urls = [...images]
    .sort((a, b) => a.order - b.order)
    .map((img) => img.url);

  if (urls.length === 0) {
    return (
      <section className="px-6 py-8">
        <p className="py-6 text-center text-sm text-on-surface-variant">
          등록된 사진이 없습니다
        </p>
      </section>
    );
  }

  return (
    <section className="px-6 py-8">
      <ImageStripLightbox
        urls={urls}
        altPrefix={`${gymName} 사진`}
        maxSlots={4}
      />
    </section>
  );
};

export default GymPhotosTabContent;
