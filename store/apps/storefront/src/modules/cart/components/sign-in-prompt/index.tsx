import { Button, Heading, Text } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const SignInPrompt = () => {
  return (
    <div className="flex items-center justify-between bg-transparent">
      <div>
        <Heading level="h2" className="font-display text-base uppercase text-ivoire">
          Déjà un compte ?
        </Heading>
        <Text className="mt-2 text-sm text-ivoire/70">
          Connecte-toi pour une commande plus rapide.
        </Text>
      </div>
      <div>
        <LocalizedClientLink href="/account">
          <Button variant="secondary" className="h-10" data-testid="sign-in-button">
            Se connecter
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default SignInPrompt