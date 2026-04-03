import type { components } from "#web/@types/openapi";
import ImageStripLightbox from "#web/components/shared/ImageStripLightbox";

type TGymImage = components["schemas"]["GymImage"];

interface IProps {
  images: TGymImage[];
  gymName: string;
  difficultyImageUrl?: string | null;
}

const GymPhotoTab: React.FC<IProps> = ({
  images,
  gymName,
  difficultyImageUrl,
}) => {
  const sortedImages = [...images].sort((a, b) => a.order - b.order);
  const urls = difficultyImageUrl
    ? [difficultyImageUrl, ...sortedImages.map((img) => img.url)]
    : sortedImages.map((img) => img.url);

  if (urls.length === 0) {
    return (
      <section>
        <p className="py-6 text-center text-sm text-on-surface-variant">
          등록된 사진이 없습니다
        </p>
      </section>
    );
  }

  return (
    <section>
      <ImageStripLightbox
        urls={urls}
        altPrefix={`${gymName} 사진`}
        maxSlots={4}
        className="grid grid-cols-2 gap-3 overflow-visible sm:gap-4"
        thumbClassName="aspect-[4/3] w-full min-h-[9.5rem] sm:min-h-[11rem] rounded-xl"
      />
    </section>
  );
};

export default GymPhotoTab;
