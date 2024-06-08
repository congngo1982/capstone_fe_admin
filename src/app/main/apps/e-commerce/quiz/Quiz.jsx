import { GlobalStyles } from '@mui/system';
import React from 'react'
import QuizHeader from './QuizHeader';
import QuizTable from './QuizTable';
import QuizHeaderAll from './QuizHeaderAll';


export default function Quiz() {
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
				<QuizHeaderAll isCreate={false}/>
				<QuizTable/>
			</div>
		</>
	);
}
