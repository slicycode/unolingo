import { auth } from '@clerk/nextjs'

const adminIds = ['user_2dm5hbmIRCv4psa7cPExpxxZQfQ']

export const isAdmin = () => {
  const { userId } = auth()

  if (!userId) {
    return false
  }

  return adminIds.indexOf(userId) !== -1
}
