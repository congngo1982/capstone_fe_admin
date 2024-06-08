import GlobalStyles from '@mui/material/GlobalStyles';
import CourseHeader from './CourseHeader';
import CourseTable from './CourseTable';

/**
 * The products page.
 */
function Products() {
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
				<CourseHeader />
				<CourseTable />
			</div>
		</>
	);
}

export default Products;
