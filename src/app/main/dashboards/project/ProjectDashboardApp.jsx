import FusePageSimple from '@fuse/core/FusePageSimple';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import FuseLoading from '@fuse/core/FuseLoading';
import ProjectDashboardAppHeader from './ProjectDashboardAppHeader';
import HomeTab from './tabs/home/HomeTab';
import TeamTab from './tabs/team/TeamTab';
import BudgetTab from './tabs/budget/BudgetTab';
import { useGetProjectDashboardWidgetsQuery } from './ProjectDashboardApi';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import axios from 'axios';
import { baseURL } from 'app/store/apiService';
import { set } from 'lodash';
import { useAppDispatch } from 'app/store/hooks';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .FusePageSimple-header': {
		backgroundColor: theme.palette.background.paper,
		boxShadow: `inset 0 0 0 1px  ${theme.palette.divider}`
	}
}));

/**
 * The ProjectDashboardApp page.
 */
function ProjectDashboardApp() {
	// const { isLoading } = useGetProjectDashboardWidgetsQuery();
	const [tabValue, setTabValue] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [data, setData] = useState(null);
	const [user, setUser] = useState(null);
	const dispatch = useAppDispatch();

	useEffect(() => {
		let userInfo = JSON.parse(localStorage.getItem('USER'));
		setUser(userInfo);
		setIsLoading(true);
		axios.get(baseURL + "/admin/dashboard").then((res) => {
			setData(res.data);
			setIsLoading(false);
		}).
		catch((error) => {
			// dispatch(showMessage({ message: 'Load Data Failed! Try Later!',
			// variant: 'error',
			// anchorOrigin: {
			// 	vertical: 'top',
			// 	horizontal: 'right'
			// }}));
			setIsLoading(true);
		});
	}, []);

	function handleChangeTab(event, value) {
		setTabValue(value);
	}

	if (isLoading) {
		return <FuseLoading />;
	}

	if (data != null && user != null) {
		return (
			<Root
				header={<ProjectDashboardAppHeader />}
				content={
					user?.role == 'MANAGER' ? (
						<div className="w-full p-12 pt-16 sm:pt-24 lg:ltr:pr-0 lg:rtl:pl-0">
					<Tabs
						value={tabValue}
						onChange={handleChangeTab}
						indicatorColor="secondary"
						textColor="inherit"
						variant="scrollable"
						scrollButtons={false}
						className="w-full px-24 -mx-4 min-h-40"
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
						<Tab
							className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12"
							disableRipple
							label="Home"
						/>
						{/* <Tab
							className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12"
							disableRipple
							label="Budget"
						/> */}
						{/* <Tab
							className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12"
							disableRipple
							label="Team"
						/> */}
					</Tabs>
					{tabValue === 0 && <HomeTab data={data} />}
					{/* {tabValue === 1 && <BudgetTab />} */}
					{/* {tabValue === 2 && <TeamTab />} */}
				</div>
					) : (<div className="w-full p-12 pt-16 sm:pt-24 lg:ltr:pr-0 lg:rtl:pl-0">
						You don't have permission to view this information!
					</div>)
				}
			/>
		);
	}
}

export default ProjectDashboardApp;
