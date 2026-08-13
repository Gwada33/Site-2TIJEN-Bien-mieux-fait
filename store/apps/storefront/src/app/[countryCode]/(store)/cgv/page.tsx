import { Metadata } from "next"

import LegalTemplate from "@modules/legal/templates"

export const metadata: Metadata = {
  title: "CGV — 2TIJEN",
}

export default function CGV() {
  return (
    <LegalTemplate
      kicker={"// CGV"}
      title="Conditions générales de vente"
      updatedAt="Août 2026"
      sections={[
        {
          title: "Commandes",
          body: [
            "Les produits sont vendus dans la limite des stocks disponibles. Chaque drop est une édition limitée : aucune commande ne peut excéder le stock affiché.",
            "La commande est validée après confirmation du paiement. Un email de confirmation est envoyé avec le détail de la commande.",
          ],
        },
        {
          title: "Livraison",
          body: [
            "Les commandes sont expédiées depuis la Guadeloupe sous 48h ouvrées.",
            "Livraison offerte dès 120€ d'achat. Les délais de livraison dépendent de la destination.",
          ],
        },
        {
          title: "Retours et échanges",
          body: [
            "Les pièces peuvent être échangées sous 14 jours après réception, si elles sont non portées, non lavées et avec leurs étiquettes.",
            "Les articles marqués en édition limitée (drop) ne sont pas remboursables sauf défaut constaté.",
          ],
        },
      ]}
    />
  )
}