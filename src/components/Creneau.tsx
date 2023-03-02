import Paper from '@mui/material/Paper';
import { AppointmentModel, ViewState } from '@devexpress/dx-react-scheduler';
import {
	Scheduler,
	WeekView,
	Appointments,
	Toolbar,
	DateNavigator,
	TodayButton,
} from '@devexpress/dx-react-scheduler-material-ui';
import { useState, useEffect } from 'react';
import axios from "axios"
export default function CreneauComponent() {

	const currentDate = Date.now();

	const [schedulerData,setSchedulerData] = useState<AppointmentModel[]>()
	let headersList = {
		Accept: "*/*",
		Autorization: localStorage.getItem("token"),
	};

	useEffect(() => {  
		let reqOptions = {
			url: "http://localhost:3000/attributions/",
			method: "get",
		};
		
		axios(reqOptions).then(function (response) {
			
			const result = []
        
			for (let i = 0; i < response.data.length; i++){
				let att = response.data[i]
				let temp = {
					startDate : att.dateDebut,
					endDate : att.dateFin,
					title : att.nomZone + " avec " + att.nom
				}
				result.push(temp)
			}
			setSchedulerData(result)
		});
	},[]); 

	return (
		<Paper>
			<Scheduler data={schedulerData}>	
				<ViewState defaultCurrentDate={currentDate} />
				<WeekView
					startDayHour={9}
					endDayHour={19}
				/>	
				<Appointments />
				<Toolbar />
          		<DateNavigator />
				<TodayButton />
			</Scheduler>
		</Paper>
	);
}