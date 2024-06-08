import { lazy } from 'react';

const Mentor = lazy(() => import('./Mentor'));

/**
 * The E-Commerce app configuration.
 */
const MentorAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
            path: 'apps/mentors',
            element: <Mentor />,
        },
	]
};
export default MentorAppConfig;
