import Home from "../Home/Home";
import Login from "../Login/Login";
// import Profile from "../Profile/Profile";

export const routes = [
  {
    path: "/",
    component: Login,
  },
  {
    path: "/home",
    component: Home,
  },
];
