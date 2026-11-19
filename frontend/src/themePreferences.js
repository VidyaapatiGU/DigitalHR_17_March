const VALID_THEMES = new Set(['ocean', 'forest', 'plum']);
const THEME_STORAGE_PREFIX = 'digitalhr.theme:';

export const isSupportedTheme = (theme) => VALID_THEMES.has(theme);

export const cacheThemeForUser = (userId, theme) => {
  if (!userId || !isSupportedTheme(theme)) return;

  try {
    localStorage.setItem(`${THEME_STORAGE_PREFIX}${userId}`, theme);
  } catch (error) {
    // Theme persistence in local storage is an optimization; the server remains the source of truth.
  }
};

export const applyThemeBeforeNavigation = async (user, fetchCurrentUser) => {
  let account = user || {};

  if (!isSupportedTheme(account.theme) && fetchCurrentUser) {
    try {
      account = (await fetchCurrentUser()) || account;
    } catch (error) {
      // Continue with the theme in the login response or the default theme.
    }
  }

  const theme = isSupportedTheme(account.theme) ? account.theme : 'ocean';
  cacheThemeForUser(account._id || user?._id, theme);
  document.documentElement.dataset.cardTheme = theme;
  document.documentElement.dataset.themeReady = 'true';
  return theme;
};
