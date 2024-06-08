import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import TaskForm from './../tasks/task/TaskForm';
import ProjectApp from './ProjectApp';

const Projects = lazy(() => import('./projects/Project'));

/**
 * The E-Commerce app configuration.
 */
const ProjectAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
            path: 'apps/projects',
            element: <Projects />,
        },
        {
            path: 'apps/projects/management',
            element: <ProjectApp />,
        },
        // {
        //     path: 'projects',
        //     element: <Projects />,
        //     // children: [
        //     // 	{
        //     // 		path: ':id',
        //     // 		element: <TaskForm />
        //     // 	},
        //     // 	{
        //     // 		path: ':id/:type',
        //     // 		element: <TaskForm />
        //     // 	}
        //     // ]
        // },
        // {
        //     path: 'projects/:projectId/*',
        //     element: <Project />
        // }
        
	]
};
export default ProjectAppConfig;
