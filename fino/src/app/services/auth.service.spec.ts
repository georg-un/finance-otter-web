/**
 * if the user is not on the login page:
 *   if the user logs out or is not logged in to begin with:
 *     redirect to /login
 * if the user is on the login page:
 *   if the user lo
 * If the user is logs out and is not on the login page -> redirect to /login
 * if user is not logged in on init and is on any site except login -> redirect to /login
 * (if user is not logged in / logs out and is already on /login, do not redirect to login)
 * if user logs in -> redirect to path
 * if user is logged in on init -> do nothing (except they are on login, then redirect to root)
 */
