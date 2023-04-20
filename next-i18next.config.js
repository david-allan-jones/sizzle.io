const path = require('path');

module.exports = {
  i18n: {
    locales: ['en', 'ja'],
    defaultLocale: 'en',
  },
  localePath: path.resolve('./public/static/locales'),
};
