import { createContext, useContext, useEffect, useState } from 'react'
import { LoadingScreen } from '../components/ui/designSystem'
import { storageService } from '../services/storageService'
import { extractAuthenticationData } from '../utils/decodeJwt'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = storageService.getToken()
    if (token) {
      const { isValid, payload } = extractAuthenticationData(token)
      if (isValid) {
        const savedRole = localStorage.getItem('payedu_user_role')
        setUser({ role: savedRole || payload.role, sub: payload.sub })
      } else {
        storageService.removeToken()
        localStorage.removeItem('payedu_user_role')
      }
    }
    setIsLoading(false)
  }, [])

  const storeAuthenticationData = (token, role) => {
    storageService.setToken(token)
    localStorage.setItem('payedu_user_role', role)
    const { payload } = extractAuthenticationData(token)
    setUser({ role, sub: payload?.sub })
  }

  const removeAuthenticationData = () => {
    storageService.removeToken()
    localStorage.removeItem('payedu_user_role')
    setUser(null)
  }

  const value = {
    user,
    isAuthenticated: !!user,
    storeAuthenticationData,
    removeAuthenticationData,
  }

  if (isLoading) {
    return <LoadingScreen title="Chargement de votre espace" description="Récupération des informations d’authentification…" />
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider")
  }
  return context
}
