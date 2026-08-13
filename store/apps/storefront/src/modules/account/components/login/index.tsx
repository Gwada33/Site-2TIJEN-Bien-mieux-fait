import { login } from "@lib/data/customer"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import { useActionState } from "react"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Login = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(login, null)

  return (
    <div
      className="flex w-full max-w-sm flex-col items-center"
      data-testid="login-page"
    >
      <h1 className="mb-6 font-display text-2xl uppercase tracking-[0.1em] text-ivoire small:text-3xl">
        Bon retour
      </h1>
      <p className="mb-8 text-center text-sm leading-relaxed text-ivoire/70">
        Connecte-toi pour retrouver tes commandes et accéder aux drops en
        avant-première.
      </p>
      {message?.state === "verification_required" && (
        <div
          className="mb-6 w-full border border-emeraude/40 bg-emeraude/10 p-4 text-center text-sm text-ivoire"
          data-testid="login-verification-message"
        >
          On t&apos;a envoyé un lien de vérification à{" "}
          <strong className="text-emeraude">{message.email}</strong>. Vérifie
          ta boîte mail, puis connecte-toi.
        </div>
      )}
      <form className="w-full" action={formAction}>
        <div className="flex w-full flex-col gap-y-3">
          <Input
            label="Email"
            name="email"
            type="email"
            title="Entre une adresse email valide."
            autoComplete="email"
            required
            data-testid="email-input"
          />
          <Input
            label="Mot de passe"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            data-testid="password-input"
          />
        </div>
        <ErrorMessage
          error={message?.state === "error" ? message.error : null}
          data-testid="login-error-message"
        />
        <SubmitButton data-testid="sign-in-button" className="mt-6 w-full">
          Se connecter
        </SubmitButton>
      </form>
      <span className="mt-6 text-center text-sm text-ivoire/70">
        Pas encore membre ?{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
          className="text-emeraude underline hover:text-emeraude-clair"
          data-testid="register-button"
        >
          Rejoindre
        </button>
        .
      </span>
    </div>
  )
}

export default Login