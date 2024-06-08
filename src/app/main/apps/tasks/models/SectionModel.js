import _ from '@lodash';
/**
 * The section model.
 */
const SectionModel = (data) =>
	_.defaults(data || {}, {
		type: 'section',
		title: '',
		notes: '',
		completed: false,
		dueDate: null,
		priority: 0,
		tags: [],
		assignedTo: null,
		subTasks: [],
		isLock: true,
		order: 1,
		documentTitle: '',
		videoUrl: '',
		documentUrl: '',
		documentDescription: '',
	});
export default SectionModel;
