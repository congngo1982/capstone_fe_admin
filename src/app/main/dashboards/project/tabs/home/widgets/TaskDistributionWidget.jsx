import Paper from '@mui/material/Paper';
import { lighten, useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { memo, useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import Tabs from '@mui/material/Tabs';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import FuseLoading from '@fuse/core/FuseLoading';
import { useGetProjectDashboardWidgetsQuery } from '../../../ProjectDashboardApi';
import { PieChart } from '@mui/x-charts/PieChart';

/**
 * The TaskDistributionWidget widget.
 */
function TaskDistributionWidget({data}) {

	const transformedProjects = data?.project?.map(proj => {
		return ({
			id: proj.id,
			value: parseInt(proj.courseNumber, 10),
			label: proj.goal
		  })
	});


	console.log(transformedProjects);

	return (
		<Paper className="flex flex-col flex-auto p-24 shadow rounded-2xl overflow-hidden h-full">
			<div className="flex flex-col sm:flex-row items-start justify-between">
				<Typography className="text-lg font-medium tracking-tight leading-6 truncate">
					Course Distribution
				</Typography>
				{/* <div className="mt-3 sm:mt-0 sm:ml-2">
					<Tabs
						value={tabValue}
						onChange={(ev, value) => setTabValue(value)}
						indicatorColor="secondary"
						textColor="inherit"
						variant="scrollable"
						scrollButtons={false}
						className="-mx-4 min-h-40"
						classes={{ indicator: 'flex justify-center bg-transparent w-full h-full' }}
						TabIndicatorProps={{
							children: (
								<Box
									sx={{ bgcolor: 'text.disabled' }}
									className="w-full h-full rounded-full opacity-20"
								/>
							)
						}}
					>
						{Object.entries(ranges).map(([key, label]) => (
							<Tab
								className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12"
								disableRipple
								key={key}
								label={label}
							/>
						))}
					</Tabs>
				</div> */}
			</div>
			<div className="flex flex-col flex-auto mt-6">
			<PieChart
      series={[
        {
          data: transformedProjects
        },
      ]}
      width={450}
      height={200}
    />
			</div>
		</Paper>
	);
}

export default memo(TaskDistributionWidget);
