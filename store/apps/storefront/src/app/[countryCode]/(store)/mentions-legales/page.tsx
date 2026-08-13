import { Metadata } from "next"

import LegalTemplate from "@modules/legal/templates"

export const metadata: Metadata = {
  title: "Mentions légales — 2TIJEN",
}

export default function MentionsLegales() {
  return (
    <LegalTemplate
      kicker={"// Mentions légales"}
      title="Mentions légales"
      updatedAt="Août 2026"
      sections={[
        {
          title: "Éditeur du site",
          body: [
            "Le site 2TIJEN est édité par la marque 2TIJEN, immatriculée en Guadeloupe.",
            "Directeur de la publication : 2TIJEN.",
          ],
        },
        {
          title: "Hébergement",
          body: [
            "Le site est hébergé par les services cloud Medusa (backend) et la plateforme d'hébergement Next.js du projet.",
          ],
        },
        {
          title: "Propriété intellectuelle",
          body: [
            "L'ensemble des contenus présents sur le site (textes, visuels, logo, pièces) est protégé par le droit de la propriété intellectuelle. Toute reproduction sans autorisation est interdite.",
          ],
        },
      ]}
    />
  )
}