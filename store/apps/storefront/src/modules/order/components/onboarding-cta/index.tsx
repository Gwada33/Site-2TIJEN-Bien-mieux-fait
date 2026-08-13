"use client"

import { resetOnboardingState } from "@lib/data/onboarding"
import { Button, Container, Text } from "@modules/common/components/ui"

const OnboardingCta = ({ orderId }: { orderId: string }) => {
  return (
    <Container className="h-full w-full max-w-4xl border-emeraude/30">
      <div className="flex flex-col items-center gap-y-4 p-4 text-center">
        <Text className="font-display text-xl uppercase tracking-[0.05em] text-ivoire">
          Votre commande test a bien été créée ! 🎉
        </Text>
        <Text className="text-sm text-ivoire/70">
          Vous pouvez maintenant terminer la configuration de votre boutique
          dans l'admin.
        </Text>
        <Button
          className="w-fit"
          size="large"
          onClick={() => resetOnboardingState(orderId)}
        >
          Terminer la config dans l'admin
        </Button>
      </div>
    </Container>
  )
}

export default OnboardingCta
