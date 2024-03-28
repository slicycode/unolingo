'use client'

import simpleRestProvider from 'ra-data-simple-rest'
import { Admin, Resource } from 'react-admin'

import { CourseCreate } from './course/create'
import { CourseEdit } from './course/edit'
import { CourseList } from './course/list'

import { UnitCreate } from './unit/create'
import { UnitEdit } from './unit/edit'
import { UnitList } from './unit/list'

import { LessonCreate } from './lesson/create'
import { LessonEdit } from './lesson/edit'
import { LessonList } from './lesson/list'

import { ChallengeCreate } from './challenge/create'
import { ChallengeEdit } from './challenge/edit'
import { ChallengeList } from './challenge/list'

import { ChallengeOptionsCreate } from './challengeOptions/create'
import { ChallengeOptionsEdit } from './challengeOptions/edit'
import { ChallengeOptionsList } from './challengeOptions/list'

const dataProvider = simpleRestProvider('/api')

const App = () => {
  return (
    <Admin dataProvider={dataProvider}>
      <Resource
        name="courses"
        list={CourseList}
        create={CourseCreate}
        edit={CourseEdit}
        recordRepresentation="title"
      />
      <Resource
        name="units"
        list={UnitList}
        create={UnitCreate}
        edit={UnitEdit}
        recordRepresentation="title"
      />
      <Resource
        name="lessons"
        list={LessonList}
        create={LessonCreate}
        edit={LessonEdit}
        recordRepresentation="title"
      />
      <Resource
        name="challenges"
        list={ChallengeList}
        create={ChallengeCreate}
        edit={ChallengeEdit}
        recordRepresentation="question"
      />
      <Resource
        name="challengeOptions"
        list={ChallengeOptionsList}
        create={ChallengeOptionsCreate}
        edit={ChallengeOptionsEdit}
        recordRepresentation="text"
        options={{ label: 'Challenge Options' }}
      />
    </Admin>
  )
}

export default App
