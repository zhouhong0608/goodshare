import DASHBOARD from '../pages/dashboard.jsx';
import USERS from '../pages/users.jsx';
import RESOURCES from '../pages/resources.jsx';
import CATEGORIES from '../pages/categories.jsx';
import DONATIONS from '../pages/donations.jsx';
import DOWNLOADS from '../pages/downloads.jsx';
import ANALYTICS from '../pages/analytics.jsx';
import LOGIN from '../pages/login.jsx';
export const routers = [{
  id: "dashboard",
  component: DASHBOARD
}, {
  id: "users",
  component: USERS
}, {
  id: "resources",
  component: RESOURCES
}, {
  id: "categories",
  component: CATEGORIES
}, {
  id: "donations",
  component: DONATIONS
}, {
  id: "downloads",
  component: DOWNLOADS
}, {
  id: "analytics",
  component: ANALYTICS
}, {
  id: "login",
  component: LOGIN
}]