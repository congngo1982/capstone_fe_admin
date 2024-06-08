import { lazy } from 'react';
import QuizManagement from './QuizManagement';
import Quiz from './Quiz';

const Group = lazy(() => import('./Quiz'));

/**
 * The E-Commerce app configuration.
 */
const GroupAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
            path: 'apps/quiz',
            element: <Quiz />,
        },
        {
            path: 'apps/quiz/management',
            element: <QuizManagement />,
        },
	]
};
export default GroupAppConfig;
