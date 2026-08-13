import { HttpTypes } from "@medusajs/types"
import Image from "next/image"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  return (
    <div className="flex flex-col gap-3">
      {images.map((image, index) => (
        <div
          key={image.id}
          className="relative aspect-[4/5] w-full overflow-hidden bg-transparent"
        >
          {!!image.url && (
            <Image
              src={image.url}
              priority={index <= 1}
              className="absolute inset-0 object-contain object-center p-4"
              alt={`Vue ${index + 1} — ${index === 0 ? "principale" : "détail"}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          )}
        </div>
      ))}
    </div>
  )
}

export default ImageGallery