import { useEffect, useMemo, useState } from 'react'
import { EmptyState } from '../../components/common/EmptyState'
import { LoadingState } from '../../components/common/LoadingState'
import { useAuth } from '../../hooks/useAuth'
import { listUsers, updateUserRoleAndStatus } from '../../lib/firestore'
import type { UserRole, UserStatus } from '../../types'

interface UserRow {
  id: string
  displayName: string
  email: string
  role: UserRole
  status: UserStatus
}

export const AdminUsersPage = () => {
  const { appUser } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [rows, setRows] = useState<UserRow[]>([])
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all')

  const loadUsers = async () => {
    const users = await listUsers()
    setRows(users)
  }

  useEffect(() => {
    let active = true

    const hydrate = async () => {
      const users = await listUsers()
      if (active) {
        setRows(users)
        setIsLoading(false)
      }
    }

    hydrate().catch(() => {
      if (active) {
        setIsLoading(false)
      }
    })

    return () => {
      active = false
    }
  }, [])

  const filteredRows = useMemo(
    () => rows.filter((row) => roleFilter === 'all' || row.role === roleFilter),
    [roleFilter, rows],
  )

  const actor = { id: appUser?.uid ?? '', email: appUser?.email ?? '' }

  const handleUpdate = async (
    row: UserRow,
    role: UserRole,
    status: UserStatus,
  ) => {
    if (appUser?.role !== 'admin') {
      return
    }

    await updateUserRoleAndStatus(row.id, role, status, actor)
    await loadUsers()
  }

  return (
    <section className="space-y-4 rounded-2xl bg-white p-4 shadow-sm">
      <h1 className="text-2xl font-bold text-kassena-green">User Management</h1>
      <p className="text-sm text-slate-600">
        Only admin users can change roles and account status.
      </p>
      <select
        value={roleFilter}
        onChange={(event) =>
          setRoleFilter(event.target.value as typeof roleFilter)
        }
        className="rounded-lg border border-kassena-cream px-3 py-2"
      >
        <option value="all">All roles</option>
        <option value="contributor">Contributor</option>
        <option value="validator">Validator</option>
        <option value="admin">Admin</option>
      </select>

      {isLoading ? (
        <LoadingState />
      ) : filteredRows.length ? (
        <div className="space-y-3">
          {filteredRows.map((row) => (
            <article
              key={row.id}
              className="rounded-lg border border-kassena-cream p-3"
            >
              <p className="font-medium text-kassena-green">
                {row.displayName}
              </p>
              <p className="text-sm text-slate-600">{row.email}</p>
              <div className="mt-2 grid gap-2 md:grid-cols-[1fr_1fr_auto]">
                <select
                  value={row.role}
                  disabled={appUser?.role !== 'admin'}
                  onChange={(event) =>
                    handleUpdate(
                      row,
                      event.target.value as UserRole,
                      row.status,
                    )
                  }
                  className="rounded-lg border border-kassena-cream px-3 py-2 disabled:opacity-60"
                >
                  <option value="contributor">Contributor</option>
                  <option value="validator">Validator</option>
                  <option value="admin">Admin</option>
                </select>
                <select
                  value={row.status}
                  disabled={appUser?.role !== 'admin'}
                  onChange={(event) =>
                    handleUpdate(
                      row,
                      row.role,
                      event.target.value as UserStatus,
                    )
                  }
                  className="rounded-lg border border-kassena-cream px-3 py-2 disabled:opacity-60"
                >
                  <option value="active">Active</option>
                  <option value="disabled">Disabled</option>
                </select>
                <span className="self-center text-sm capitalize text-slate-600">
                  {row.role}
                </span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState message="No users found." />
      )}
    </section>
  )
}
