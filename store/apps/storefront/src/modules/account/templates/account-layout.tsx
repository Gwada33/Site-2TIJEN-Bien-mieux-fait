import React from "react"

import UnderlineLink from "@modules/common/components/interactive-link"

import AccountNav from "../components/account-nav"
import { HttpTypes } from "@medusajs/types"

interface AccountLayoutProps {
  customer: HttpTypes.StoreCustomer | null
  children: React.ReactNode
}

const AccountLayout: React.FC<AccountLayoutProps> = ({
  customer,
  children,
}) => {
  return (
    <div className="flex-1 small:py-12" data-testid="account-page">
      <div className="mx-auto flex h-full max-w-5xl flex-1 flex-col bg-noir-lift border border-ivoire/10">
        <div className="grid grid-cols-1 small:grid-cols-[240px_1fr] small:py-12">
          <div className="border-b border-ivoire/10 small:border-b-0 small:border-r">
            {customer && <AccountNav customer={customer} />}
          </div>
          <div className="flex-1 px-6 small:px-10">{children}</div>
        </div>
        <div className="flex flex-col items-end justify-between gap-8 border-t border-ivoire/10 py-12 small:flex-row small:px-10">
          <div>
            <h3 className="mb-4 font-display text-lg uppercase text-ivoire">
              Des questions ?
            </h3>
            <span className="text-sm leading-relaxed text-ivoire/60">
              Tu trouveras les réponses aux questions fréquentes sur notre
              page service client.
            </span>
          </div>
          <div>
            <UnderlineLink href="/mentions-legales">Service client</UnderlineLink>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountLayout