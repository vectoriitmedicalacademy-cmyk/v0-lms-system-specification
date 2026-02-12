"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { Role, User } from "./types"
import { mockUsers } from "./mock-data"

interface AuthContextType {
  user: User | null
  role: Role | null
  login: (role: Role) => void
  logout: () => void
  switchRole: (role: Role) => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  login: () => {},
  logout: () => {},
  switchRole: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<Role | null>(null)

  const login = useCallback((selectedRole: Role) => {
    const found = mockUsers.find(u => u.role === selectedRole)
    if (found) {
      setUser(found)
      setRole(selectedRole)
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setRole(null)
  }, [])

  const switchRole = useCallback((newRole: Role) => {
    const found = mockUsers.find(u => u.role === newRole)
    if (found) {
      setUser(found)
      setRole(newRole)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, role, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
