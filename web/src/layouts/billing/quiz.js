import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom

// Import the image
import homeDecor1 from "assets/images/home-decor-1.jpg"; // Replace this with your desired image

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
  const [selectedStandard, setSelectedStandard] = useState(null);
  const [showSections, setShowSections] = useState(false);
  const navigate = useNavigate(); // Initialize the navigate function

  // Handle card click
  const handleCardClick = (standard) => {
    setSelectedStandard(standard);
    setShowSections(true);
  };

  // Handle button click to navigate to the quiz page
  const handleQuizNavigation = () => {
    navigate("/quiz"); // Navigate to the quiz page
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
                  <Typography variant="body2" color="text.secondary">
                    {/* Add any additional content you want for the card here */}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </MDBox>

      {/* Conditionally render the easy, medium, and hard sections */}
      {showSections && (
        <MDBox p={3}>
          <Typography variant="h5" gutterBottom>
            {selectedStandard} Sections:
          </Typography>

          {/* Display easy section */}
          <MDBox mb={2}>
            <Typography variant="h6">Easy</Typography>
            {/* Add content for the easy section here */}
            <Typography variant="body2">
              Content for the easy section of {selectedStandard}.
            </Typography>
            {/* Add a button to navigate to the quiz page */}
            <MDButton onClick={handleQuizNavigation} variant="contained" color="primary">
              Start Easy Quiz
            </MDButton>
          </MDBox>

          {/* Display medium section */}
          <MDBox mb={2}>
            <Typography variant="h6">Medium</Typography>
            {/* Add content for the medium section here */}
            <Typography variant="body2">
              Content for the medium section of {selectedStandard}.
            </Typography>
            {/* Add a button to navigate to the quiz page */}
            <MDButton onClick={handleQuizNavigation} variant="contained" color="primary">
              Start Medium Quiz
            </MDButton>
          </MDBox>

          {/* Display hard section */}
          <MDBox mb={2}>
            <Typography variant="h6">Hard</Typography>
            {/* Add content for the hard section here */}
            <Typography variant="body2">
              Content for the hard section of {selectedStandard}.
            </Typography>
            {/* Add a button to navigate to the quiz page */}
            <MDButton onClick={handleQuizNavigation} variant="contained" color="primary">
              Start Hard Quiz
            </MDButton>
          </MDBox>

          {/* Button to go back to standards selection */}
          <MDButton
            variant="contained"
            color="primary"
            onClick={() => setShowSections(false)}
            style={{ marginTop: "10px" }}
          >
            Back to Standards
          </MDButton>
        </MDBox>
      )}
    </DashboardLayout>
  );
}

export default Billing;
