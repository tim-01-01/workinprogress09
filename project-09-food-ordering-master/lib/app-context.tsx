'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

export type Screen = 'auth-phone' | 'auth-code' | 'menu' | 'cart' | 'order-status' | 'profile' | 'order-history' | 'terms' | 'admin'
export type OrderType = 'dine-in' | 'takeaway'

interface Order {
  id: string
  items: Array<{ name: string; quantity: number; price: number }>
  total: number
  type: OrderType
  status: 'accepted' | 'preparing' | 'ready'
  orderNumber: number
  date?: string
}

export interface HistoryOrder extends Order {
  date: string
}

interface UserProfile {
  name: string
  birthday: string
  email: string
}

interface AppContextType {
  currentScreen: Screen
  setCurrentScreen: (screen: Screen) => void
  phone: string
  setPhone: (phone: string) => void
  isAuthenticated: boolean
  setIsAuthenticated: (value: boolean) => void
  orderType: OrderType
  setOrderType: (type: OrderType) => void
  currentOrder: Order | null
  setCurrentOrder: (order: Order | null) => void
  userProfile: UserProfile
  setUserProfile: (profile: UserProfile) => void
  orderHistory: HistoryOrder[]
  addToOrderHistory: (order: HistoryOrder) => void
  isAdmin: boolean
  setIsAdmin: (value: boolean) => void
}

// Restaurant constants
export const RESTAURANT_PHONE = '+7(900)110-20-03'
export const RESTAURANT_ADDRESS = 'Большой проспект П.С., 39'
export const RESTAURANT_COORDS = '59.960275,30.303612' // St. Petersburg coordinates

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentScreen, setCurrentScreen] = useState<Screen>('auth-phone')
  const [phone, setPhone] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [orderType, setOrderType] = useState<OrderType>('dine-in')
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile>({ name: '', birthday: '', email: '' })
  const [orderHistory, setOrderHistory] = useState<HistoryOrder[]>([])
  const [isAdmin, setIsAdmin] = useState(false)

  const addToOrderHistory = useCallback((order: HistoryOrder) => {
    setOrderHistory(prev => [order, ...prev])
  }, [])

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        phone,
        setPhone,
        isAuthenticated,
        setIsAuthenticated,
        orderType,
        setOrderType,
        currentOrder,
        setCurrentOrder,
        userProfile,
        setUserProfile,
        orderHistory,
        addToOrderHistory,
        isAdmin,
        setIsAdmin,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
