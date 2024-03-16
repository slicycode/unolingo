import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'
import Image from 'next/image'

type Props = {
  title: string
  id: number
  imageSrc: string
  onClick: (id: number) => void
  disabled?: boolean
  active?: boolean
}

export const Card = ({
  title,
  id,
  imageSrc,
  onClick,
  disabled,
  active,
}: Props) => {
  return (
    <div
      onClick={() => onClick(id)}
      className={cn(
        'flex h-full min-h-[217px] min-w-[200px] cursor-pointer flex-col items-center justify-between rounded-xl border-2 border-b-4 p-3 pb-6 hover:bg-black/5 active:border-2',
        disabled && 'pointer-events-none opacity-50',
        active && 'border-green-600',
      )}
    >
      <div className="flex min-h-[24px] w-full items-center justify-end">
        {active ? (
          <div className="flex items-center justify-center rounded-md bg-green-600 p-1.5">
            <Check className="h-4 w-4 stroke-[4] text-white" />
          </div>
        ) : null}
      </div>
      <Image
        src={imageSrc}
        alt={title}
        width={93.33}
        height={70}
        className="rounded-lg border object-cover drop-shadow-md"
      />
      <p className="mt-3 text-center font-bold text-neutral-700">{title}</p>
    </div>
  )
}
