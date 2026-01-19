import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import commonEn from '../public/locales/en/common.json';

const resources = {
  en: {
    common: commonEn,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    debug: false,
    ns: ['common'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
  });

export { i18n as default };