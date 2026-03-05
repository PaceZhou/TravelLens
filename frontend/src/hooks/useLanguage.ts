import { useState, useEffect } from 'react'
import translations from '../locales/translations.json'

type Language = 'zh' | 'en'

export function useLanguage() {
  const [lang, setLang] = useState<Language>('zh')

  useEffect(() => {
    const saved = localStorage.getItem('language') as Language
    if (saved) setLang(saved)
  }, [])

  const switchLanguage = (newLang: Language) => {
    setLang(newLang)
    localStorage.setItem('language', newLang)
  }

  const t = translations[lang]

  return { lang, switchLanguage, t }
}
