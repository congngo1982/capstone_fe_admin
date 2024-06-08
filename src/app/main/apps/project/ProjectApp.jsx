import { Box } from "@mui/system";
import { Autocomplete, InputLabel, Select, TextField } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import FusePageCarded from "@fuse/core/FusePageCarded";
import ProductHeader from "../e-commerce/product/ProductHeader";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import ProjectHeader from "./ProjectHeader";
import axios from "axios";
import { baseURL } from "app/store/apiService";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import { useAppDispatch } from "app/store/hooks";
import { useNavigate, useSearchParams } from "react-router-dom";
import FuseLoading from "@fuse/core/FuseLoading";
import history from "@history";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import { navigateConfig } from "app/configs/navigateConfig";

function ProjectApp() {
  const [isUpdate, setIsUpdate] = useState(false);
  const [project, setProject] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [tags, setTags] = useState([]);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [age, setAge] = useState("");
  const [skill, setSkill] = useState([]);

  const handleChangeSkill = (event) => {
    const {
      target: { value },
    } = event;
    setSkill(typeof value === "string" ? value.split(", ") : value);
	console.log("value", value)
	setProject({ ...project, skill: typeof value === "string" ? value.split(", ") : value.join(", ") });
  };

  const handleChange = (event) => {
    setAge(event.target.value);
    setProject({ ...project, ageRecomment: event.target.value });
  };

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const ages = [
    "3-5",
    "6-8",
    "6-12",
    "9-11",
    "11-15",
    "12-14",
    "15-18",
    "19-25",
    "26-30",
  ];

  const skillSets = [
    "Empathy",
    "Basic Social Skills",
    "Curiosity",
    "Cultural Awareness",
    "Communication Skills",
    "Problem-Solving",
    "Collaboration",
    "Respect for Diversity",
    "Critical Thinking",
    "Conflict Resolution",
    "Leadership Skills",
    "Research Skills",
    "Project Management",
    "Family Bonding",
  ];

  console.log("project", project);

  function validateInput(data) {
    const requiredFields = ["goal", "introVideoUrl", "ageRecomment", "skill"];

    for (let field of requiredFields) {
      if (
        data[field] === undefined ||
        data[field] === null ||
        data[field].trim() === ""
      ) {
        return `${field.charAt(0).toUpperCase() + field.slice(1)} cannot be empty`;
      }
    }

    return "";
  }

  const [searchParams, setSearchParams] = useSearchParams();
  function handleTabChange(event, value) {
    setTabValue(value);
  }
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (
      searchParams.get("id") != null &&
      typeof searchParams.get("id") !== "undefined"
    ) {
      axios
        .get(baseURL + "/projects/" + searchParams.get("id"))
        .then((response) => {
          if (response.status == 200 || response.status == 201) {
            setProject(response.data);
            setIsUpdate(true);
            setTags(response.data.skill.split(", "));
          }
        });
    }
  }, []);

  useEffect(() => {
    setProject({ ...project, skill: tags.join(", ") });
  }, [tags]);

  function handleSubmitProject() {
    let msg = "";
    msg = validateInput(project);

    if (msg != "") {
      dispatch(
        showMessage({
          message: msg,
          variant: "error",
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
        })
      );
      return;
    }

    setIsLoading(true);
    axios
      .post(baseURL + "/projects", project)
      .then((response) => {
        if (response.status == 200 || response.status == 201) {
          dispatch(
            showMessage({
              message: "Project Saved",
              anchorOrigin: {
                vertical: "top",
                horizontal: "right",
              },
            })
          );
          window.open("/apps/projects", "_self");
          setIsLoading(false);
        } else {
          dispatch(
            showMessage({
              message: "Project Save Failed",
              variant: "error",
              anchorOrigin: {
                vertical: "top",
                horizontal: "right",
              },
            })
          );
          setIsLoading(false);
        }
      })
      .catch((err) => {
        dispatch(
          showMessage({
            message: "Project Save Failed",
            variant: "error",
            anchorOrigin: {
              vertical: "top",
              horizontal: "right",
            },
          })
        );
      });
  }

  if (isLoading) {
    return <FuseLoading />;
  }

  console.log("project", project);

  function handleUpdateProject() {
    let msg = "";
    msg = validateInput(project);

    if (msg != "") {
      dispatch(
        showMessage({
          message: msg,
          variant: "error",
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
        })
      );
      return;
    }

    axios
      .post(baseURL + "/projects", project)
      .then((response) => {
        if (response.status == 200 || response.status == 201) {
          dispatch(
            showMessage({
              message: "Project Updated",
              anchorOrigin: {
                vertical: "top",
                horizontal: "right",
              },
            })
          );
          navigateConfig("/apps/projects");
          window.open("/apps/projects", "_self");
          setIsLoading(false);
        } else {
          dispatch(
            showMessage({
              message: "Project Update Failed",
              anchorOrigin: {
                vertical: "top",
                horizontal: "right",
              },
            })
          );
          setIsLoading(false);
        }
      })
      .catch((err) => {
        dispatch(
          showMessage({
            message: "Project Update Failed",
            variant: "error",
            anchorOrigin: {
              vertical: "top",
              horizontal: "right",
            },
          })
        );
        setIsLoading(false);
      });
  }

  if (project != null && tags.length != 0 && isUpdate) {
    return (
      <FusePageCarded
        header={
          <ProjectHeader
            isUpdate={isUpdate}
            handleUpdateProject={handleUpdateProject}
            handleSubmitProject={handleSubmitProject}
          />
        }
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
                  <TextField
                    onChange={(e) => {
                      setProject({ ...project, goal: e.target.value });
                    }}
                    value={isUpdate ? project.goal : ""}
                    required
                    label="Goal"
                    focused
                    id="goal"
                    variant="outlined"
                    fullWidth
                  />

                  <TextField
                    onChange={(e) => {
                      setProject({ ...project, introVideoUrl: e.target.value });
                    }}
                    value={isUpdate ? project.introVideoUrl : ""}
                    id="duration"
                    required
                    focused
                    label="Intro Video URL"
                    rows={5}
                    variant="outlined"
                    fullWidth
                  />

                  <FormControl>
                    <InputLabel id="demo-select-small-label">Age</InputLabel>
                    <Select
                      labelId="demo-select-small-label"
                      id="age"
                      value={isUpdate ? project.ageRecomment : age}
                      label="Age"
                      onChange={handleChange}
                    >
                      {ages.map((age) => (
                        <MenuItem key={age} value={age}>
                          {age}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl>
                    <InputLabel id="demo-multiple-checkbox-label">
                      Skills
                    </InputLabel>
                    <Select
                      labelId="demo-multiple-checkbox-label"
                      id="demo-multiple-checkbox"
                      multiple
                      value={project.skill.split(", ")}
                      onChange={handleChangeSkill}
                      input={<OutlinedInput label="Skills" />}
                      renderValue={(selected) => selected.join(", ")}
                      MenuProps={MenuProps}
                    >
                      {skillSets.map((name) => (
                        <MenuItem key={name} value={name}>
                          <Checkbox checked={project.skill.indexOf(name) > -1} />
                          <ListItemText primary={name} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
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
        header={
          <ProjectHeader
            isUpdate={isUpdate}
            handleUpdateProject={handleUpdateProject}
            handleSubmitProject={handleSubmitProject}
          />
        }
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
                  <TextField
                    onChange={(e) => {
                      setProject({ ...project, goal: e.target.value });
                    }}
                    defaultValue={project != null ? project.goal : ""}
                    required
                    label="Goal"
                    id="goal"
                    variant="outlined"
                    fullWidth
                  />

                  <TextField
                    onChange={(e) => {
                      setProject({ ...project, introVideoUrl: e.target.value });
                    }}
                    defaultValue={project != null ? project.introVideoUrl : ""}
                    id="duration"
                    label="Intro Video URL"
                    rows={5}
                    required
                    variant="outlined"
                    fullWidth
                  />

                  <FormControl>
                    <InputLabel id="demo-select-small-label">Age</InputLabel>
                    <Select
                      labelId="demo-select-small-label"
                      id="age"
                      value={age}
                      label="Age"
                      onChange={handleChange}
                    >
                      {ages.map((age) => (
                        <MenuItem key={age} value={age}>
                          {age}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl>
                    <InputLabel id="demo-multiple-checkbox-label">
                      Skills
                    </InputLabel>
                    <Select
                      labelId="demo-multiple-checkbox-label"
                      id="demo-multiple-checkbox"
                      multiple
                      value={skill}
                      onChange={handleChangeSkill}
                      input={<OutlinedInput label="Skills" />}
                      renderValue={(selected) => selected.join(", ")}
                      MenuProps={MenuProps}
                    >
                      {skillSets.map((name) => (
                        <MenuItem key={name} value={name}>
                          <Checkbox checked={skill.indexOf(name) > -1} />
                          <ListItemText primary={name} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </div>
            </div>
          </>
        }
      />
    );
  }
}

export default ProjectApp;
