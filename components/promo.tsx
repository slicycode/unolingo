import Image from 'next/image'
import { Button } from './ui/button'
import Link from 'next/link'

export const Promo = () => {
  return (
    <div className="space-y-4 rounded-xl border-2 p-4">
      <div className="space-y-2">
        <div className="flex items-center gap-x-2">
          <Image src="/unlimited.svg" width={26} height={26} alt="Pro" />
          <h3 className="text-lg font-bold">Upgrade to Pro</h3>
        </div>
        <p className="text-muted-foreground">Get unlimited hearts and more!</p>
        <Button asChild variant="super" className="w-full" size="lg">
          <Link href="/shop">Upgrade today</Link>
        </Button>
      </div>
    </div>
  )
}
