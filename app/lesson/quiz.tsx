'use client'

import { upsertChallengeProgress } from '@/actions/challenge-progress'
import { reduceHearts } from '@/actions/user-progress'
import { DEFAULT_HEARTS, MISSING_HEARTS } from '@/constants/hearts'
import {
  challengeOptions,
  challenges,
  userSubscription,
} from '@/database/schema'
import { useHeartsModal } from '@/store/use-hearts-modal'
import { usePracticeModal } from '@/store/use-practice-modal'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import Confetti from 'react-confetti'
import { useAudio, useMount, useWindowSize } from 'react-use'
import { toast } from 'sonner'
import { Challenge } from './challenge'
import { Footer } from './footer'
import { Header } from './header'
import { QuestionBubble } from './question-bubble'
import { ResultCard } from './result-card'

type Props = {
  initialPercentage: number
  initialHearts: number
  initialLessonId: number
  initialLessonChallenges: (typeof challenges.$inferSelect & {
    completed: boolean
    challengeOptions: (typeof challengeOptions.$inferSelect)[]
  })[]
  userSubscription:
    | (typeof userSubscription.$inferSelect & {
        isActive: boolean
      })
    | null
}

export const Quiz = ({
  initialLessonId,
  initialPercentage,
  initialHearts,
  initialLessonChallenges,
  userSubscription,
}: Props) => {
  const { open: openHeartsModal } = useHeartsModal()
  const { open: openPracticeModal } = usePracticeModal()

  useMount(() => {
    if (initialPercentage === 100) {
      openPracticeModal()
    }
  })

  const { width, height } = useWindowSize()
  const [finishAudio] = useAudio({ src: '/finish.mp3', autoPlay: true })
  const [correctAudio, _c, correctControls] = useAudio({ src: '/correct.wav' })
  const [incorrectAudio, _i, incorrectControls] = useAudio({
    src: '/incorrect.wav',
  })
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [lessonId] = useState(initialLessonId)
  const [hearts, setHearts] = useState(initialHearts)
  const [percentage, setPercentage] = useState(() => {
    return initialPercentage === 100 ? 0 : initialPercentage
  })
  const [challenges] = useState(initialLessonChallenges)
  const [activeIndex, setActiveIndex] = useState(() => {
    const uncompletedIndex = challenges.findIndex(
      (challenge) => !challenge.completed,
    )
    return uncompletedIndex === -1 ? 0 : uncompletedIndex
  })
  const [selectedOption, setSelectedOption] = useState<number>()
  const [status, setStatus] = useState<'correct' | 'wrong' | 'none'>('none')

  const challenge = challenges[activeIndex]
  const options = challenge?.challengeOptions ?? []

  if (!challenge) {
    return (
      <>
        {finishAudio}
        <Confetti
          recycle={false}
          numberOfPieces={500}
          tweenDuration={10000}
          width={width}
          height={height}
        />
        <div className="mx-auto flex h-full max-w-lg flex-col items-center justify-center gap-y-4 text-center lg:gap-y-8">
          <Image
            src="/finish.svg"
            className="hidden lg:block"
            width={100}
            height={100}
            alt="finish"
          />
          <Image
            src="/finish.svg"
            className="block lg:hidden"
            width={50}
            height={50}
            alt="finish"
          />
          <h1 className="text-xl font-bold text-neutral-700 lg:text-3xl">
            Great job! <br /> You&apos;ve completed the lesson.
          </h1>
          <div className="flex w-full items-center gap-x-4">
            <ResultCard variant="points" value={challenges.length * 10} />
            <ResultCard variant="hearts" value={hearts} />
          </div>
        </div>
        <Footer
          lessonId={lessonId}
          status="completed"
          onCheck={() => router.push('/learn')}
        />
      </>
    )
  }

  const title =
    challenge.type === 'ASSIST'
      ? 'Select the correct meaning'
      : challenge.question

  const onNext = () => {
    setActiveIndex((current) => current + 1)
  }

  const onSelect = (id: number) => {
    if (status !== 'none') return

    setSelectedOption(id)
  }

  const onContinue = () => {
    if (!selectedOption) return

    if (status === 'wrong') {
      setStatus('none')
      setSelectedOption(undefined)
      return
    }

    if (status === 'correct') {
      onNext()
      setStatus('none')
      setSelectedOption(undefined)
      return
    }

    const correctOption = options.find((option) => option.correct)

    if (correctOption && correctOption.id === selectedOption) {
      startTransition(() => {
        upsertChallengeProgress(challenge.id)
          .then((res) => {
            if (res?.error === MISSING_HEARTS) {
              openHeartsModal()
              return
            }

            correctControls.play()
            setStatus('correct')
            setPercentage((prev) => prev + 100 / challenges.length)

            // Practice mode
            if (initialPercentage === 100) {
              setHearts((prev) => Math.min(prev + 1, DEFAULT_HEARTS))
            }
          })
          .catch(() => {
            toast.error('Something went wrong. Please try again.')
          })
      })
    } else {
      startTransition(() => {
        reduceHearts(challenge.id)
          .then((res) => {
            if (res?.error === MISSING_HEARTS) {
              openHeartsModal()
              return
            }

            incorrectControls.play()
            setStatus('wrong')

            if (!res?.error) setHearts((prev) => Math.max(prev - 1, 0))
          })
          .catch(() => {
            toast.error('Something went wrong. Please try again.')
          })
      })
    }
  }

  return (
    <>
      {incorrectAudio}
      {correctAudio}
      <Header
        hearts={hearts}
        percentage={percentage}
        hasActiveSubscription={!!userSubscription?.isActive}
      />
      <div className="flex-1">
        <div className="flex h-full items-center justify-center">
          <div className="flex w-full flex-col gap-y-12 px-6 lg:min-h-[350px] lg:w-[600px] lg:px-0">
            <h1 className="text-center text-lg font-bold text-neutral-700 lg:text-start lg:text-3xl">
              {title}
            </h1>
            <div>
              {challenge.type === 'ASSIST' && (
                <QuestionBubble question={challenge.question} />
              )}
              <Challenge
                options={options}
                onSelect={onSelect}
                status={status}
                selectedOption={selectedOption}
                disabled={pending}
                type={challenge.type}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer
        disabled={pending || !selectedOption}
        status={status}
        onCheck={onContinue}
      />
    </>
  )
}
