'use client'

import { refillHearts } from '@/actions/user-progress'
import { Button } from '@/components/ui/button'
import { DEFAULT_HEARTS, POINTS_TO_REFILL_HEARTS } from '@/constants/hearts'
import Image from 'next/image'
import { useTransition } from 'react'
import { toast } from 'sonner'

type Props = {
  hearts: number
  points: number
  hasActiveSubscription: boolean
}

export const Items = ({ hearts, points, hasActiveSubscription }: Props) => {
  const [pending, startTransition] = useTransition()

  const isDisabled =
    pending || hearts === DEFAULT_HEARTS || points < POINTS_TO_REFILL_HEARTS

  const onRefillHearts = () => {
    if (isDisabled) return

    startTransition(() => {
      refillHearts().catch(() => toast.error('Failed to refill hearts'))
    })
  }

  return (
    <ul className="w-full">
      <div className="flex w-full items-center gap-x-4 border-t-2 p-4">
        <Image src="/heart.svg" width={60} height={60} alt="Heart" />
        <div className="flex-1">
          <p className="text-base font-bold text-neutral-700 lg:text-xl">
            Refill hearts
          </p>
        </div>
        <Button onClick={onRefillHearts} disabled={isDisabled}>
          {hearts === DEFAULT_HEARTS ? (
            'full'
          ) : (
            <div className="flex items-center">
              <Image src="/points.svg" width={20} height={20} alt="Points" />
              <p>{POINTS_TO_REFILL_HEARTS}</p>
            </div>
          )}
        </Button>
      </div>
    </ul>
  )
}
