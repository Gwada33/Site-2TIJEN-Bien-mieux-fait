"use client"

import { useActionState } from "react"
import Input from "@modules/common/components/input"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { signup } from "@lib/data/customer"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Register = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(signup, null)

  return (
    <div
      className="flex max-w-sm flex-col items-center"
      data-testid="register-page"
    >
      <h1 className="mb-6 font-display text-2xl uppercase tracking-[0.1em] text-ivoire small:text-3xl">
        Rejoins le crew
      </h1>
      <p className="mb-4 text-center text-sm leading-relaxed text-ivoire/70">
        Crée ton compte 2TIJEN pour une expérience plus rapide : suivi de tes
        commandes, accès aux drops en avant-première.
      </p>
      {message?.state === "verification_required" && (
        <div
          className="mb-4 w-full border border-emeraude/40 bg-emeraude/10 p-4 text-center text-sm text-ivoire"
          data-testid="register-verification-message"
        >
          On t&apos;a envoyé un lien de vérification à{" "}
          <strong className="text-emeraude">{message.email}</strong>. Vérifie
          ta boîte mail pour confirmer, puis connecte-toi.
        </div>
      )}
      <form className="flex w-full flex-col" action={formAction}>
        <div className="flex w-full flex-col gap-y-3">
          <Input
            label="Prénom"
            name="first_name"
            required
            autoComplete="given-name"
            data-testid="first-name-input"
          />
          <Input
            label="Nom"
            name="last_name"
            required
            autoComplete="family-name"
            data-testid="last-name-input"
          />
          <Input
            label="Email"
            name="email"
            required
            type="email"
            autoComplete="email"
            data-testid="email-input"
          />
          <Input
            label="Téléphone"
            name="phone"
            type="tel"
            autoComplete="tel"
            data-testid="phone-input"
          />
          <Input
            label="Mot de passe"
            name="password"
            required
            type="password"
            autoComplete="new-password"
            data-testid="password-input"
          />
        </div>
        <ErrorMessage
          error={message?.state === "error" ? message.error : null}
          data-testid="register-error"
        />
        <span className="mt-6 text-center text-xs leading-relaxed text-ivoire/60">
          En créant un compte, tu acceptes notre{" "}
          <LocalizedClientLink
            href="/confidentialite"
            className="text-emeraude underline hover:text-emeraude-clair"
          >
            politique de confidentialité
          </LocalizedClientLink>{" "}
          et nos{" "}
          <LocalizedClientLink
            href="/cgv"
            className="text-emeraude underline hover:text-emeraude-clair"
          >
            CGV
          </LocalizedClientLink>
          .
        </span>
        <SubmitButton className="mt-6 w-full" data-testid="register-button">
          Créer mon compte
        </SubmitButton>
      </form>
      <span className="mt-6 text-center text-sm text-ivoire/70">
        Déjà membre ?{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
          className="text-emeraude underline hover:text-emeraude-clair"
        >
          Se connecter
        </button>
        .
      </span>
    </div>
  )
}

export default Register