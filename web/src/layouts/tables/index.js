// Import required Material-UI components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import MDBox from "components/MDBox";

// Import the image
import homeDecor1 from "assets/images/home-decor-1.jpg";

// Material Dashboard 2 React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import BillingInformation from "layouts/billing/components/BillingInformation";

function Tables() {
  return (
    <DashboardLayout>
      <DashboardNavbar absolute isMini />
      <MDBox p={3} mt={5}>
        <BillingInformation />
      </MDBox>
    </DashboardLayout>
  );
}

export default Tables;
