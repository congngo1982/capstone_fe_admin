import GlobalStyles from '@mui/material/GlobalStyles';
import ProjectHeader from './ProjectsHeader';
import ProjectTable from './ProjectTable';

/**
 * The Project page.
 */
function Project() {
	return (
		<>
			<GlobalStyles
				styles={() => ({
					'#root': {
						maxHeight: '100vh'
					}
				})}
			/>
			<div className="w-full h-full container flex flex-col">
				<ProjectHeader />
				<ProjectTable />
			</div>
		</>
	);
}

export default Project;
