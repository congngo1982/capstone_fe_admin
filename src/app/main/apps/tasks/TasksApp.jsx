import FusePageSimple from '@fuse/core/FusePageSimple';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import TasksSidebarContent from './TasksSidebarContent';
import TasksHeader from './TasksHeader';
import TasksList from './TasksList';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .FusePageSimple-header': {
		backgroundColor: theme.palette.background.paper
	}
}));

/**
 * The tasks app.
 */
function TasksApp({isUpdate, course, setCourse}) {
	const routeParams = useParams();

	// debugger
	const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	useEffect(() => {
		if (routeParams["*"] == "") {
			setRightSidebarOpen(false);
		}
		else {
			setRightSidebarOpen(Boolean(routeParams.productId));
		}
	}, [routeParams]);
	return (
		<Root
			header={<TasksHeader />}
			content={<TasksList isUpdate={isUpdate} course={course} setCourse={setCourse} />}
			rightSidebarContent={<TasksSidebarContent isUpdate={isUpdate} setRightSidebarOpen={setRightSidebarOpen} />}
			rightSidebarOpen={rightSidebarOpen}
			rightSidebarOnClose={() => setRightSidebarOpen(false)}
			rightSidebarWidth={640}
		/>
	);
}

export default TasksApp;
