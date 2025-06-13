import { User } from '@/payload-types'
import { FieldAccess } from 'payload'

const rolePriority: Record<User['role'], number> = {
  manager: 1,
  admin: 2,
  owner: 3,
}

export const setAccessRole = (role: User['role']): FieldAccess => (access) => {
  const user = access.req.user;
  const userRole = user?.role;

  if (!userRole) return false

  return rolePriority[userRole] >= rolePriority[role];
}
