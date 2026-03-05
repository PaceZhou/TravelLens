import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import translationsZhEn from '../locales/translations.json'
import translationsRu from '../locales/ru.json'
import translationsIt from '../locales/it.json'
import translationsAr from '../locales/ar.json'

type Language = 'zh' | 'en' | 'ru' | 'it' | 'ar'

const allTranslations = {
  ...translationsZhEn,
  ...translationsRu,
  ...translationsIt,
  ...translationsAr
}

interface LanguageContextType {
  lang: Language
  switchLanguage: (newLang: Language) => void
  t: any
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('zh')

  useEffect(() => {
    const saved = localStorage.getItem('language') as Language
    if (saved && ['zh', 'en', 'ru', 'it', 'ar'].includes(saved)) {
      setLang(saved)
    }
  }, [])

  const switchLanguage = (newLang: Language) => {
    setLang(newLang)
    localStorage.setItem('language', newLang)
  }

  const t = allTranslations[lang]

  return (
    <LanguageContext.Provider value={{ lang, switchLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
