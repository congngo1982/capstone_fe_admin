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

export default function WaitingHeader() {
  const routeParams = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [csvData, setCsvData] = useState(null);

  return (
    <div className="flex space-y-12 sm:space-y-0 flex-1 w-full items-center justify-between py-8 sm:py-16 px-16 md:px-24">
      <motion.span
        initial={{ x: -20 }}
        animate={{ x: 0, transition: { delay: 0.2 } }}
      >
        <Typography className="text-24 md:text-32 font-extrabold tracking-tight">
          Waiting
        </Typography>
      </motion.span>

      <div className="flex flex-1 items-center justify-end space-x-8">
        <motion.div
          className="flex flex-grow-0"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
        >
        </motion.div>
      </div>
    </div>
  );
}
