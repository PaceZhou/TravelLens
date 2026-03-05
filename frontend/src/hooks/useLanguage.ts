import { useState, useEffect } from 'react'
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

export function useLanguage() {
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

  return { lang, switchLanguage, t }
}
