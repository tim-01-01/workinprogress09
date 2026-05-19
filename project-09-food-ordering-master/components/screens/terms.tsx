'use client'

import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useApp } from '@/lib/app-context'

export function TermsScreen() {
  const { setCurrentScreen } = useApp()

  return (
    <div className="min-h-screen flex flex-col px-4 sm:px-6 py-6 sm:py-8 max-w-2xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8"
      >
        <button
          onClick={() => setCurrentScreen('auth-phone')}
          className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-[#1a1a1a] rounded-lg border border-[#333] hover:border-[#D4AF37] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </button>
        <h1 className="text-xl sm:text-2xl font-bold text-white">Условия использования</h1>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="prose prose-invert max-w-none"
      >
        <div className="bg-[#1a1a1a] rounded-xl p-4 sm:p-6 border border-[#333] space-y-4 text-sm sm:text-base text-[#a1a1aa]">
          <section>
            <h2 className="text-lg sm:text-xl font-bold text-white mb-3">1. Общие положения</h2>
            <p>
              Настоящие Условия использования регулируют порядок использования мобильного приложения 
              MUCHACHO для заказа блюд и напитков в нашем заведении.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-bold text-white mb-3">2. Регистрация и авторизация</h2>
            <p>
              Для использования приложения необходимо пройти авторизацию по номеру телефона. 
              Вы соглашаетесь предоставить достоверную информацию при регистрации.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-bold text-white mb-3">3. Заказ и оплата</h2>
            <p>
              При оформлении заказа вы соглашаетесь с текущими ценами, представленными в меню. 
              Оплата производится непосредственно в заведении после получения заказа.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-bold text-white mb-3">4. Персональные данные</h2>
            <p>
              Мы обрабатываем ваши персональные данные (номер телефона, имя, дата рождения, email) 
              в соответствии с законодательством РФ о защите персональных данных. 
              Данные используются исключительно для обработки заказов и улучшения качества обслуживания.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-bold text-white mb-3">5. Ответственность</h2>
            <p>
              Заведение оставляет за собой право изменять меню, цены и условия обслуживания. 
              В случае возникновения спорных ситуаций, пожалуйста, обращайтесь к администрации заведения.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-bold text-white mb-3">6. Контакты</h2>
            <p>
              По всем вопросам вы можете связаться с нами по телефону +7(900)110-20-03 
              или посетить наше заведение по адресу: Большой проспект П.С., 39.
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  )
}
