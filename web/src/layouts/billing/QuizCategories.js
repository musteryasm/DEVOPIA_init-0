import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

function QuizCategories() {
  // State variables
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [questionData, setQuestionData] = useState({
    question: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctAnswer: "",
  });
  const [submittedQuestions, setSubmittedQuestions] = useState([]);
  const subjectId = 1; // Set your subject ID here
  const standard = selectedDifficulty; // Assume that the selected difficulty is equivalent to the standard
  const lesson = 1; // Set your lesson ID here
  const baseUrl = "https://4a47-115-112-43-148.ngrok-free.app/";

  // Handle dropdown change
  const handleDifficultyChange = (event) => {
    const difficulty = event.target.value;
    setSelectedDifficulty(difficulty);
    setOpenForm(true); // Open the form when an option is selected
  };

  // Handle form field changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setQuestionData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleFormSubmit = async () => {
    setOpenForm(false); // Close the form after submission
    await postQuestion(questionData, selectedDifficulty);
    // Update the state with the new question data
    setSubmittedQuestions((prevQuestions) => [...prevQuestions, questionData]);
    // Reset the form fields
    setQuestionData({
      question: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correctAnswer: "",
    });
  };

  // Handle form close
  const handleFormClose = () => {
    setOpenForm(false);
  };

  // Function to POST question data to the backend
  const postQuestion = async (questionData, difficulty) => {
    // Construct the API endpoint URL
    const apiUrl = `${baseUrl}quiz/${subjectId}/${standard}/${lesson}`;
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token 0ee034590c558982d234b92df35f591b9b713e97", // Include the token in the header
        },
        body: JSON.stringify({
          question: questionData.question,
          option1: questionData.optionA,
          option2: questionData.optionB,
          option3: questionData.optionC,
          option4: questionData.optionD,
          correct_answer: questionData.correctAnswer, // Include the correct answer
        }),
      });

      // Check content type before parsing JSON
      const contentType = response.headers.get("content-type");
      if (!contentType.includes("application/json")) {
        throw new Error("Unexpected content type");
      }

      const result = await response.json();
      if (response.ok) {
        console.log("Success:", result.message);
      } else {
        console.error("Error:", result.message);
      }
    } catch (error) {
      console.error("Failed to POST question:", error);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar absolute isMini />
      <MDBox p={3}>
        <MDBox mt={3} mb={3}>
          <Typography variant="h6" mb={2}>
            Choose a difficulty:
          </Typography>

          {/* Dropdown menu for selecting difficulty */}
          <Select
            value={selectedDifficulty}
            onChange={handleDifficultyChange}
            displayEmpty
            variant="outlined"
            style={{ minWidth: 200, minHeight: 40, marginBottom: "20px" }}
          >
            <MenuItem value="">
              <em>Select Difficulty</em>
            </MenuItem>
            <MenuItem value="Easy">Easy</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Hard">Hard</MenuItem>
          </Select>

          {/* Optional: Button to proceed with the selected difficulty */}
          <MDButton
            variant="contained"
            color="primary"
            disabled={!selectedDifficulty}
            onClick={() => console.log(`Proceed with ${selectedDifficulty} quiz`)}
          >
            Choose
          </MDButton>
        </MDBox>

        {/* Popup form */}
        <Dialog open={openForm} onClose={handleFormClose} fullWidth>
          <DialogTitle>Enter Question and Options</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Question"
              name="question"
              type="text"
              fullWidth
              value={questionData.question}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              label="Option A"
              name="optionA"
              type="text"
              fullWidth
              value={questionData.optionA}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              label="Option B"
              name="optionB"
              type="text"
              fullWidth
              value={questionData.optionB}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              label="Option C"
              name="optionC"
              type="text"
              fullWidth
              value={questionData.optionC}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              label="Option D"
              name="optionD"
              type="text"
              fullWidth
              value={questionData.optionD}
              onChange={handleInputChange}
            />

            {/* Dropdown menu to select the correct answer */}
            <Select
              label="Correct Answer"
              name="correctAnswer"
              value={questionData.correctAnswer}
              onChange={handleInputChange}
              fullWidth
              margin="dense"
            >
              <MenuItem value="">Select Correct Answer</MenuItem>
              <MenuItem value="A">Option A</MenuItem>
              <MenuItem value="B">Option B</MenuItem>
              <MenuItem value="C">Option C</MenuItem>
              <MenuItem value="D">Option D</MenuItem>
            </Select>
          </DialogContent>
          <DialogActions>
            <MDButton onClick={handleFormClose} color="secondary">
              Cancel
            </MDButton>
            <MDButton onClick={handleFormSubmit} color="primary">
              Submit
            </MDButton>
          </DialogActions>
        </Dialog>

        {/* Table to display submitted questions */}
        <MDBox mt={3}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Question</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {submittedQuestions.map((question, index) => (
                  <TableRow key={index}>
                    <TableCell>{question.question}</TableCell>
                    <TableCell>{question.optionA}</TableCell>
                    <TableCell>{question.optionB}</TableCell>
                    <TableCell>{question.optionC}</TableCell>
                    <TableCell>{question.optionD}</TableCell>
                    <TableCell>{question.correctAnswer}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
}

export default QuizCategories;
