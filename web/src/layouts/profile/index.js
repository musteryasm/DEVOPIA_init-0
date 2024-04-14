import React, { useState, useEffect } from "react";
import axios from "axios";

// @mui material components
import Grid from "@mui/material/Grid";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";

// Overview page components
import Header from "layouts/profile/components/Header";

function Overview() {
  // State variables
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [subjects, setSubjects] = useState([]);

  // Base API URL and user token for authorization
  const baseURL = "https://4a47-115-112-43-148.ngrok-free.app/";
  const userToken = "0ee034590c558982d234b92df35f591b9b713e97"; // Replace this with the actual user token

  // Image path for the card
  const imagePath = "/assets/images/home-decor-1.jpg";

  // Fetch subjects from the API
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get(`${baseURL}subject`, {
          headers: {
            Authorization: `Token ${userToken}`,
          },
        });
        // Store the subjects data
        setSubjects(response.data.subjects);
      } catch (error) {
        console.error("Failed to fetch subjects from the API:", error);
      }
    };

    fetchSubjects();
  }, []);

  // Function to open the form
  const openForm = () => setShowForm(true);

  // Function to close the form
  const closeForm = () => {
    setShowForm(false);
    setNewTitle("");
  };

  // Function to handle form submission
  const handleFormSubmit = async () => {
    try {
      // Send a POST request to add the new subject
      const response = await axios.post(
        `${baseURL}subject`,
        {
          name: newTitle,
        },
        {
          headers: {
            Authorization: `Token ${userToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Check if the response status code is successful (e.g., 200 or 201)
      if (response.status === 200 || 201) {
        // Add the new subject to the list of subjects
        setSubjects((prevSubjects) => [
          ...prevSubjects,
          {
            id: response.data.id,
            name: newTitle,
          },
        ]);

        // Display a success message in the console
        console.log(response.data.message);

        // Close the form and reset the new title
        closeForm();
      } else {
        console.error("Failed to add subject to the API. Response:", response);
      }
    } catch (error) {
      console.error("Error while adding subject to the API:", error);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      <Header>
        <MDBox pt={2} px={2} lineHeight={1.25}>
          <MDTypography variant="h6" fontWeight="medium">
            Subjects
          </MDTypography>
        </MDBox>
        <MDBox p={2}>
          <MDBox mt={-2}>
            <Grid container spacing={6} justifyContent="center" alignItems="center">
              <Grid item>
                {/* Add New Subject button */}
                <MDButton variant="gradient" color="primary" onClick={openForm} fullWidth>
                  Add New Subject
                </MDButton>
              </Grid>
            </Grid>
          </MDBox>

          {/* Display subject cards */}
          <Grid container spacing={6}>
            {subjects.map((subject, index) => (
              <Grid item xs={12} md={6} xl={3} key={subject.id}>
                <DefaultProjectCard
                  title={subject.name}
                  image={imagePath} // Add the image prop with the image path
                  action={{
                    type: "internal",
                    route: "/quiz",
                    color: "info",
                    label: "QUIZ",
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </MDBox>
      </Header>

      {/* Form dialog to add new subject */}
      <Dialog open={showForm} onClose={closeForm}>
        <DialogTitle>Add New Subject</DialogTitle>
        <DialogContent>
          <MDInput
            autoFocus
            margin="dense"
            label="Subject Name"
            type="text"
            fullWidth
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <MDButton onClick={closeForm} color="primary">
            Cancel
          </MDButton>
          <MDButton onClick={handleFormSubmit} color="primary">
            Add Subject
          </MDButton>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}

export default Overview;
