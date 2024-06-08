import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import { Link, useNavigate, useParams } from "react-router-dom";
import _ from "@lodash";
import { Button } from "@mui/material";
import { useState } from "react";
import Papa from "papaparse";
import axios from "axios";
import { baseURL } from "app/store/apiService";
import { useAppDispatch } from "app/store/hooks";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import history from '@history';
import { navigateConfig } from "app/configs/navigateConfig";
import FuseLoading from "@fuse/core/FuseLoading";

export default function OrganizationHeader() {
  const routeParams = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  if (isLoading) {
    return <FuseLoading />;
  }

  const [csvData, setCsvData] = useState(null);

  const handleFileChange = (e) => {
    setIsLoading(true);
    const file = e.target.files[0];
    Papa.parse(file, {
      complete: (result) => {
        setCsvData(result.data);
		const requestData = result.data.map(row => ({
			orgName: row[0],
			orgLogoUrl: row[1],
			user: { email: row[2] }
		  }));

		  axios.post(baseURL + "/organization/import", requestData).then(response => {
			if (response.status == 200 || response.status == 201) {
				dispatch(showMessage({ message: 'Organiaztion Saved' , anchorOrigin: {
					vertical: 'top',
					horizontal: 'right'
				}}));
			}
			else {
				dispatch(showMessage({ message: 'Organiaztion Save Failed' , anchorOrigin: {
					vertical: 'top',
					horizontal: 'right'
				}}));
				}
		  })
      .catch((error) => {
        dispatch(showMessage({ message: 'Organiaztion Save Failed', variant: 'error' , anchorOrigin: {
					vertical: 'top',
					horizontal: 'right'
				}}));
      })
      ;
      
		  
      },
    });
    setIsLoading(false);
    window.open('/apps/organizations', '_self');
  };



  return (
    <div className="flex space-y-12 sm:space-y-0 flex-1 w-full items-center justify-between py-8 sm:py-16 px-16 md:px-24">
      <motion.span
        initial={{ x: -20 }}
        animate={{ x: 0, transition: { delay: 0.2 } }}
      >
        <Typography className="text-24 md:text-32 font-extrabold tracking-tight">
          Organization
        </Typography>
      </motion.span>

      <div className="flex flex-1 items-center justify-end space-x-8">
        <motion.div
          className="flex flex-grow-0"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
        >
          <div>
            <input
              accept=".csv"
              style={{ display: "none" }}
              id="csv-upload"
              type="file"
              onChange={handleFileChange}
			  onClick={event => event.target.value = null}
            />
            <label htmlFor="csv-upload">
              <Button variant="contained" component="span">
                Upload CSV File
              </Button>
            </label>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
