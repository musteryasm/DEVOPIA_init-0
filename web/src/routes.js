import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import Billing from "layouts/billing";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";

// @mui icons
import Icon from "@mui/material/Icon";

const routes = [
  {
    type: "collapse",
    name: "Analytics",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Students",
    key: "tables",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/students",
    component: <Tables />,
  },
  {
    type: "collapse",
    name: "Quiz",
    key: "billing",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/quiz",
    component: <Billing />,
  },
  {
    type: "collapse",
    name: "Subjects",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/subjects",
    component: <Profile />,
  },
  {
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "sign-in",
    component: <SignIn />,
  },
];

export default routes;
