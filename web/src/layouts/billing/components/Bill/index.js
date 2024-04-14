import React, { useEffect, useState } from "react";
import axios from "axios";

// Import Material UI components
import Icon from "@mui/material/Icon";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";

// Import Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Import context for theme control
import { useMaterialUIController } from "context";

// Import jsPDF for PDF generation
import jsPDF from "jspdf";

// API URL and token for authentication
const API_URL = "https://4a47-115-112-43-148.ngrok-free.app/add_marks";
const TEACHER_TOKEN = "0ee034590c558982d234b92df35f591b9b713e97";

function Bill({ name, company, email, vat, noGutter }) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const [open, setOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle opening the modal and fetching student data
  const handleOpen = async (studentUsername) => {
    setOpen(true);
    setIsLoading(true);

    try {
      const headers = {
        Authorization: `Token ${TEACHER_TOKEN}`,
      };

      const response = await axios.get(`${API_URL}/${studentUsername}`, { headers });
      setSelectedStudent(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching student data:", error);
      setIsLoading(false);
    }
  };

  // Handle closing the modal
  const handleClose = () => {
    setOpen(false);
    setSelectedStudent(null);
  };

  // Download PDF functionality
  const downloadPDF = () => {
    if (selectedStudent) {
      // Create a new jsPDF instance
      const doc = new jsPDF();

      // Add title and student's information to the PDF
      doc.setFontSize(18);
      doc.text("Student Information", 20, 20);
      doc.setFontSize(12);
      doc.text(`Name: ${selectedStudent.student_first_name} ${selectedStudent.student_last_name}`, 20, 40);
      doc.text(`Email: ${selectedStudent.student_email}`, 20, 50);
      doc.text(`Total Marks: ${selectedStudent.total_marks}`, 20, 60);
      doc.text(`Obtained Marks: ${selectedStudent.obtained_marks}`, 20, 70);

      // Add subjects information to the PDF
      doc.text("Subjects:", 20, 80);
      let yOffset = 90;
      selectedStudent.subjects.forEach((subject) => {
        doc.text(`${subject.subject_name}: ${subject.obtained_marks}/${subject.total_marks}`, 20, yOffset);
        yOffset += 10;
      });

      // Save and trigger the download of the PDF file
      doc.save(`${selectedStudent.student_first_name}_${selectedStudent.student_last_name}_information.pdf`);
    } else {
      console.error("No student selected for PDF download");
    }
  };

  // Open Gmail functionality
  const openGmail = () => {
    window.open(`mailto:${selectedStudent.student_email}`);
  };

  return (
    <>
      <MDBox
        component="li"
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        bgColor={darkMode ? "transparent" : "grey-100"}
        borderRadius="lg"
        p={3}
        mb={noGutter ? 0 : 1}
        mt={2}
      >
        <MDBox width="100%" display="flex" flexDirection="column">
          <MDBox
            display="flex"
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            flexDirection={{ xs: "column", sm: "row" }}
            mb={2}
          >
            <MDTypography variant="button" fontWeight="medium" textTransform="capitalize">
              {name}
            </MDTypography>

            <MDBox display="flex" alignItems="center" mt={{ xs: 2, sm: 0 }}>
              <MDButton variant="text" color="info" onClick={() => handleOpen(company)}>
                <Icon>visibility</Icon>&nbsp;View
              </MDButton>

              <MDButton variant="text" color={darkMode ? "white" : "dark"} href={`mailto:${email}`}>
                <Icon>email</Icon>&nbsp;Mail
              </MDButton>
            </MDBox>
          </MDBox>

          <MDBox mb={1} lineHeight={0}>
            <MDTypography variant="caption" color="text">
              Company Name:&nbsp;&nbsp;&nbsp;
              <MDTypography variant="caption" fontWeight="medium" textTransform="capitalize">
                {company}
              </MDTypography>
            </MDTypography>
          </MDBox>

          <MDBox mb={1} lineHeight={0}>
            <MDTypography variant="caption" color="text">
              Email Address:&nbsp;&nbsp;&nbsp;
              <MDTypography variant="caption" fontWeight="medium">
                {email}
              </MDTypography>
            </MDTypography>
          </MDBox>

          <MDTypography variant="caption" color="text">
            VAT Number:&nbsp;&nbsp;&nbsp;
            <MDTypography variant="caption" fontWeight="medium">
              {vat}
            </MDTypography>
          </MDTypography>
        </MDBox>
      </MDBox>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="detailed-info-modal"
        aria-describedby="detailed-info-modal-description"
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Box
          bgcolor="background.paper"
          border="2px solid #000"
          borderRadius="lg"
          p={3}
          width="400px"
        >
          <MDTypography variant="h6" id="detailed-info-modal-title" fontWeight="bold" gutterBottom>
            Detailed Information
          </MDTypography>

          {isLoading && (
            <MDTypography variant="body1" color="text">
              Loading student data...
            </MDTypography>
          )}

          {selectedStudent && (
            <div key={selectedStudent.student_id}>
              <MDTypography variant="body1" id="detailed-info-modal-description">
                Name: {selectedStudent.student_first_name} {selectedStudent.student_last_name}
                <br />
                Email: {selectedStudent.student_email}
                <br />
                Total Marks: {selectedStudent.total_marks}
                <br />
                Obtained Marks: {selectedStudent.obtained_marks}
                <br />
                Subjects:
                <ul>
                  {selectedStudent.subjects.map((subject) => (
                    <li key={subject.subject_id}>
                      {subject.subject_name}: {subject.obtained_marks}/{subject.total_marks}
                    </li>
                  ))}
                </ul>
              </MDTypography>
            </div>
          )}

          <MDBox mt={2}>
            <Button variant="contained" color="primary" onClick={downloadPDF}>
              Download PDF
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={openGmail}
              style={{ marginLeft: "10px" }}
            >
              Open Gmail
            </Button>

            <Button
              variant="contained"
              color="secondary"
              onClick={handleClose}
              style={{ marginLeft: "10px" }}
            >
              Close
            </Button>
          </MDBox>
        </Box>
      </Modal>
    </>
  );
}

// Setting default values for the props of Bill
Bill.defaultProps = {
  noGutter: false,
};

// Typechecking props for the Bill
Bill.propTypes = {
  name: PropTypes.string.isRequired,
  company: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  vat: PropTypes.string.isRequired,
  noGutter: PropTypes.bool,
};

export default Bill;
