import React from 'react'
import { createContext, useState, useContext } from 'react'
import { jwtDecode } from "jwt-decode";

import { getCookie } from './../Lib/auth'

type AuthContextProps = {
  children: React.ReactNode
}
type userTypeProps = {
  name: string
  unique_name: string
  role: String
}
type Authype = {
  user: userTypeProps
  login: any
}

const AuthContext = createContext<Authype | any>(null)
export const AuthProvider = ({ children }: AuthContextProps) => {
  const token = getCookie('token')
  console.log("Token",token)

  let LoggedInUser = token ? jwtDecode(token) : {}
  const [user, setUser] = useState<any>(LoggedInUser || {})

  const login = (user: any) => {
    setUser(user)
  }

  return (
    <AuthContext.Provider
      value={{ user, login }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}