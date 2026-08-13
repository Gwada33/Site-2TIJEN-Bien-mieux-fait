"use client"

import { useState } from "react"

// Formulaire newsletter : état local uniquement. À brancher sur un
// service d'emails (API route Medusa, Resend, Mailchimp...) à terme.
const NewsletterForm = () => {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "error" | "success">("idle")

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

    if (!valid) {
      setStatus("error")
      return
    }

    setStatus("success")
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex w-full max-w-sm">
        <input
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value)
            setStatus("idle")
          }}
          placeholder="ton@email.com"
          aria-label="Adresse email"
          className="h-11 w-full border-b border-ivoire/30 bg-noir-lift px-3 text-sm text-ivoire placeholder:text-ivoire/50 focus:border-emeraude focus:outline-none"
        />
        <button
          type="submit"
          className="h-11 shrink-0 border-b border-ivoire/30 bg-transparent px-4 font-mono text-xs uppercase tracking-[0.15em] text-ivoire/70 transition-colors hover:border-soleil hover:text-soleil"
        >
          Rejoindre
        </button>
      </div>
      {status === "error" && (
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-brique-clair">
          Email invalide
        </p>
      )}
      {status === "success" && (
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-foret-clair">
          Bienvenue dans le crew. Première sur les drops, zéro spam.
        </p>
      )}
    </form>
  )
}

export default NewsletterForm
