'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { 
  ArrowLeft, 
  Settings, 
  Edit3, 
  Trash2, 
  GripVertical, 
  Plus, 
  X, 
  MoreVertical,
  StopCircle,
  Check,
  Image as ImageIcon,
  Upload
} from 'lucide-react'
import { useApp } from '@/lib/app-context'
import { useMenu, type RestaurantInfo } from '@/lib/menu-context'
import type { MenuItem, Category } from '@/lib/data'

type EditMode = 'none' | 'info' | 'category' | 'item'

interface EditingItem {
  type: 'category' | 'item'
  id: string | null // null for new items
  data: Partial<MenuItem | Category>
}

export function AdminScreen() {
  const { setCurrentScreen, setIsAdmin } = useApp()
  const { 
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
    stoppedItems
  } = useMenu()

  const [editMode, setEditMode] = useState<EditMode>('none')
  const [editingItem, setEditingItem] = useState<EditingItem | null>(null)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [infoForm, setInfoForm] = useState<RestaurantInfo>(restaurantInfo)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  // Group items by category for display
  const groupedItems = categories.map(cat => ({
    category: cat,
    items: menuItems.filter(item => item.category === cat.slug)
  }))

  // Create flat list for reordering
  type ListItem = { type: 'category'; data: Category } | { type: 'item'; data: MenuItem }
  const flatList: ListItem[] = []
  groupedItems.forEach(group => {
    flatList.push({ type: 'category', data: group.category })
    group.items.forEach(item => {
      flatList.push({ type: 'item', data: item })
    })
  })

  const handleBackToMenu = () => {
    setIsAdmin(false)
    setCurrentScreen('menu')
  }

  const handleEditInfo = () => {
    setInfoForm(restaurantInfo)
    setEditMode('info')
  }

  const handleSaveInfo = () => {
    updateRestaurantInfo(infoForm)
    setEditMode('none')
  }

  const handleMenuAction = (action: 'edit' | 'stop' | 'delete', type: 'category' | 'item', id: string) => {
    setActiveMenu(null)
    
    if (action === 'edit') {
      if (type === 'category') {
        const category = categories.find(c => c.id === id)
        if (category) {
          setEditingItem({ type: 'category', id, data: { ...category } })
          setEditMode('category')
        }
      } else {
        const item = menuItems.find(i => i.id === id)
        if (item) {
          setEditingItem({ type: 'item', id, data: { ...item } })
          setSelectedImage(item.image_url)
          setEditMode('item')
        }
      }
    } else if (action === 'stop' && type === 'item') {
      toggleItemStop(id)
    } else if (action === 'delete') {
      if (type === 'category') {
        deleteCategory(id)
      } else {
        deleteMenuItem(id)
      }
    }
  }

  const handleAddCategory = () => {
    setEditingItem({
      type: 'category',
      id: null,
      data: { name: '', slug: '' }
    })
    setEditMode('category')
  }

  const handleAddItem = () => {
    setEditingItem({
      type: 'item',
      id: null,
      data: {
        name: '',
        description: '',
        price: 0,
        calories: 0,
        proteins: 0,
        fats: 0,
        carbs: 0,
        dishNutrition: { calories: 0, proteins: 0, fats: 0, carbs: 0 },
        image_url: '',
        category: categories[0]?.slug || '',
        weight: ''
      }
    })
    setSelectedImage(null)
    setEditMode('item')
  }

  const handleSaveCategory = () => {
    if (!editingItem || editingItem.type !== 'category') return
    const data = editingItem.data as Partial<Category>
    
    if (editingItem.id) {
      updateCategory(editingItem.id, data)
    } else {
      const newCategory: Category = {
        id: Date.now().toString(),
        name: data.name || '',
        slug: data.name?.toLowerCase().replace(/\s+/g, '-') || ''
      }
      addCategory(newCategory)
    }
    setEditMode('none')
    setEditingItem(null)
  }

  const handleSaveItem = () => {
    if (!editingItem || editingItem.type !== 'item') return
    const data = editingItem.data as Partial<MenuItem>
    
    if (editingItem.id) {
      updateMenuItem(editingItem.id, { ...data, image_url: selectedImage || data.image_url })
    } else {
      const newItem: MenuItem = {
        id: Date.now().toString(),
        name: data.name || '',
        description: data.description || '',
        price: data.price || 0,
        calories: data.calories || 0,
        proteins: data.proteins || 0,
        fats: data.fats || 0,
        carbs: data.carbs || 0,
        dishNutrition: data.dishNutrition || { calories: 0, proteins: 0, fats: 0, carbs: 0 },
        image_url: selectedImage || '',
        category: data.category || categories[0]?.slug || '',
        weight: data.weight
      }
      addMenuItem(newItem)
    }
    setEditMode('none')
    setEditingItem(null)
    setSelectedImage(null)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Render edit info form
  if (editMode === 'info') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => setEditMode('none')}
              className="w-10 h-10 flex items-center justify-center bg-[#1a1a1a] rounded-lg border border-[#333]"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-xl font-bold text-white">Редактировать информацию</h1>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-[#a1a1aa] mb-2">Название заведения</label>
              <input
                type="text"
                value={infoForm.name}
                onChange={(e) => setInfoForm({ ...infoForm, name: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
            <div>
              <label className="block text-sm text-[#a1a1aa] mb-2">Телефон</label>
              <input
                type="tel"
                value={infoForm.phone}
                onChange={(e) => setInfoForm({ ...infoForm, phone: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
            <div>
              <label className="block text-sm text-[#a1a1aa] mb-2">Адрес</label>
              <input
                type="text"
                value={infoForm.address}
                onChange={(e) => setInfoForm({ ...infoForm, address: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
            <div>
              <label className="block text-sm text-[#a1a1aa] mb-2">Часы работы</label>
              <input
                type="text"
                value={infoForm.workingHours}
                onChange={(e) => setInfoForm({ ...infoForm, workingHours: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
            <div>
              <label className="block text-sm text-[#a1a1aa] mb-2">Координаты (широта,долгота)</label>
              <input
                type="text"
                value={infoForm.coords}
                onChange={(e) => setInfoForm({ ...infoForm, coords: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <button
            onClick={handleSaveInfo}
            className="w-full mt-6 bg-[#D4AF37] text-black py-4 rounded-xl font-semibold flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5" />
            Сохранить
          </button>
        </div>
      </div>
    )
  }

  // Render edit category form
  if (editMode === 'category' && editingItem) {
    const data = editingItem.data as Partial<Category>
    return (
      <div className="min-h-screen bg-[#0a0a0a] px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => { setEditMode('none'); setEditingItem(null) }}
              className="w-10 h-10 flex items-center justify-center bg-[#1a1a1a] rounded-lg border border-[#333]"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-xl font-bold text-white">
              {editingItem.id ? 'Редактировать категорию' : 'Новая категория'}
            </h1>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-[#a1a1aa] mb-2">Название категории *</label>
              <input
                type="text"
                value={data.name || ''}
                onChange={(e) => setEditingItem({ ...editingItem, data: { ...data, name: e.target.value } })}
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
                placeholder="Например: Десерты"
              />
            </div>
          </div>

          <button
            onClick={handleSaveCategory}
            disabled={!data.name}
            className="w-full mt-6 bg-[#D4AF37] text-black py-4 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check className="w-5 h-5" />
            Сохранить
          </button>
        </div>
      </div>
    )
  }

  // Render edit item form
  if (editMode === 'item' && editingItem) {
    const data = editingItem.data as Partial<MenuItem>
    return (
      <div className="min-h-screen bg-[#0a0a0a] px-4 py-6 pb-24">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => { setEditMode('none'); setEditingItem(null); setSelectedImage(null) }}
                className="w-10 h-10 flex items-center justify-center bg-[#1a1a1a] rounded-lg border border-[#333]"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <h1 className="text-xl font-bold text-white">
                {editingItem.id ? 'Редактировать блюдо' : 'Новое блюдо'}
              </h1>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-[#a1a1aa] mb-2">Название *</label>
              <input
                type="text"
                value={data.name || ''}
                onChange={(e) => setEditingItem({ ...editingItem, data: { ...data, name: e.target.value } })}
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-sm text-[#a1a1aa] mb-2">Описание</label>
              <textarea
                value={data.description || ''}
                onChange={(e) => setEditingItem({ ...editingItem, data: { ...data, description: e.target.value } })}
                rows={3}
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#a1a1aa] mb-2">Размер порции</label>
                <input
                  type="text"
                  value={data.weight || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, data: { ...data, weight: e.target.value } })}
                  placeholder="250г"
                  className="w-full bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-sm text-[#a1a1aa] mb-2">Стоимость, руб. *</label>
                <input
                  type="number"
                  value={data.price || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, data: { ...data, price: Number(e.target.value) } })}
                  className="w-full bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-[#a1a1aa] mb-2">Раздел *</label>
              <select
                value={data.category || ''}
                onChange={(e) => setEditingItem({ ...editingItem, data: { ...data, category: e.target.value } })}
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.slug}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="pt-4 border-t border-[#333]">
              <h3 className="text-white font-semibold mb-4">Пищевая ценность на 100г</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#a1a1aa] mb-2">Энергетическая ценность, кКал</label>
                  <input
                    type="number"
                    value={data.calories || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, data: { ...data, calories: Number(e.target.value) } })}
                    className="w-full bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#a1a1aa] mb-2">Белки, грамм</label>
                  <input
                    type="number"
                    value={data.proteins || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, data: { ...data, proteins: Number(e.target.value) } })}
                    className="w-full bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#a1a1aa] mb-2">Жиры, грамм</label>
                  <input
                    type="number"
                    value={data.fats || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, data: { ...data, fats: Number(e.target.value) } })}
                    className="w-full bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#a1a1aa] mb-2">Углеводы, грамм</label>
                  <input
                    type="number"
                    value={data.carbs || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, data: { ...data, carbs: Number(e.target.value) } })}
                    className="w-full bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#333]">
              <h3 className="text-white font-semibold mb-4">Фотография</h3>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              
              {selectedImage ? (
                <div className="relative">
                  <img
                    src={selectedImage}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-xl"
                  />
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 bg-[#D4AF37] text-black py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Изменить фото
                    </button>
                    <button
                      onClick={() => setSelectedImage(null)}
                      className="flex-1 bg-red-500/20 text-red-400 py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Удалить фото
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-48 border-2 border-dashed border-[#333] rounded-xl flex flex-col items-center justify-center text-[#666] hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors"
                >
                  <ImageIcon className="w-12 h-12 mb-2" />
                  <span>Нажмите для загрузки</span>
                </button>
              )}
            </div>
          </div>

          <button
            onClick={handleSaveItem}
            disabled={!data.name || !data.price}
            className="w-full mt-6 bg-[#D4AF37] text-black py-4 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check className="w-5 h-5" />
            Сохранить
          </button>
        </div>
      </div>
    )
  }

  // Main admin view
  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#0a0a0a] border-b border-[#222] px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBackToMenu}
              className="w-10 h-10 flex items-center justify-center bg-[#1a1a1a] rounded-lg border border-[#333] hover:border-[#D4AF37] transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-white">{restaurantInfo.name}</h1>
              <p className="text-xs text-[#666]">{restaurantInfo.workingHours} | {restaurantInfo.address}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Info Button */}
      <div className="max-w-2xl mx-auto px-4 py-4">
        <button
          onClick={handleEditInfo}
          className="w-full bg-[#D4AF37] text-black py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
        >
          <Edit3 className="w-4 h-4" />
          Редактировать информацию
        </button>
      </div>

      {/* Menu List */}
      <div className="max-w-2xl mx-auto px-4">
        {groupedItems.map((group) => (
          <div key={group.category.id} className="mb-4">
            {/* Category Header */}
            <div className="flex items-center justify-between bg-[#1a1a1a] rounded-xl px-4 py-3 mb-2">
              <div className="flex items-center gap-3">
                <GripVertical className="w-5 h-5 text-[#666] cursor-grab" />
                <span className="font-semibold text-white">{group.category.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <button
                    onClick={() => setActiveMenu(activeMenu === `cat-${group.category.id}` ? null : `cat-${group.category.id}`)}
                    className="w-8 h-8 flex items-center justify-center text-[#666] hover:text-white"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  <AnimatePresence>
                    {activeMenu === `cat-${group.category.id}` && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute right-0 top-10 z-50 bg-[#1a1a1a] border border-[#333] rounded-xl shadow-xl overflow-hidden min-w-[200px]"
                      >
                        <button
                          onClick={() => handleMenuAction('edit', 'category', group.category.id)}
                          className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-[#252525] text-left"
                        >
                          <Edit3 className="w-4 h-4" />
                          Редактировать
                        </button>
                        <button
                          onClick={() => handleMenuAction('delete', 'category', group.category.id)}
                          className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-[#252525] text-left"
                        >
                          <Trash2 className="w-4 h-4" />
                          Удалить
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <GripVertical className="w-5 h-5 text-[#666] cursor-grab" />
              </div>
            </div>

            {/* Items in Category */}
            {group.items.map((item) => (
              <div
                key={item.id}
                className={`flex items-center justify-between bg-[#FFF8E7] rounded-xl px-4 py-3 mb-2 ${
                  stoppedItems.has(item.id) ? 'opacity-50' : ''
                }`}
              >
                <div className="flex items-center gap-3 flex-1">
                  <GripVertical className="w-5 h-5 text-[#999] cursor-grab" />
                  <div className="flex-1">
                    <span className="font-medium text-black">{item.name}</span>
                    {stoppedItems.has(item.id) && (
                      <span className="ml-2 text-xs bg-red-500/20 text-red-600 px-2 py-0.5 rounded">СТОП</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-black font-semibold">{item.price} P</span>
                  <div className="relative">
                    <button
                      onClick={() => setActiveMenu(activeMenu === `item-${item.id}` ? null : `item-${item.id}`)}
                      className="w-8 h-8 flex items-center justify-center text-[#999] hover:text-black"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    <AnimatePresence>
                      {activeMenu === `item-${item.id}` && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="absolute right-0 top-10 z-50 bg-[#1a1a1a] border border-[#333] rounded-xl shadow-xl overflow-hidden min-w-[200px]"
                        >
                          <div className="px-4 py-2 border-b border-[#333]">
                            <span className="text-white font-medium text-sm">{item.name}</span>
                          </div>
                          <button
                            onClick={() => handleMenuAction('edit', 'item', item.id)}
                            className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-[#252525] text-left"
                          >
                            <Edit3 className="w-4 h-4" />
                            Редактировать позицию
                          </button>
                          <button
                            onClick={() => handleMenuAction('stop', 'item', item.id)}
                            className="w-full flex items-center gap-3 px-4 py-3 text-yellow-400 hover:bg-[#252525] text-left"
                          >
                            <StopCircle className="w-4 h-4" />
                            {stoppedItems.has(item.id) ? 'Снять со стопа' : 'Поставить на стоп'}
                          </button>
                          <button
                            onClick={() => handleMenuAction('delete', 'item', item.id)}
                            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-[#252525] text-left"
                          >
                            <Trash2 className="w-4 h-4" />
                            Удалить позицию
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <GripVertical className="w-5 h-5 text-[#999] cursor-grab" />
                </div>
              </div>
            ))}
          </div>
        ))}

        {/* Add Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleAddCategory}
            className="flex-1 bg-[#1a1a1a] border border-[#D4AF37] text-[#D4AF37] py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Добавить подраздел
          </button>
          <button
            onClick={handleAddItem}
            className="flex-1 bg-[#D4AF37] text-black py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Добавить позицию
          </button>
        </div>
      </div>

      {/* Click outside to close menu */}
      {activeMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setActiveMenu(null)}
        />
      )}
    </div>
  )
}
