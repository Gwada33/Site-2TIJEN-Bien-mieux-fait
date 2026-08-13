import { Metadata } from "next"

import LegalTemplate from "@modules/legal/templates"

export const metadata: Metadata = {
  title: "Confidentialité — 2TIJEN",
}

export default function Confidentialite() {
  return (
    <LegalTemplate
      kicker={"// Confidentialité"}
      title="Politique de confidentialité"
      updatedAt="Août 2026"
      sections={[
        {
          title: "Données collectées",
          body: [
            "Nous collectons les données nécessaires au traitement des commandes : nom, email, adresse de livraison et informations de paiement (via notre prestataire de paiement).",
            "L'adresse email peut être utilisée pour la newsletter si vous vous êtes inscrit·e — vous pouvez vous désinscrire à tout moment.",
          ],
        },
        {
          title: "Cookies",
          body: [
            "Le site utilise des cookies techniques (panier, session, région) nécessaires au fonctionnement de la boutique.",
          ],
        },
        {
          title: "Vos droits",
          body: [
            "Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles.",
            "Pour toute demande : contact via le formulaire du site ou par email à partir de la page de contact.",
          ],
        },
      ]}
    />
  )
}