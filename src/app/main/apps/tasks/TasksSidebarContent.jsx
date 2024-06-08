import { Outlet } from 'react-router-dom';
import Button from '@mui/material/Button';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import { useAppDispatch } from 'app/store/hooks';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import FuseLoading from '@fuse/core/FuseLoading';
import _ from '@lodash';
import { Controller, useForm } from 'react-hook-form';
import Box from '@mui/system/Box';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Autocomplete from '@mui/material/Autocomplete/Autocomplete';
import Checkbox from '@mui/material/Checkbox/Checkbox';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import IconButton from '@mui/material/IconButton';
import { useDeepCompareEffect } from '@fuse/hooks';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import TaskPrioritySelector from './../tasks/task/TaskPrioritySelector';
import FormActionsMenu from './../tasks/task/FormActionsMenu';
import {
	useCreateTasksItemMutation,
	useDeleteTasksItemMutation,
	useGetTasksItemQuery,
	useGetTasksQuery,
	useGetTasksTagsQuery,
	useUpdateTasksItemMutation
} from './../tasks/TasksApi';
import SectionModel from './../tasks/models/SectionModel';
import TaskModel from './../tasks/models/TaskModel';
import { FormControlLabel, Switch } from '@mui/material';

/**
 * The tasks sidebar content.
 */

/**
 * Form Validation Schema
 */
const subTaskSchema = z.object({
	id: z.string().nonempty(),
	title: z.string().nonempty(),
	completed: z.boolean(),
	isLock: z.boolean(),
});
const schema = z.object({
	id: z.string().optional(),
	type: z.string().nonempty(),
	title: z.string(),
	notes: z.string().nullable().optional(),
	completed: z.boolean(),
	dueDate: z.string().nullable().optional(),
	priority: z.number(),
	tags: z.array(z.string()),
	assignedTo: z.string().nullable().optional(),
	subTasks: z.array(subTaskSchema).optional(),
	order: z.number(),
	isLock: z.boolean(),
	videoUrl: z.string().nullable().optional(),
	documentTitle: z.string().nullable().optional(),
	documentUrl: z.string().nullable().optional(),
	documentDescription: z.string().nullable().optional(),
});
function TasksSidebarContent({isUpdate, setRightSidebarOpen}) {
	 const routeParams = useParams();
	const taskId = routeParams?.productId;
	const taskType = routeParams['*'];
	// debugger
	const { data: task, isError } = useGetTasksItemQuery(routeParams['*'], {
		skip: !taskId || taskId === 'section'  || taskId === 'task' || !taskType
	});
	const { data: tags } = useGetTasksTagsQuery();
	const { data: tasks, isLoading } = useGetTasksQuery();
	const [updateTask] = useUpdateTasksItemMutation();
	const [deleteTask] = useDeleteTasksItemMutation();
	const [createTask] = useCreateTasksItemMutation();
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { control, watch, reset, handleSubmit, formState } = useForm({
		mode: 'onChange',
		resolver: zodResolver(schema)
	});
	const { isValid, dirtyFields, errors } = formState;
	const form = watch();
	/**
	 * Update Task
	 */
	useDeepCompareEffect(() => {
		if (!(!isValid || _.isEmpty(form) || !task || routeParams.productId === 'new') && !_.isEqual(task, form)) {
			onSubmit(form);
		}
	}, [form, isValid]);
	useEffect(() => {
		if (taskType != undefined && (taskType === 'section' || taskType === 'task') ) {
			if (taskType === 'section') {
				reset(SectionModel({}));
			}

			if (taskType === 'task') {
				reset(TaskModel({}));
			}
		} else {
			reset({ ...task });
		}
	}, [task, reset, taskId, taskType]);

	/**
	 * Form Submit
	 */
	function onSubmit(data) {
		deleteTask(data.id);
		createTask(data)
			.unwrap()
			.then((newTask) => {
				navigate(`/apps/e-commerce/products/new/${newTask?.id}`);
			})
			.catch((rejected) => {
				dispatch(showMessage({ message: `Error creating task item ${rejected}`, variant: 'error' }));
			});
		setRightSidebarOpen(false)
	}

	function onSubmitNew(data) {
		createTask(data)
			.unwrap()
			.then((newTask) => {
				navigate(`/apps/e-commerce/products/new/${newTask?.id}`);
			})
			.catch((rejected) => {
				dispatch(showMessage({ message: `Error creating task item ${rejected}`, variant: 'error' }));
			});
	}

	// if (isError && taskId !== 'new') {
	// 	setTimeout(() => {
	// 		navigate('/apps/tasks');
	// 		dispatch(showMessage({ message: 'NOT FOUND' }));
	// 	}, 0);
	// 	return null;
	// }

	if (isUpdate) {
		setRightSidebarOpen(false);
	}

	let checkIsUpdated = routeParams["*"] != "section" && routeParams["*"] != "task" && routeParams["*"] != ""; 

	function checkTaskById(arr, id) {
		if (typeof arr === "undefined") {
			return false;
		}
		for (let i = 0; i < arr.length; i++) {
			if (arr[i].id === id) {
				if (arr[i].type === "task") {
					return true; // Found a task with the given id
				} else {
					return false; // Found an element with the given id but it's not a task
				}
			}
		}
		return false; // No element found with the given id
	}

	const isTask = checkTaskById(tasks, taskType);

	return (
		<>
			<div className="relative flex flex-col flex-auto items-center px-24 sm:px-48">
				<div className="flex items-center justify-between border-b-1 w-full py-24 mt-16 mb-32">
					<Controller
						control={control}
						name="completed"
						render={({ field: { value, onChange } }) => (
							<Button
								className="font-semibold"
							>
								<span className="mx-8">
									{(taskType == "task" || isTask) ? 'LESSON' : 'MODULE'}
								</span>
							</Button>
						)}
					/>
					<div className="flex items-center">
						{routeParams?.productId !== 'new' && <FormActionsMenu taskId={task?.productId} />}
						<IconButton
							//component={NavLinkAdapter}
							to="/apps/tasks"
							size="large"
							onClick={() => {setRightSidebarOpen(false)}}
						>
							<FuseSvgIcon>heroicons-outline:x</FuseSvgIcon>
						</IconButton>
					</div>
				</div>

				<Controller
					control={control}
					name="title"
					render={({ field }) => (
						<TextField
							className="mt-32 max-h-auto"
							{...field}
							label={`${_.upperFirst(form.type == 'Section' ? '' : '')} Name`}
							placeholder={`${_.upperFirst(form.type == 'Section' ? '' : '')} Name`}
							id="title"
							error={!!errors.title}
							helperText={errors?.title?.message}
							variant="outlined"
							fullWidth
							multiline
							minRows={3}
							maxRows={10}
						/>
					)}
				/>

				<Controller
					control={control}
					name="notes"
					render={({ field }) => (
						<TextField
							className="mt-32"
							{...field}
							label="Description"
							placeholder="Description"
							id="notes"
							error={!!errors.notes}
							helperText={errors?.notes?.message}
							variant="outlined"
							fullWidth
							multiline
							minRows={5}
							maxRows={10}
						/>
					)}
				/>

				{(taskType == 'task' || isTask) && (
					<>
					<Controller
						control={control}
						name="videoUrl"
						render={({ field }) => (
							<TextField
								className="mt-32"
								{...field}
								label="Video URL"
								placeholder="Video URL"
								id="videoUrl"
								error={!!errors.notes}
								helperText={errors?.notes?.message}
								variant="outlined"
								fullWidth
								multiline
								minRows={5}
								maxRows={10}
							/>
						)}
					/>
					<Controller
						control={control}
						name="documentTitle"
						render={({ field }) => (
							<TextField
								className="mt-32"
								{...field}
								label="Document Title"
								placeholder="Document Title"
								id="documentTitle"
								error={!!errors.notes}
								helperText={errors?.notes?.message}
								variant="outlined"
								fullWidth
								multiline
								minRows={3}
								maxRows={10}
							/>
						)}
					/>

					<Controller
						control={control}
						name="documentDescription"
						render={({ field }) => (
							<TextField
								className="mt-32"
								{...field}
								label="Document Description"
								placeholder="Document Description"
								id="documentDescription"
								error={!!errors.notes}
								helperText={errors?.notes?.message}
								variant="outlined"
								fullWidth
								multiline
								minRows={5}
								maxRows={10}
							/>
						)}
					/>



					<Controller
						control={control}
						name="documentUrl"
						render={({ field }) => (
							<TextField
								className="mt-32"
								{...field}
								label="Document URL"
								placeholder="Document URL"
								id="documentUrl"
								error={!!errors.notes}
								helperText={errors?.notes?.message}
								variant="outlined"
								fullWidth
								multiline
								minRows={2}
								maxRows={10}
							/>
						)}
					/>

					<div style={{width: '100%', marginTop: '10px'}}>
						Lock Status <span style={{marginRight: '10px', display: 'inline-block'}}></span>

						<Controller
							name="isLock"
							control={control}
							render={({ field: { onChange, value } }) => (
								<FormControlLabel
								control={<Switch checked={value} onChange={onChange} />}
								label=""
								/>
							)}
							/>
					</div>

					</>
				)}
			</div>
			{routeParams.productId === 'new' && (
				<Box
					className="flex items-center mt-40 py-14 pr-16 pl-4 sm:pr-48 sm:pl-36 border-t"
					sx={{ backgroundColor: 'background.default' }}
				>
					<Button
						onClick={() => {
							navigate(-1);
						}}
						className="ml-auto"
					>
						Cancel
					</Button>
					<Button
						className="ml-8"
						variant="contained"
						color="secondary"
						disabled={_.isEmpty(dirtyFields) || !isValid}
						onClick={handleSubmit(checkIsUpdated ? onSubmit : onSubmitNew)}
					>
						Create
					</Button>
				</Box>
			)}
		</>
	);
}

export default TasksSidebarContent;
