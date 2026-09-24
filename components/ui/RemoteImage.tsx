import Image, { type ImageProps } from "next/image";
import { unsplashLoader, unsplashSrc } from "@/lib/unsplash";

type Props = Omit<ImageProps, "src" | "loader"> & { photo: string };

export default function RemoteImage({ photo, alt, quality = 70, ...rest }: Props) {
  return <Image {...rest} alt={alt} quality={quality} loader={unsplashLoader} src={unsplashSrc(photo)} />;
}
