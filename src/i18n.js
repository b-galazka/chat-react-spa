import i18n from 'i18next';

import locales from './locales';

i18n.init({
    resources: locales,
    lng: 'en',
    interpolation: { escapeValue: false }
});

export default i18n;