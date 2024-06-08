import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import { useFormContext } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import _ from "@lodash";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import {
  useCreateECommerceProductMutation,
  useDeleteECommerceProductMutation,
  useUpdateECommerceProductMutation,
} from "../ECommerceApi";
import axios from "axios";
import { baseURL } from "app/store/apiService";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import { useAppDispatch } from "app/store/hooks";
import { navigateConfig } from "app/configs/navigateConfig";
import { set } from "lodash";
import { useState } from "react";
import FuseLoading from "@fuse/core/FuseLoading";

/**
 * The product header.
 */
function ProductHeader({ course }) {
  const routeParams = useParams();
  const { productId } = routeParams;
  const [createProduct] = useCreateECommerceProductMutation();
  const [saveProduct] = useUpdateECommerceProductMutation();
  const [removeProduct] = useDeleteECommerceProductMutation();
  const methods = useFormContext();
  const { formState, watch, getValues } = methods;
  const { isValid, dirtyFields } = formState;
  const theme = useTheme();
  const navigate = useNavigate();
  const { name, images, featuredImageId } = watch();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  function handleSaveProduct() {
    saveProduct(getValues());
  }

  const user = JSON.parse(localStorage.getItem("USER"));

  if (isLoading) {
    return <FuseLoading />;
  }

console.log(course);

function isValidURL(string) {
  const regex = /^(https?:\/\/)?([^\s$.?#].[^\s]*)$/i;
  return regex.test(string);
}

function isYouTubeURL(string) {
  try {
      const url = new URL(string);
      const hostname = url.hostname.toLowerCase();

      // Check if the hostname is one of YouTube's domains
      if (hostname === 'www.youtube.com' || hostname === 'youtube.com' || hostname === 'youtu.be') {
          // Validate the pathname and query parameters for YouTube video URLs
          if ((hostname === 'www.youtube.com' || hostname === 'youtube.com') && url.pathname === '/watch' && url.searchParams.has('v')) {
              return true;
          } else if (hostname === 'youtu.be' && url.pathname.length > 1) {
              return true;
          }
      }
      return false;
  } catch (_) {
      return false;
  }
}


function validateCourse(course) {
  if (!course.name) return new String('Course name is required');
  if (!course.duration || isNaN(course.duration) || Number(course.duration) < 0) return new String('Course duration must be a number not less than 0');
  if (!course.imgUrl) return new String('Course imgUrl is required');
  if (!course.age) return new String('Course age is required');
  if (!course.projectId) return new String('Course projectId is required');
  if (!course.description) return new String('Course description is required');
  if (!course.income) return new String('Course income is required');
  if (!course.outcome) return new String('Course outcome is required');

  if (!Array.isArray(course.courseModules) || course.courseModules.length === 0) {
      return new String('Course must have at least one module');
  }

  for (let moduleIndex = 0; moduleIndex < course?.courseModules?.length; moduleIndex++) {
      const module = course.courseModules[moduleIndex];
      if (!module.description) {
          return new String(`Module ${moduleIndex + 1} description is required`);
      }
      if (!module.title) return new String(`Module ${moduleIndex + 1} title is required`);

      if (!Array.isArray(module.moduleLessons) || module.moduleLessons.length === 0) {
          return new String(`Module ${moduleIndex + 1} must have at least one lesson`);
      }

      for (let lessonIndex = 0; lessonIndex < module?.moduleLessons?.length; lessonIndex++) {
          const lesson = module.moduleLessons[lessonIndex];
          if (!lesson.description) return new String(`Module ${moduleIndex + 1}, Lesson ${lessonIndex + 1} description is required`);
          if (!lesson.title) return new String(`Module ${moduleIndex + 1}, Lesson ${lessonIndex + 1} title is required`);
          if (!lesson.videoUrl) return new String(`Module ${moduleIndex + 1}, Lesson ${lessonIndex + 1} videoUrl is required`);
          if (!isYouTubeURL(lesson.videoUrl)) return new String(`Module ${moduleIndex + 1}, Lesson ${lessonIndex + 1} videoUrl is not a valid YouTube URL`);
          if (!Array.isArray(lesson.lessonDocuments) || lesson.lessonDocuments.length === 0) {
              return new String(`Module ${moduleIndex + 1}, Lesson ${lessonIndex + 1} must have at least one document`);
          }

          for (let docIndex = 0; docIndex < lesson.lessonDocuments.length; docIndex++) {
              const document = lesson.lessonDocuments[docIndex];
              if (!document.description) return new String(`Module ${moduleIndex + 1}, Lesson ${lessonIndex + 1}, Document ${docIndex + 1} description is required`);
              if (!document.documentUrl) return new String(`Module ${moduleIndex + 1}, Lesson ${lessonIndex + 1}, Document ${docIndex + 1} documentUrl is required`);
              if (!isValidURL(document.documentUrl)) return new String(`Module ${moduleIndex + 1}, Lesson ${lessonIndex + 1}, Document ${docIndex + 1} documentUrl is not a valid URL`);
              if (!document.title) return new String(`Module ${moduleIndex + 1}, Lesson ${lessonIndex + 1}, Document ${docIndex + 1} title is required`);
          }
      }
  }

  if (!Array.isArray(course?.courseCoursePackages) || course?.courseCoursePackages?.length === 0) {
      return new String('Course must have at least one course package');
  }

  for (let coursePackageIndex = 0; coursePackageIndex < course?.courseCoursePackages?.length; coursePackageIndex++) {
      const coursePackage = course?.courseCoursePackages[coursePackageIndex];
      if (!coursePackage.name) return new String(`Course coursePackage ${coursePackageIndex + 1} name is required`);
      if (!coursePackage.maxStudent || isNaN(coursePackage.maxStudent) || Number(coursePackage.maxStudent) < 0) return new String(`Course coursePackage ${coursePackageIndex + 1} maxStudent must be a number not less than 0`);
      if (!coursePackage.price || isNaN(coursePackage.price) || Number(coursePackage.price) < 0) return new String(`Course package ${coursePackageIndex + 1} price must be a number not less than 0`);
  }

  return "";
}



  function handleCreateCourse() {
    let message = "";
    message = validateCourse(course);

    console.log(message)

    if (message != "") {
      dispatch(
        showMessage({
          message: message,
          variant: "error",
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
        })
      );
      setIsLoading(false);
      return;
    }

    axios.post(baseURL + "/courses", course).then((response) => {
      setIsLoading(true);
      if (response.status == 200 || response.status == 201) {
        dispatch(
          showMessage({
            message: "Course Saved",
            anchorOrigin: {
              vertical: "top",
              horizontal: "right",
            },
          })
        );
        setIsLoading(false);
        window.open("/apps/e-commerce/products", "_self");
      } else {
        dispatch(
          showMessage({
            message: "Course Save Failed",
            anchorOrigin: {
              vertical: "top",
              horizontal: "right",
            },
          })
        );
        setIsLoading(false);
        window.open("/apps/e-commerce/products", "_self");
      }
    })
    .catch((error) => {
      dispatch(
        showMessage({
          message: "Course Save Failed",
          variant: "error",
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
        })
      );
      setIsLoading(false);
      window.open("/apps/e-commerce/products", "_self");
    });
  }

  function handleApprove() {
    setIsLoading(true);
    axios
      .put(baseURL + "/courses/approve", {
        ...course,
        projectId: course.project.id,
      })
      .then((response) => {
        if (response.status == 200 || response.status == 201) {
          dispatch(
            showMessage({
              message: "Course Approved",
              anchorOrigin: {
                vertical: "top",
                horizontal: "right",
              },
            })
          );
          setIsLoading(false);
          window.open("/apps/e-commerce/products", "_self");
        } else {
          dispatch(
            showMessage({
              message: "Course Approve Failed",
              anchorOrigin: {
                vertical: "top",
                horizontal: "right",
              },
            })
          );
          setIsLoading(false);
        }
      })
      .catch((error) => {
        dispatch(
          showMessage({
            message: "Course Approve Failed",
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

  function handleDisable() {
    setIsLoading(true);
	axios
	.put(baseURL + "/courses/disable", {
	  ...course,
	  projectId: course.project.id,
	})
	.then((response) => {
	  if (response.status == 200 || response.status == 201) {
		dispatch(
		  showMessage({
			message: "Course Disabled",
			anchorOrigin: {
			  vertical: "top",
			  horizontal: "right",
			},
		  })
		);
    setIsLoading(false);
		window.open("/apps/e-commerce/products", "_self");
	  } else {
		dispatch(
		  showMessage({
			message: "Course Disable Failed",
			anchorOrigin: {
			  vertical: "top",
			  horizontal: "right",
			},
		  })
		);
    setIsLoading(false);
	  }
	}).catch((error) => {
		dispatch(
			showMessage({
				variant: "error",
			  message: error.response.data.message,
			  anchorOrigin: {
				vertical: "top",
				horizontal: "right",
			  },
			})
		  );	
            setIsLoading(false);		
	});
  }

  return (
    <div className="flex flex-col sm:flex-row flex-1 w-full items-center justify-between space-y-8 sm:space-y-0 py-24 sm:py-32 px-24 md:px-32">
      <div className="flex flex-col items-start space-y-8 sm:space-y-0 w-full sm:max-w-full min-w-0">
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1, transition: { delay: 0.3 } }}
        >
          <Typography
            className="flex items-center sm:mb-12"
            component={Link}
            role="button"
            to="/apps/e-commerce/products"
            color="inherit"
          >
            <FuseSvgIcon size={20}>
              {theme.direction === "ltr"
                ? "heroicons-outline:arrow-sm-left"
                : "heroicons-outline:arrow-sm-right"}
            </FuseSvgIcon>
            <span className="flex mx-4 font-medium">Course</span>
          </Typography>
        </motion.div>

        <div className="flex items-center max-w-full">
          <motion.div
            className="hidden sm:flex"
            initial={{ scale: 0 }}
            animate={{ scale: 1, transition: { delay: 0.3 } }}
          >
            {images && images.length > 0 && featuredImageId ? (
              <img
                className="w-32 sm:w-48 rounded"
                src={_.find(images, { id: featuredImageId })?.url}
                alt={name}
              />
            ) : (
              <img
                className="w-32 sm:w-48 rounded"
                src="assets/images/apps/ecommerce/product-image-placeholder.png"
                alt={name}
              />
            )}
          </motion.div>
          <motion.div
            className="flex flex-col min-w-0 mx-8 sm:mx-16"
            initial={{ x: -20 }}
            animate={{ x: 0, transition: { delay: 0.3 } }}
          >
            <Typography className="text-16 sm:text-20 truncate font-semibold">
              {name || "New Course"}
            </Typography>
            {productId != "new" ? (
              <Typography variant="caption" className="font-medium">
                This course can not be updated after creating. If this course is
                not available, please disable it.
              </Typography>
            ) : (
              <Typography variant="caption" className="font-medium">
                Course Detail
              </Typography>
            )}
          </motion.div>
        </div>
      </div>
      <motion.div
        className="flex flex-1 w-full"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
      >
        {user?.role === 'MANAGER' && productId !== "new" && course.status === "PENDING" ? (
          <Button
            className="whitespace-nowrap mx-4"
            variant="contained"
            color="success"
            disabled={!(course.status === "PENDING")}
            onClick={handleApprove}
            startIcon={
              <FuseSvgIcon className="hidden sm:flex">
                heroicons-outline:check
              </FuseSvgIcon>
            }
          >
            Approve
          </Button>
        ) : user?.role === 'MANAGER' &&  productId !== "new" && course.status === "ACTIVE" ? (
         <> <Button
		 className="whitespace-nowrap mx-4"
		 variant="contained"
		 color="error"
		 disabled={!(course.status === "ACTIVE")}
		 onClick={handleDisable}
		 startIcon={
		   <FuseSvgIcon className="hidden sm:flex">
			 heroicons-outline:x
		   </FuseSvgIcon>
		 }
	   >
		 Disable
	   </Button></>
        ) : productId !== "new" && course.status === "INACTIVE" ? (
          <> </> // Empty fragment
        ) : (
         <> 
        {
          productId == "new"  ? (
            <Button
          className="whitespace-nowrap mx-4"
          variant="contained"
          color="secondary"
          onClick={handleCreateCourse}
          >
          Create
          </Button>
          ) : <></>
        }
         </>
        )}
      </motion.div>
    </div>
  );
}

export default ProductHeader;
