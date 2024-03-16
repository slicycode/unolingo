'use client'

import { courses } from '@/database/schema'
import { Card } from './card'

type Props = {
  courses: (typeof courses.$inferSelect)[]
  activeCourseId: number
}

const List = ({ courses, activeCourseId }: Props) => {
  return (
    <div className="grid grid-cols-2 gap-4 pt-6 lg:grid-cols-[repeat(auto-fill,minmax(210px,1fr))]">
      {courses.map((course) => (
        <Card
          key={course.id}
          id={course.id}
          title={course.title}
          imageSrc={course.imageSrc}
          onClick={() => {}}
          disabled={false}
          active={course.id === activeCourseId}
        />
      ))}
    </div>
  )
}

export default List
