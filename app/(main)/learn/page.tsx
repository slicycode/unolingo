import { FeedWrapper } from '@/components/feed-wrapper'
import { StickyWrapper } from '@/components/sticky-wrapper'
import { UserProgress } from '@/components/user-progress'
import {
  getCourseProgress,
  getLessonPercentage,
  getUnits,
  getUserProgress,
  getUserSubscription,
} from '@/database/queries'
import { redirect } from 'next/navigation'
import { Header } from './header'
import { Unit } from './unit'

export default async function LearnPage() {
  const userProgressData = getUserProgress()
  const courseProgressData = getCourseProgress()
  const lessonPercentageData = getLessonPercentage()
  const userSubscriptionData = getUserSubscription()
  const unitsData = getUnits()

  const [
    userProgress,
    units,
    courseProgress,
    lessonPercentage,
    userSubscription,
  ] = await Promise.all([
    userProgressData,
    unitsData,
    courseProgressData,
    lessonPercentageData,
    userSubscriptionData,
  ])

  if (!userProgress || !userProgress.activeCourse) redirect('/courses')

  if (!courseProgress) redirect('/courses')

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        <UserProgress
          activeCourse={userProgress.activeCourse}
          hearts={userProgress.hearts}
          points={userProgress.points}
          hasActiveSubscription={!!userSubscription?.isActive}
        />
      </StickyWrapper>
      <FeedWrapper>
        <Header title={userProgress.activeCourse.title} />
        {units.map((unit) => (
          <Unit
            key={unit.id}
            id={unit.id}
            title={unit.title}
            order={unit.order}
            description={unit.description}
            lessons={unit.lessons}
            activeLesson={courseProgress.activeLesson}
            activeLessonPercentage={lessonPercentage}
          />
        ))}
      </FeedWrapper>
    </div>
  )
}
