import _ from '@lodash';
/**
 * The Project model.
 */
const ProjectModel = (data) =>
	_.defaults(data || {}, {
		id: _.uniqueId('Project-'),
		ageRecomment: '',
		goal: '',
		introVideoUrl: '',
		skill: '',
		status: '',
	});
export default ProjectModel;
