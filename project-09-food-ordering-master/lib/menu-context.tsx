'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { categories as initialCategories, menuItems as initialMenuItems, type MenuItem, type Category } from './data'

export interface RestaurantInfo {
  name: string
  phone: string
  address: string
  workingHours: string
  sameHoursAllDays: boolean
  weekdayHours: {
    mon: string
    tue: string
    wed: string
    thu: string
    fri: string
    sat: string
    sun: string
  }
  coords: string
}

interface MenuContextType {
  categories: Category[]
  menuItems: MenuItem[]
  restaurantInfo: RestaurantInfo
  // Category operations
  addCategory: (category: Category) => void
  updateCategory: (id: string, category: Partial<Category>) => void
  deleteCategory: (id: string) => void
  reorderCategories: (fromIndex: number, toIndex: number) => void
  // MenuItem operations
  addMenuItem: (item: MenuItem) => void
  updateMenuItem: (id: string, item: Partial<MenuItem>) => void
  deleteMenuItem: (id: string) => void
  toggleItemStop: (id: string) => void
  reorderMenuItems: (fromIndex: number, toIndex: number) => void
  // Restaurant info operations
  updateRestaurantInfo: (info: Partial<RestaurantInfo>) => void
  // Stopped items tracking
  stoppedItems: Set<string>
}

const MenuContext = createContext<MenuContextType | undefined>(undefined)

export function MenuProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems)
  const [stoppedItems, setStoppedItems] = useState<Set<string>>(new Set())
  const [restaurantInfo, setRestaurantInfo] = useState<RestaurantInfo>({
    name: 'MUCHACHO',
    phone: '+7(900) 110-20-03',
    address: 'Большой проспект П.С., 39',
    workingHours: '12:00 - 23:00',
    sameHoursAllDays: true,
    weekdayHours: {
      mon: '12:00 - 23:00',
      tue: '12:00 - 23:00',
      wed: '12:00 - 23:00',
      thu: '12:00 - 23:00',
      fri: '12:00 - 23:00',
      sat: '12:00 - 23:00',
      sun: '12:00 - 23:00'
    },
    coords: '59.960275,30.303612'
  })

  // Category operations
  const addCategory = useCallback((category: Category) => {
    setCategories(prev => [...prev, category])
  }, [])

  const updateCategory = useCallback((id: string, updates: Partial<Category>) => {
    setCategories(prev => prev.map(cat => 
      cat.id === id ? { ...cat, ...updates } : cat
    ))
  }, [])

  const deleteCategory = useCallback((id: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== id))
  }, [])

  const reorderCategories = useCallback((fromIndex: number, toIndex: number) => {
    setCategories(prev => {
      const result = [...prev]
      const [removed] = result.splice(fromIndex, 1)
      result.splice(toIndex, 0, removed)
      return result
    })
  }, [])

  // MenuItem operations
  const addMenuItem = useCallback((item: MenuItem) => {
    setMenuItems(prev => [...prev, item])
  }, [])

  const updateMenuItem = useCallback((id: string, updates: Partial<MenuItem>) => {
    setMenuItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ))
  }, [])

  const deleteMenuItem = useCallback((id: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== id))
  }, [])

  const toggleItemStop = useCallback((id: string) => {
    setStoppedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }, [])

  const reorderMenuItems = useCallback((fromIndex: number, toIndex: number) => {
    setMenuItems(prev => {
      const result = [...prev]
      const [removed] = result.splice(fromIndex, 1)
      result.splice(toIndex, 0, removed)
      return result
    })
  }, [])

  // Restaurant info operations
  const updateRestaurantInfo = useCallback((updates: Partial<RestaurantInfo>) => {
    setRestaurantInfo(prev => ({ ...prev, ...updates }))
  }, [])

  return (
    <MenuContext.Provider
      value={{
        categories,
        menuItems,
        restaurantInfo,
        addCategory,
        updateCategory,
        deleteCategory,
        reorderCategories,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        toggleItemStop,
        reorderMenuItems,
        updateRestaurantInfo,
        stoppedItems,
      }}
    >
      {children}
    </MenuContext.Provider>
  )
}

export function useMenu() {
  const context = useContext(MenuContext)
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider')
  }
  return context
}
