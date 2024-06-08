import { Box } from "@mui/system";
import Papa from "papaparse";
import {
  Autocomplete,
  Button,
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
import GroupHeader from "./GroupHeader";
import { set } from "lodash";

function GroupManagement() {
  const [isUpdate, setIsUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [subscriptions, setSubscriptions] = useState([]);
  const [group, setGroup] = useState(null);
  const [tags, setTags] = useState([]);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  function handleTabChange(event, value) {
    setTabValue(value);
  }

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("USER"));
    if (user != null) {
      axios
        .get(baseURL + `/subscription/mentor/${user.userId}`)
        .then((response) => {
          setSubscriptions(response.data);
        });
    }
  }, []);

  if (isLoading) {
    return <FuseLoading />;
  }

  const handleFileChange = (e) => {
    setIsLoading(true);
    const file = e.target.files[0];
    Papa.parse(file, {
        delimiter: ",",
        header: false,
        complete: (result) => {
            const emails = result.data.map(row => row[0].trim()); // Assuming each line has only one email
            const newGroup = {
                ...group,
                name: file.name.replace(".csv", ""),
                learnerEmail: emails,
                mentorId: JSON.parse(localStorage.getItem("USER")).userId,
            };
            axios.post(baseURL + "/group/import", newGroup).then((response) => {
                if (response.status === 200 || response.status === 201) {
                    dispatch(
                        showMessage({
                            message: "Group Saved",
                            anchorOrigin: {
                                vertical: "top",
                                horizontal: "right",
                            },
                        })
                    );
                    setIsLoading(false);
                    window.open("/apps/groups", "_self");
                } else {
                    dispatch(
                        showMessage({
                            message: "Group Save Failed",
                            variant: "error",
                            anchorOrigin: {
                                vertical: "top",
                                horizontal: "right",
                            },
                        })
                    );
                    setIsLoading(false);
                }
            }).catch((error) => {
                console.log(error);
                dispatch(
                    showMessage({
                        message: error.response.data.message,
                        variant: "error",
                        anchorOrigin: {
                            vertical: "top",
                            horizontal: "right",
                        },
                    })
                );
                setIsLoading(false);
            });
        },
    });
};

  if (subscriptions.length === 0) {
    return (
      <FusePageCarded
        header={<GroupHeader isCreate={true} />}
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
                  No subscription found!
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
        header={<GroupHeader isCreate={true} />}
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
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Subscription"
                    onChange={(e) => {
                      setGroup({ ...group, subscriptionId: e.target.value });
                    }}
                  >
                    {subscriptions?.map((subscription) => (
                      <MenuItem key={subscription.id} value={subscription.id}>
                        {subscription.coursePackage.course.name +
                          " - " +
                          subscription.coursePackage.name}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    mt: "20px",
                  }}
                >
                  <div>
                    <input
                      accept=".csv"
                      style={{ display: "none" }}
                      id="csv-upload"
                      type="file"
                      onChange={handleFileChange}
                      onClick={(event) => (event.target.value = null)}
                    />
                    <label htmlFor="csv-upload">
                      <Button variant="contained" component="span">
                        Upload CSV File
                      </Button>
                    </label>
                  </div>
                </Box>
              </div>
            </div>
          </>
        }
      />
    );
  }
}

export default GroupManagement;
