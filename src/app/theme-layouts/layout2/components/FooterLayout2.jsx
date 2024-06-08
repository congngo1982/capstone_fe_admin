import AppBar from '@mui/material/AppBar';
import { ThemeProvider } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import clsx from 'clsx';
import { memo } from 'react';
import { selectFooterTheme } from '@fuse/core/FuseSettings/fuseSettingsSlice';
import DemoLayoutFooterContent from 'app/theme-layouts/shared-components/DemoLayoutFooterContent';
import { useAppSelector } from 'app/store/hooks';

/**
 * The footer layout 2.
 */
function FooterLayout2(props) {
	const { className = '' } = props;
	const footerTheme = useAppSelector(selectFooterTheme);
	return (
		<ThemeProvider theme={footerTheme}>
			<AppBar
				id="fuse-footer"
				className={clsx('relative z-20 shadow-md', className)}
				color="default"
				sx={{ backgroundColor: footerTheme.palette.background.paper }}
			>
			
			</AppBar>
		</ThemeProvider>
	);
}

export default memo(FooterLayout2);
