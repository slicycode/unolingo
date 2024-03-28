import { FeedWrapper } from '@/components/feed-wrapper'
import { StickyWrapper } from '@/components/sticky-wrapper'
import { UserProgress } from '@/components/user-progress'
import { getUserProgress } from '@/database/queries'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { Items } from './items'

const ShopPage = async () => {
  const userProgressData = getUserProgress()

  const [userProgress] = await Promise.all([userProgressData])

  if (!userProgress || !userProgress.activeCourse) redirect('/courses')

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        <UserProgress
          activeCourse={userProgress.activeCourse}
          hearts={userProgress.hearts}
          points={userProgress.points}
          hasActiveSubscription={false}
        />
      </StickyWrapper>
      <FeedWrapper>
        <div className="flex w-full flex-col items-center">
          <Image src="/shop.svg" width={90} height={90} alt="Shop" />
          <h1 className="my-6 text-center text-2xl font-bold text-neutral-800">
            Shop
          </h1>
          <p className="mb-6 text-center text-lg text-muted-foreground">
            Spend your points on hearts, points, and more in the shop.
          </p>
          <Items
            hearts={userProgress.hearts}
            points={userProgress.points}
            hasActiveSubscription={false}
          />
        </div>
      </FeedWrapper>
    </div>
  )
}

export default ShopPage
