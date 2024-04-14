import React from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import MDBox from "components/MDBox";
import { useNavigate } from "react-router-dom"; // Import useNavigate

// Import the image
import homeDecor1 from "assets/images/home-decor-1.jpg";

// Material Dashboard 2 React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

function Billing() {
  // Define the list of standards to display
  const standards = [
    "1st Grade",
    "2nd Grade",
    "3rd Grade",
    "4th Grade",
    "5th Grade",
    "6th Grade",
    "7th Grade",
    "8th Grade",
    "9th Grade",
    "10th Grade",
    "11th Grade",
    "12th Grade",
  ];

  // State variables
  const [selectedStandard, setSelectedStandard] = React.useState(null);
  const navigate = useNavigate(); // Initialize the navigate function

  // Handle card click
  const handleCardClick = (standard) => {
    setSelectedStandard(standard);
    navigate("/quiz-categories"); // Navigate to the QuizCategories page
  };

  return (
    <DashboardLayout>
      <DashboardNavbar absolute isMini />
      <MDBox p={3} mt={5}>
        {/* Create a Grid container to hold the cards */}
        <Grid container spacing={3}>
          {/* Iterate over the standards array to create a card for each standard */}
          {standards.map((standard, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card onClick={() => handleCardClick(standard)}>
                <CardMedia component="img" height="120" image={homeDecor1} alt={standard} />
                <CardContent>
                  <Typography variant="h6" component="div" gutterBottom>
                    {standard}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Billing;
