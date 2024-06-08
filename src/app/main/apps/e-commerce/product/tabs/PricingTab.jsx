import React, { useEffect, useState } from "react";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { Controller, useFormContext } from "react-hook-form";
import Button from "@mui/material/Button";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";

/**
 * The pricing tab.
 */
function PricingTab({isUpdate, course, setCourse}) {
  const methods = useFormContext();
  const { control } = methods;
  const [componentData, setComponentData] = useState([]);

  const handleAddMore = () => {
    const newData = [...componentData, {}]; // Add a new empty object
    setComponentData(newData);
  };

  const handleChange = (index, field, value) => {
    const newData = [...componentData];
    newData[index] = { ...newData[index], [field]: value };
    setComponentData(newData);
  };

  useEffect(() => {
    if (!isUpdate) {
      setCourse({...course, courseCoursePackages: componentData})
    }
  }, [componentData])

  const handlePackageNameChange = (index, value) => {
    const newData = [...componentData];
    newData[index] = { ...newData[index], name: value };
    setComponentData(newData);
  };

  const handleMaxStudentChange = (index, value) => {
    const newData = [...componentData];
    newData[index] = { ...newData[index], maxStudent: value };
    setComponentData(newData);
  };

  const handlePriceChange = (index, value) => {
    const newData = [...componentData];
    newData[index] = { ...newData[index], price: value };
    setComponentData(newData);
  };

  return (
    <div>
      <Button
        className="mx-8 whitespace-nowrap mb-10"
        variant="contained"
        color="secondary"
        onClick={handleAddMore}
      >
        <FuseSvgIcon size={20}>heroicons-outline:plus</FuseSvgIcon>
        <span className="mx-8">Add More Package</span>
      </Button>
      {
        isUpdate ? (course.courseCoursePackages.map((data, index) => (
          <div key={data.id}>
            <TextField
          onChange={(e) => handlePackageNameChange(index, e.target.value)}
          defaultValue={isUpdate ? course.courseCoursePackages[index].name : ''}
              className="mt-8 mb-16"
              label="Package Name *"
              id="priceTaxExcl"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start"></InputAdornment>
                ),
              }}
              type="text"
              variant="outlined"
              required
              autoFocus
              fullWidth
            />
  
            <TextField
          onChange={(e) => handleMaxStudentChange(index, e.target.value)}
          defaultValue={isUpdate ? course.courseCoursePackages[index].maxStudent : ''}
              className="mt-8 mb-16"
              label="Max Student"
              id="priceTaxIncl"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start"></InputAdornment>
                ),
              }}
              type="number"
              variant="outlined"
              fullWidth
            />
  
            <TextField
        onChange={(e) => handlePriceChange(index, e.target.value)}
        defaultValue={isUpdate ? course.courseCoursePackages[index].price : ''}
              className="mt-8 mb-16"
              label="Price"
              id="taxRate"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">VND</InputAdornment>
                ),
              }}
              type="number"
              variant="outlined"
              fullWidth
            />
            <hr className="mt-10 mb-10"></hr>
          </div>
        ))) : componentData.map((data, index) => (
          <div key={data.id}>
            <TextField
          onChange={(e) => handlePackageNameChange(index, e.target.value)}
              className="mt-8 mb-16"
              label="Package Name *"
              id="priceTaxExcl"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start"></InputAdornment>
                ),
              }}
              type="text"
              variant="outlined"
              autoFocus
              fullWidth
            />
  
            <TextField
          onChange={(e) => handleMaxStudentChange(index, e.target.value)}
              className="mt-8 mb-16"
              label="Max Student"
              id="priceTaxIncl"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start"></InputAdornment>
                ),
              }}
              type="number"
              variant="outlined"
              fullWidth
            />
  
            <TextField
        onChange={(e) => handlePriceChange(index, e.target.value)}
              className="mt-8 mb-16"
              label="Price"
              id="taxRate"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">VND</InputAdornment>
                ),
              }}
              type="number"
              variant="outlined"
              fullWidth
            />
            <hr className="mt-10 mb-10"></hr>
          </div>
        ))
      }
    </div>
  );
}

export default PricingTab;
