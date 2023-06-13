import React, { useState, useEffect, createContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, createSession } from '../services/api'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()

  useEffect(() => {
    const recoveredUser = localStorage.getItem('user')
    const token = localStorage.getItem('token')

    if (recoveredUser && token) {
      setUser(JSON.parse(recoveredUser))
      api.defaults.headers.Authorization = `Bearer ${token}`
    }

    setLoading(false)
  },[])

  const login = async (email, password) => {
    const response = await createSession(email, password)

    console.log("login", response.data)
    
    const loggedUser = response.data.user
    const token = response.data.token

    localStorage.setItem("user", JSON.stringify(loggedUser));
    localStorage.setItem("token", token)

    
    api.defaults.headers.Authorization = `Bearer ${token}`

    if (password === 'secret') {
      setUser(loggedUser)  
      navigate('/')
    }
  }

  const logout = () => {
    console.log("logout");
    localStorage.removeItem("user");
    localStorage.removeItem("token")
    api.defaults.headers.Authorization = null
    setUser(null);
    navigate("/login");
  };

  // const authenticated = user !== null;
  //!!user - será uma expressão booleana que verificará se está autenticado
  // let authenticated = false;
  // if (user) {
  //   authenticated = true;
  // }
  
  const authenticated = !!user

  return (
    <AuthContext.Provider value={{ authenticated, loading, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )  
}