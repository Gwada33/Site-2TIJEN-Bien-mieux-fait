import { Heading, Text } from "@modules/common/components/ui"

import InteractiveLink from "@modules/common/components/interactive-link"

const EmptyCartMessage = () => {
  return (
    <div
      className="flex flex-col items-start justify-center px-2 py-32"
      data-testid="empty-cart-message"
    >
      <Heading
        level="h1"
        className="font-display text-3xl uppercase text-ivoire small:text-5xl"
      >
        Panier
      </Heading>
      <Text className="mt-4 mb-6 max-w-[32rem] text-sm leading-relaxed text-ivoire/60">
        Ton panier est vide. Clique ci-dessous pour voir les drops en cours —
        chaque pièce est expédiée depuis la Guadeloupe.
      </Text>
      <div>
        <InteractiveLink href="/store">Voir les drops →</InteractiveLink>
      </div>
    </div>
  )
}

export default EmptyCartMessage