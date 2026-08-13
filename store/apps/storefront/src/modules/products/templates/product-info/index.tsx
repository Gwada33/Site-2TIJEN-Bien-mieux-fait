import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <div id="product-info" className="flex flex-col gap-4">
      {product.collection && (
        <LocalizedClientLink
          href={`/collections/${product.collection.handle}`}
          className="kicker hover:text-ivoire"
        >
          {`// ${product.collection.title}`}
        </LocalizedClientLink>
      )}
      <h1
        className="font-display text-3xl uppercase leading-[0.95] text-ivoire small:text-5xl"
        data-testid="product-title"
      >
        {product.title}
      </h1>

      {product.description && (
        <p
          className="max-w-md text-sm leading-relaxed text-ivoire/60"
          data-testid="product-description"
        >
          {product.description}
        </p>
      )}
    </div>
  )
}

export default ProductInfo