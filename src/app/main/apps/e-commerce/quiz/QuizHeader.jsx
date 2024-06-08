import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import _ from '@lodash';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { baseURL } from 'app/store/apiService';
import { navigateConfig } from 'app/configs/navigateConfig';
import { useAppDispatch } from 'app/store/hooks';
import FuseLoading from '@fuse/core/FuseLoading';
import QuizHeaderAll from './QuizHeaderAll';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';

export default function QuizHeader({quiz}) {
	const dispatch = useAppDispatch();
	const [searchParams, setSearchParams] = useSearchParams();
	const [isUpdate, setIsUpdate] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const [tempQuiz, setTempQuiz] = useState(null);

	useEffect(() => {
		var id = searchParams.get("id");
		if (id === null) {
			setIsUpdate(false);
		}
		else {
			if (quiz == null || typeof quiz === "undefined") {
				setIsLoading(true);
				axios.get(baseURL + `/quiz/details/${id}`).then((response) => {
					setTempQuiz(response.data);
				  });
			}
		}
	})

	function validateQuiz(quiz) {
		const errors =  "";
	
		if (!quiz.title) return new String('Quiz title is required');
		if (!quiz.duration || isNaN(quiz.duration) || Number(quiz.duration) < 0) return new String('Quiz duration must be a number not less than 0');
		if (!quiz.passPercentage || isNaN(quiz.passPercentage) || Number(quiz.passPercentage) < 0) return new String('Quiz passPercentage must be a number not less than 0');
		if (!quiz.passPercentage || isNaN(quiz.passPercentage) || Number(quiz.passPercentage) > 100) return new String('Quiz passPercentage must be a number not more than 100');
		if (!quiz.score || isNaN(quiz.score) || Number(quiz.score) < 0) return new String('Quiz score must be a number not less than 0');
		if (!quiz.lessonId) return new String('Lesson of quiz is required');
	
		if (!Array.isArray(quiz?.quizQuestions) || quiz?.quizQuestions.length === 0) {
			return new String('Quiz must have at least one question! Please check your template file');
		} else {
			quiz.quizQuestions.forEach((question, questionIndex) => {
				if (!question.description) return new String(`Question ${questionIndex + 1} description is required`);
				if (!question.type) return new String(`Question ${questionIndex + 1} type is required`);
	
				if (!Array.isArray(question.questionAnswers) || question.questionAnswers.length === 0) {
					return new String(`Question ${questionIndex + 1} must have at least one answer`);
				} else {
					question.questionAnswers.forEach((answer, answerIndex) => {
						if (!answer.description && answer.description !== 0) return new String(`Question ${questionIndex + 1}, Answer ${answerIndex + 1} description is required`);
						if (typeof answer.isCorrect !== 'boolean') return new String(`Question ${questionIndex + 1}, Answer ${answerIndex + 1} isCorrect must be a boolean`);
					});
				}
			});
		}
	
		return errors;
	}

	const handleSubmitQuiz = () => {
		let msg = "";
		msg = validateQuiz(quiz);

		if (msg != "") {
			dispatch(showMessage({ message: msg, variant: 'error' , anchorOrigin: {
				vertical: 'top',
				horizontal: 'right'
			}}));
			return;
		}

		validateQuiz(quiz);
		setIsLoading(true);
		axios.post(baseURL + "/quiz", quiz).then(response => {
			if (response.status == 200 || response.status == 201) {
				dispatch(showMessage({ message: 'Quiz Saved' , anchorOrigin: {
					vertical: 'top',
					horizontal: 'right'
				}}));
				setIsLoading(false);
        window.open('/apps/quiz', '_self');
			}
			else {
				dispatch(showMessage({ message: 'Quiz Save Failed' , anchorOrigin: {
					vertical: 'top',
					horizontal: 'right'
				}}));
				setIsLoading(false);
				window.open('/apps/quiz', '_self');
				}
		})
		.catch(error => {
			dispatch(showMessage({ message: 'Quiz Save Failed', variant: 'error' , anchorOrigin: {
				vertical: 'top',
				horizontal: 'right'
			}}));
			setIsLoading(false);
			window.open('/apps/quiz', '_self');
		});
	}

	const handleDisableQuiz = () => {
		setIsLoading(true);
		axios.put(baseURL + "/quiz/deactivate", {
			id: searchParams.get("id")
		}).then(response => {
			if (response.status == 200 || response.status == 201) {
				dispatch(showMessage({ message: 'Quiz Disabled' , anchorOrigin: {
					vertical: 'top',
					horizontal: 'right'
				}}));
				setIsLoading(false);
        window.open('/apps/quiz', '_self');
			}
			else {
				dispatch(showMessage({ message: 'Disable Quiz Failed' , anchorOrigin: {
					vertical: 'top',
					horizontal: 'right'
				}}));
				setIsLoading(false);
				window.open('/apps/quiz', '_self');
				}
		})
		.catch(error => {
			dispatch(showMessage({ message: 'Disable Quiz Failed', variant: 'error' , anchorOrigin: {
				vertical: 'top',
				horizontal: 'right'
			}}));
			setIsLoading(false);
			window.open('/apps/quiz', '_self');
		});
	}

	if (isLoading) {
		return <FuseLoading />;
	
	}


	const theme = useTheme();
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
						to="/apps/quiz"
						color="inherit"
					>
						<FuseSvgIcon size={20}>
							{theme.direction === 'ltr'
								? 'heroicons-outline:arrow-sm-left'
								: 'heroicons-outline:arrow-sm-right'}
						</FuseSvgIcon>
						<span className="flex mx-4 font-medium">Quiz</span>
					</Typography>
				</motion.div>

				<div className="flex items-center max-w-full">
					<motion.div
						className="hidden sm:flex"
						initial={{ scale: 0 }}
						animate={{ scale: 1, transition: { delay: 0.3 } }}
					>
						<img
								className="w-32 sm:w-48 rounded"
								src="assets/images/apps/ecommerce/product-image-placeholder.png"
								alt={name}
							/>
					</motion.div>
					<motion.div
						className="flex flex-col min-w-0 mx-8 sm:mx-16"
						initial={{ x: -20 }}
						animate={{ x: 0, transition: { delay: 0.3 } }}
					>
						<Typography className="text-16 sm:text-20 truncate font-semibold">
							{name || 'New Quiz'}
						</Typography>
						<Typography
							variant="caption"
							className="font-medium"
						>
							Quiz Detail
						</Typography>
					</motion.div>
				</div>
			</div>
			<motion.div
				className="flex flex-1 w-full"
				initial={{ opacity: 0, x: 20 }}
				animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
			>
				{(!isUpdate) ? (
					<Button
                    className="whitespace-nowrap mx-4"
                    variant="contained"
                    color="secondary"
                    onClick={handleSubmitQuiz}
                >
                    Create
                </Button>
				) : (
					<Button
					className="whitespace-nowrap mx-4"
					variant="contained"
					color="error"
					onClick={handleDisableQuiz}
					startIcon={
						<FuseSvgIcon className="hidden sm:flex">
						  heroicons-outline:x
						</FuseSvgIcon>
					  }
				>
					Disable
				</Button>
				)}
			</motion.div>
		</div>
	);
}
