import { Box, FormControl, InputAdornment, InputLabel, MenuItem, Select } from "@mui/material";
import TextField from "@mui/material/TextField";
import { Controller, useFormContext } from "react-hook-form";
import { useGetProjectListQuery } from "../../ECommerceApi";
import { useEffect, useRef } from "react";

/**
 * The basic info tab.
 */
function BasicInfoTab({ isUpdate, course, setCourse }) {
  const { data: projectList } = useGetProjectListQuery();
  const methods = useFormContext();
  const { control, formState } = methods;
  const { errors } = formState;

  useEffect(() => {
  }, [course]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <TextField
        onChange={(e) => {
          setCourse({ ...course, name: e.target.value });
        }}
        defaultValue={isUpdate ? course.name : ""}
        required
        label="Name"
        autoFocus
        id="name"
        variant="outlined"
        fullWidth
        error={!!errors.name}
        helperText={errors?.name?.message}
      />

      <TextField
        onChange={(e) => {
          setCourse({ ...course, duration: e.target.value });
        }}
        defaultValue={isUpdate ? course.duration : ""}
        required
        id="duration"
        label="Duration"
        type="number"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">Minutes</InputAdornment>
          ),
        }}
        min={0}
        rows={5}
        variant="outlined"
        fullWidth
      />

      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Project</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Project"
          required
          value={isUpdate ? course.project.id : course?.projectId}
          onChange={(e) => {
            setCourse({ ...course, projectId: e.target.value });
          }}
        >
          {projectList?.map((project) => {
            return (
              <MenuItem
                key={project.id}
                value={project.id}
                defaultChecked={
                  isUpdate ? project.id === course.project.id : false
                }
              >
                {project.goal}
              </MenuItem>
            )
          })}
        </Select>
      </FormControl>

      {/* <Controller
				name="categories"
				control={control}
				defaultValue={[]}
				render={({ field: { onChange, value } }) => (
					<Autocomplete
						className="mt-8 mb-16"
						multiple
						freeSolo
						options={[]}
						value={value}
						onChange={(event, newValue) => {
							onChange(newValue);
						}}
						renderInput={(params) => (
							<TextField
								{...params}
								placeholder="Select multiple categories"
								label="Categories"
								variant="outlined"
								InputLabelProps={{
									shrink: true
								}}
							/>
						)}
					/>
				)}
			/> */}

      <TextField
        onChange={(e) => {
          setCourse({ ...course, age: e.target.value });
        }}
        defaultValue={isUpdate ? course.age : ""}
        id="age"
        required
        label="Age"
        type="text"
        rows={5}
        variant="outlined"
        fullWidth
      />

      <TextField
        onChange={(e) => {
          setCourse({ ...course, imgUrl: e.target.value });
        }}
        defaultValue={isUpdate ? course.imgUrl : ""}
        id="imgUrl"
        label="Image URL"
        required
        type="text"
        rows={5}
        variant="outlined"
        fullWidth
      />

      <TextField
        onChange={(e) => {
          setCourse({ ...course, description: e.target.value });
        }}
        defaultValue={isUpdate ? course.description : ""}
        id="description"
        label="Description"
        required
        type="text"
        minRows={8}
        maxRows={12}
        variant="outlined"
        fullWidth
      />

      <TextField
        onChange={(e) => {
          setCourse({ ...course, income: e.target.value });
        }}
        defaultValue={isUpdate ? course.income : ""}
        id="income"
        label="Income"
        required
        type="text"
        minRows={8}
        maxRows={12}
        variant="outlined"
        fullWidth
      />

      <TextField
        onChange={(e) => {
          setCourse({ ...course, outcome: e.target.value });
        }}
        defaultValue={isUpdate ? course.outcome : ""}
        id="outcome"
        label="Outcome"
        required
        type="text"
        minRows={8}
        maxRows={12}
        variant="outlined"
        fullWidth
      />
    </Box>
  );
}

export default BasicInfoTab;
