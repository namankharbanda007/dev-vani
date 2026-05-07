import Image from "next/image";
import { resolveGuideImageSrc } from "@/lib/guideImages";

export const EmojiComponent = ({
  personality,
  size = 100,
}: {
  personality: IPersonality;
  size?: number;
}) => {
  return (
    <div
      className="relative overflow-hidden rounded-2xl bg-[#FBF5EA]"
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <Image
        src={resolveGuideImageSrc(personality)}
        alt={personality.title || "Smart Murti guide"}
        fill
        className="object-cover"
        unoptimized
      />
    </div>
  );
};
