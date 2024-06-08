import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import FuseLoading from '@fuse/core/FuseLoading';
import TaskListItem from './TaskListItem';
import SectionListItem from './SectionListItem';
import { useGetTasksQuery, useReorderTasksMutation } from './TasksApi';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import { useEffect, useState } from 'react';

/**
 * The tasks list.
 */
function TasksList({isUpdate, course, setCourse}) {
	const { data: tasks, isLoading } = useGetTasksQuery();
	const [reorderList] = useReorderTasksMutation();

	const [mappedObject, setMappedObject] = useState([]);
	const [originalObject, setOriginalObject] = useState([]);

	if (!isUpdate) {
		useEffect(() => {
			// Function to group tasks under sections and update mappedObject
			function groupTasksUnderSections(arr) {
				if (typeof arr === 'undefined') {
					return [];
				}
				if (arr.length === 0) {
					return arr;
				}
				let result = [];
				let currentSection = null;
	
				for (let i = 0; i < arr.length; i++) {
					const currentItem = arr[i];
					if (currentItem.type === 'section') {
						if (currentSection !== null) {
							result.push(currentSection);
						}
						currentSection = { ...currentItem, subTasks: [] };
					} else if (currentSection !== null && currentItem.type === 'task') {
						currentSection.subTasks.push(currentItem);
					}
				}
	
				if (currentSection !== null) {
					result.push(currentSection);
				}
	
				return result;
			}
	
			// Group tasks under sections and update mappedObject
			const transformedArray = groupTasksUnderSections(tasks);
			console.log(transformedArray)
			const mappedObj = transformedArray.map((item) => {
				if (item.type === 'section') {
					return {
						description: item.notes,
						title: item.title,
						moduleLessons: item.subTasks.map((task) => ({
							description: task.notes,
							title: task.title,
							isLock: !task.isLock,
							videoUrl: task.videoUrl,
							lessonDocuments: [
								{
									description: task.documentDescription,
									documentUrl: task.documentUrl,
									title: task.documentTitle,
								},
							],
							lessonQuizzes: []
						})),
					};
				} else if (item.type === 'task') {
					console.log(item)
					return {
						description: item.notes,
						title: item.title,
						moduleLessons: [
							{
								description: item.notes,
								title: item.title,
								isLock: !item.isLock,
								videoUrl: item.videoUrl,
								lessonDocuments: [
									{
										description: item.documentDescription,
										documentUrl: item.documentUrl,
										title: item.documentTitle,
									},
								],
								lessonQuizzes: []
							},
						],
					};
				}
			});
			setMappedObject(mappedObj);
			setOriginalObject(tasks);
		}, [tasks]);
	
		useEffect(() => {
			setCourse({...course, courseModules: mappedObject});
		}, [mappedObject]);
	
	}
	else {
		useEffect(() => {
			function generateUniqueId() {
				return Date.now().toString(36) + Math.random().toString(36).substr(2);
			}

			const transformedArray = [];

			function convertToOriginalFormat(courseModules) {
				courseModules.forEach(module => {
					// Create a section object
					const section = {
						id: generateUniqueId(), // You may implement a function to generate a unique ID
						type: 'section',
						title: module.title,
						notes: module.description,
						completed: false,
						dueDate: null,
						priority: 0,
						tags: [],
						assignedTo: null,
						subTasks: [],
						order: 1,
						videoUrl: '',
						documentTitle: '',
						documentUrl: '',
						documentDescription: ''
					};

					transformedArray.push(section);

					module.moduleLessons.forEach(lesson => {
						// Create a task object
						const task = {
							id: generateUniqueId(), // You may implement a function to generate a unique ID
							type: 'task',
							title: lesson.title,
							notes: lesson.description,
							isLock: lesson.isLock,
							completed: false,
							dueDate: null,
							priority: 0,
							tags: [],
							assignedTo: null,
							subTasks: [],
							order: 1,
							videoUrl: lesson.videoUrl,
							documentTitle: lesson.lessonDocuments[0].title,
							documentUrl: lesson.lessonDocuments[0].documentUrl,
							documentDescription: lesson.lessonDocuments[0].description
						};
			
						transformedArray.push(task);
					});
			
				});
			
				return transformedArray;
			}

			setOriginalObject(convertToOriginalFormat(course.courseModules));
		}, [mappedObject])
	}

	console.log(course)
	

	if (isLoading) {
		return <FuseLoading />;
	}

	if (originalObject.length === 0) {
		return (
			<div className="flex flex-1 items-center justify-center h-full">
				<Typography
					color="text.secondary"
					variant="h5"
				>
					There are no modules and lesson!
				</Typography>
			</div>
		);
	}

	function onDragEnd(result) {
		const { source, destination } = result;

		if (!destination) {
			return;
		}

		const { index: destinationIndex } = destination;
		const { index: sourceIndex } = source;

		if (destinationIndex === sourceIndex) {
			return;
		}

		reorderList({
			startIndex: sourceIndex,
			endIndex: destinationIndex
		});
	}

	return (
		<List className="w-full m-0 p-0">
			<DragDropContext onDragEnd={onDragEnd}>
				<Droppable
					droppableId="list"
					type="list"
					direction="vertical"
				>
					{(provided) => (
						<>
							<div ref={provided.innerRef}>
								{originalObject.map((item, index) => {
									if (item.type === 'task') {
										return (
											<TaskListItem
												data={item}
												index={index}
												key={item.id}
											/>
										);
									}

									if (item.type === 'section') {
										return (
											<SectionListItem
												key={item.id}
												index={index}
												data={item}
											/>
										);
									}

									return null;
								})}
							</div>
							{provided.placeholder}
						</>
					)}
				</Droppable>
			</DragDropContext>
		</List>
	);
}

export default TasksList;
