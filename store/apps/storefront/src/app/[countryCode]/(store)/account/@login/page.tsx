import { Metadata } from "next"

import LoginTemplate from "@modules/account/templates/login-template"

export const metadata: Metadata = {
  title: "Connexion",
  description: "Connecte-toi à ton compte 2TIJEN.",
}

export default function Login() {
  return <LoginTemplate />
}
