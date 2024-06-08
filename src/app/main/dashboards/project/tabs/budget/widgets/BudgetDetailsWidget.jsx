import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { memo } from 'react';
import Chip from '@mui/material/Chip';
import FuseLoading from '@fuse/core/FuseLoading';
import { useGetProjectDashboardWidgetsQuery } from '../../../ProjectDashboardApi';
import formatDate from 'app/theme-layouts/moment/moment';

/**
 * The BudgetDetailsWidget widget.
 */
function BudgetDetailsWidget({data}) {
	const { data: widgets, isLoading } = useGetProjectDashboardWidgetsQuery();

	if (isLoading) {
		return <FuseLoading />;
	}

	const widget = widgets.budgetDetails;

	if (!widget) {
		return null;
	}

	const { columns, rows } = widget;
	return (
		<Paper className="flex flex-col flex-auto p-24 shadow rounded-2xl overflow-hidden">
			<Typography className="text-lg font-medium tracking-tight leading-6 truncate">Subscription Details</Typography>

			<div className="table-responsive">
				<Table className="w-full min-w-full">
					<TableHead>
						<TableRow>
							{columns.map((column, index) => (
								<TableCell key={index}>
									<Typography
										color="text.secondary"
										className="font-semibold text-12 whitespace-nowrap"
									>
										{column}
									</Typography>
								</TableCell>
							))}
						</TableRow>
					</TableHead>

					<TableBody>
						{data?.subscription?.map((row, index) => (
							<TableRow key={row?.id}>
								<TableCell
									component="th"
									scope="row"
								>
									<Chip
										size="small"
										label={row?.coursePackage?.course?.name}
									/>
								</TableCell>
								<TableCell
									component="th"
									scope="row"
								>
									<Typography>{row?.org?.orgName}</Typography>
								</TableCell>
								<TableCell
									component="th"
									scope="row"
								>
									<Typography>{row?.boughtPrice}</Typography>
								</TableCell>
								<TableCell
									component="th"
									scope="row"
								>
									<Typography>{row?.boughtMaxStudent}</Typography>
								</TableCell>
								<TableCell
									component="th"
									scope="row"
								>
									<Typography>{formatDate(row?.startDate || new Date())}</Typography>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</Paper>
	);
}

export default memo(BudgetDetailsWidget);
