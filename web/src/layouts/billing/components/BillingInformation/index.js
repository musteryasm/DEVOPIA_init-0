import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import EmailIcon from "@mui/icons-material/Email";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import Grid from "@mui/material/Grid";
import PropTypes from "prop-types";
import jsPDF from "jspdf";

// Define the API endpoint and the token for authentication
const API_URL = "https://4a47-115-112-43-148.ngrok-free.app/add_marks";
const TEACHER_TOKEN = "0ee034590c558982d234b92df35f591b9b713e97";

function BillingInformation() {
  // State for student data
  const [students, setStudents] = useState([]);

  // Fetch student data from the API
  useEffect(() => {
    const fetchStudentsData = async () => {
      try {
        const headers = {
          Authorization: `Token ${TEACHER_TOKEN}`,
        };

        const response = await axios.get(API_URL, { headers });
        console.log("API response:", response.data);

        // Update the state with fetched data
        setStudents(response.data.marks);
      } catch (error) {
        console.error("Error fetching students data:", error);
      }
    };

    fetchStudentsData();
  }, []);

  // Function to handle PDF download
  const handleDownloadPDF = (student) => {
    // Create a new jsPDF instance
    const doc = new jsPDF();

    // Add student information to the PDF
    doc.text("Student Information", 10, 10);
    doc.text(`Name: ${student.student_first_name} ${student.student_last_name}`, 10, 20);
    doc.text(`Username: ${student.student_username}`, 10, 30);
    doc.text(`Email: ${student.student_email}`, 10, 40);
    doc.text(`Total Marks: ${student.total_marks}`, 10, 50);
    doc.text(`Obtained Marks: ${student.obtained_marks}`, 10, 60);

    // Add subjects information
    doc.text("Subjects:", 10, 70);
    student.subjects.forEach((subject, index) => {
      doc.text(
        `${subject.subject_name}: ${subject.obtained_marks}/${subject.total_marks}`,
        10,
        80 + index * 10
      );
    });

    // Save the PDF
    doc.save(`${student.student_first_name}_${student.student_last_name}.pdf`);
  };

  // Function to handle opening Gmail
  const handleOpenGmail = (student) => {
    const mailtoURL = `mailto:${student.student_email}`;
    window.open(mailtoURL, "_blank");
  };

  // Render the card content
  const renderStudentCard = (student) => (
    <Card
      key={student.student_id}
      sx={{
        boxShadow: true,
        borderRadius: "12px", // Adjust the border radius
        padding: "16px",
        margin: "8px",
        position: "relative",
        backgroundColor: "white", // Customize the background color
      }}
    >
      <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <MDTypography variant="h6" fontWeight="medium">
          {student.student_first_name} {student.student_last_name}
        </MDTypography>
        <MDBox display="flex">
          {/* Tooltip for PDF download */}
          <Tooltip title="Download PDF" placement="top">
            <IconButton onClick={() => handleDownloadPDF(student)}>
              <PictureAsPdfIcon />
            </IconButton>
          </Tooltip>
          {/* Tooltip for opening Gmail */}
          <Tooltip title="Send Email" placement="top">
            <IconButton onClick={() => handleOpenGmail(student)}>
              <EmailIcon />
            </IconButton>
          </Tooltip>
        </MDBox>
      </MDBox>
      <Divider />
      <MDBox pt={2}>
        <MDBox mb={2} lineHeight={1}>
          <MDTypography variant="button" color="text" fontWeight="bold">
            Username: {student.student_username}
          </MDTypography>
        </MDBox>
        <MDBox mb={2} lineHeight={1}>
          <MDTypography variant="button" color="text" fontWeight="bold">
            Email: {student.student_email}
          </MDTypography>
        </MDBox>
        <MDBox mb={2} lineHeight={1}>
          <MDTypography variant="button" color="text" fontWeight="bold">
            Total Marks: {student.total_marks}
          </MDTypography>
        </MDBox>
        <MDBox mb={2} lineHeight={1}>
          <MDTypography variant="button" color="text" fontWeight="bold">
            Obtained Marks: {student.obtained_marks}
          </MDTypography>
        </MDBox>
        <MDBox mb={2} lineHeight={1}>
          <MDTypography variant="button" color="text" fontWeight="bold">
            Subjects:
          </MDTypography>
          {student.subjects.map((subject) => (
            <MDTypography key={subject.subject_id}>
              {subject.subject_name}: {subject.obtained_marks}/{subject.total_marks}
            </MDTypography>
          ))}
        </MDBox>
      </MDBox>
    </Card>
  );

  return (
    <MDBox>
      <MDTypography variant="h6" fontWeight="bold" pb={3}>
        Student Information
      </MDTypography>
      <Grid container spacing={3}>
        {students.map((student) => (
          <Grid item xs={12} sm={7} md={4} lg={3} key={student.student_id}>
            {renderStudentCard(student)}
          </Grid>
        ))}
      </Grid>
    </MDBox>
  );
}

BillingInformation.propTypes = {
  students: PropTypes.arrayOf(
    PropTypes.shape({
      student_id: PropTypes.number.isRequired,
      student_first_name: PropTypes.string.isRequired,
      student_last_name: PropTypes.string.isRequired,
      student_username: PropTypes.string.isRequired,
      student_email: PropTypes.string.isRequired,
      total_marks: PropTypes.number.isRequired,
      obtained_marks: PropTypes.number.isRequired,
      subjects: PropTypes.arrayOf(
        PropTypes.shape({
          subject_id: PropTypes.number.isRequired,
          subject_name: PropTypes.string.isRequired,
          obtained_marks: PropTypes.number.isRequired,
          total_marks: PropTypes.number.isRequired,
        })
      ).isRequired,
    })
  ),
};

export default BillingInformation;
