import { Box } from "@mui/system";
import Papa from "papaparse";
import {
  Autocomplete,
  Button,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import FusePageCarded from "@fuse/core/FusePageCarded";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import axios from "axios";
import { baseURL } from "app/store/apiService";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import { useAppDispatch } from "app/store/hooks";
import { useNavigate, useSearchParams } from "react-router-dom";
import FuseLoading from "@fuse/core/FuseLoading";
import history from "@history";
import { navigateConfig } from "app/configs/navigateConfig";
import QuizHeader from "./QuizHeader";
import * as XLSX from "xlsx"
import { set } from "lodash";

function QuizManagement() {
  const [isUpdate, setIsUpdate] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [quiz, setQuiz] = useState(null);
  const [course, setCourse] = useState([]);
  const [courseDetail, setCourseDetail] = useState(null);
  const [module, setModule] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [quizDetail, setQuizDetail] = useState({});
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  function handleTabChange(event, value) {
    setTabValue(value);
  }

  useEffect(() => {
    var id = searchParams.get("id");
    if (id === null) {
      setIsUpdate(false);
    }
    axios.get(baseURL + `/quiz/details/${id}`).then((response) => {
      setQuiz(response.data);
    });

    setIsLoading(true);
    axios.get(baseURL + "/courses").then((response) => {
      setCourse(response.data);
      if (response.status === 200 || response.status === 201) {
        setIsLoading(false);
    }
    });
  }, []);

  

  const [file, setFile] = useState(null);

  const handleFileUpload = (e) => {
    setIsLoading(true);
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);

    // You can now process the uploaded Excel file here
    // For simplicity, let's assume you have a function to handle parsing and processing
    processExcel(uploadedFile);
    setIsLoading(false);
  };

  const processExcel = (uploadedFile) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
  
      // Assuming the first sheet contains the data
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
  
      // Convert the worksheet to JSON format
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
  
      // Process each row of data
      const questionsArray = jsonData.map((row) => {
        const question = {
          description: row['Question Description'],
          type: row['Type'],
          questionAnswers: [
            { description: row['Answer1'], isCorrect: false },
            { description: row['Answer2'], isCorrect: false },
            { description: row['Answer3'], isCorrect: false },
            { description: row['Answer4'], isCorrect: false }
          ]
        };
  
        // Check if the question type is multiple choice
        if (question.type === 'MC') {
          const correctAnswers = row['Correct Answer'].split(',').map((index) => parseInt(index) - 1);
          // Mark correct answers
          correctAnswers.forEach((index) => {
            if (index >= 0 && index < question.questionAnswers.length) {
              question.questionAnswers[index].isCorrect = true;
            }
          });
        } else if (question.type === 'SC') {
          // For single-choice questions, directly get the correct answer index
          const correctAnswerIndex = parseInt(row['Correct Answer']) - 1;
          // Mark correct answer
          if (correctAnswerIndex >= 0 && correctAnswerIndex < question.questionAnswers.length) {
            question.questionAnswers[correctAnswerIndex].isCorrect = true;
          }
        }

        return question;
      });
  
      // Log the array of question objects
      console.log('Questions Array:', questionsArray);
      dispatch(showMessage({ message: 'File Uploaded', variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'right' }}));
      setQuizDetail({ ...quizDetail, quizQuestions: questionsArray  });
    };
    reader.readAsArrayBuffer(uploadedFile);
  };
  

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    // Papa.parse(file, {
    //   complete: (result) => {
    //     const newGroup = {
    //       ...group,
    //       name: file.name.replace(".csv", ""),
    //       learnerEmail: result.data[0],
    //       mentorId: JSON.parse(localStorage.getItem("USER")).userId,
    //     };
    //     axios.post(baseURL + "/group/import", newGroup).then((response) => {
    //       if (response.status == 200 || response.status == 201) {
    //         dispatch(
    //           showMessage({
    //             message: "Group Saved",
    //             anchorOrigin: {
    //               vertical: "top",
    //               horizontal: "right",
    //             },
    //           })
    //         );
    //         navigateConfig("/apps/groups");
    //       } else {
    //         dispatch(
    //           showMessage({
    //             message: "Group Save Failed",
    //             variant: "error",
    //             anchorOrigin: {
    //               vertical: "top",
    //               horizontal: "right",
    //             },
    //           })
    //         );
    //       }
    //     }).catch((error) => {
    //       console.log(error);
    //       dispatch(
    //         showMessage({
    //           message: error.response.data.message,
    //           variant: "error",
    //           anchorOrigin: {
    //             vertical: "top",
    //             horizontal: "right",
    //           },
    //         })
    //       );
    //     });
    //   },
    // });
  };

  console.log(quizDetail);

  if (isLoading) {
    return <FuseLoading />;
  }

  if (quiz == null && isUpdate) {
    return (
      <FusePageCarded
        header={<QuizHeader isCreate={true} />}
        content={
          <>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              indicatorColor="secondary"
              textColor="secondary"
              variant="scrollable"
              scrollButtons="auto"
              classes={{ root: "w-full h-64 border-b-1" }}
            >
              <Tab className="h-64" label="Basic Info" />
            </Tabs>
            <div className="p-16 sm:p-24 max-w-9xl">
              <div className={tabValue !== 0 ? "hidden" : ""}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  No quiz found!
                </Box>
              </div>
            </div>
          </>
        }
      />
    );
  } else {
    return (
      <FusePageCarded
        header={<QuizHeader quiz={quizDetail} isUpdate={isUpdate} />}
        content={
          <>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              indicatorColor="secondary"
              textColor="secondary"
              variant="scrollable"
              scrollButtons="auto"
              classes={{ root: "w-full h-64 border-b-1" }}
            >
              <Tab className="h-64" label="Basic Info" />
            </Tabs>
            <div className="p-16 sm:p-24 max-w-9xl">
              <div className={tabValue !== 0 ? "hidden" : ""}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                   <InputLabel id="title">Title</InputLabel>
                  <TextField
											onChange={(e) => {
												setQuizDetail({ ...quizDetail, title: e.target.value })
											}}
											defaultValue={isUpdate ? quiz.title : ''}
											id="title"
											focused
											rows={5}
											variant="outlined"
											fullWidth
										/>
                  <InputLabel id="duration">Duration</InputLabel>
                  <TextField
											onChange={(e) => {
												setQuizDetail({ ...quizDetail, duration: e.target.value })
											}}
											defaultValue={isUpdate ? quiz.duration : ''}
											id="duration"
											focused
											rows={5}
											variant="outlined"
                      type="number"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">Minutes</InputAdornment>
                        ),
                      }}
											fullWidth
										/>
                   <InputLabel id="passPercentage">Pass Percentage</InputLabel>
                  <TextField
											onChange={(e) => {
												setQuizDetail({ ...quizDetail, passPercentage: e.target.value })
											}}
											defaultValue={isUpdate ? quiz.passPercentage : ''}
											id="passPercentage"
											focused
											rows={5}
											variant="outlined"
                      type="number"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">%</InputAdornment>
                        ),
                      }}
											fullWidth
										/>
                    <InputLabel id="score">Score</InputLabel>
                  <TextField
											onChange={(e) => {
												setQuizDetail({ ...quizDetail, score: e.target.value })
											}}
											defaultValue={isUpdate ? quiz.score : ''}
											id="score"
											focused
											rows={5}
											variant="outlined"
                      type="number"
											fullWidth
										/>
                  
                  {!isUpdate ? (<InputLabel id="course">Course</InputLabel>) : <></>
                  }
                  
                  {!isUpdate ? (
                    <Select
                    labelId="course-label"
                    id="course"
                    label="Course"
                    variant="outlined"
                    defaultValue={isUpdate ? quiz?.lesson?.courseModule?.name : ""}
                    focused
                    onChange={(e) => {
                      setCourseDetail({ id: e.target.value });
                    }}
                  >
                    {course?.map((courseItem) => (
                      <MenuItem key={courseItem.id} value={courseItem.id}>
                        {courseItem.name}
                      </MenuItem>
                    ))}
                  </Select>
                  ) : <></>}
                  
                    {courseDetail && (
                      <>
                      <InputLabel id="label">Module</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Module"
                      onChange={(e) => {
                        setModule({ id: e.target.value });
                      }}
                    >
                      {course?.find((courseItem) => courseItem.id === courseDetail.id)?.courseModules
                        .map((moduleItem) => (
                          <MenuItem key={moduleItem.id} value={moduleItem.id}>
                            {moduleItem.title}
                          </MenuItem>
                        ))}
                    </Select></>
                    )}
                  
                    {module && (
                      <>
                      <InputLabel id="label">Lesson</InputLabel>
                    <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Lesson"
                    onChange={(e) => {
                      setLesson({ id: e.target.value });
                      setQuizDetail({ ...quizDetail, lessonId: e.target.value });
                    }}
                  >
                     {course?.find((courseItem) => courseItem.id === courseDetail.id)?.courseModules.find(lesson => lesson.id === module.id)?.moduleLessons
                        .map((lessonItem) => (
                          <MenuItem key={lessonItem.id} value={lessonItem.id}>
                            {lessonItem.title}
                          </MenuItem>
                        ))}
                  </Select></>
                    )}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    mt: "20px",
                  }}
                >
                  {!isUpdate ? (<div>
                    <input
                      accept=".xlsx"
                      style={{ display: "none" }}
                      id="csv-upload"
                      type="file"
                      onChange={handleFileUpload}
                      onClick={(event) => (event.target.value = null)}
                    />
                    <label htmlFor="csv-upload">
                      <Button variant="contained" component="span">
                        Upload Excel File
                      </Button>
                    </label>
                  </div>) : <></>}
                </Box>
              </div>
            </div>
          </>
        }
      />
    );
  }
}

export default QuizManagement;
