import Paper from '@mui/material/Paper';
import { AppointmentModel, ViewState, EditingState, IntegratedEditing, ChangeSet} from '@devexpress/dx-react-scheduler';
import {
	Scheduler,
	WeekView,
	Appointments,
	AppointmentForm,
	AppointmentTooltip,
	Toolbar,
	DateNavigator,
	TodayButton,
} from '@devexpress/dx-react-scheduler-material-ui';
import { useState, useEffect } from 'react';
import axios from "axios"
import { getToken, isAdmin, isConnected} from '../middleware/token'
import { indigo, blue, teal  } from '@mui/material/colors';

const currentDate = Date.now();

const AppointmentContent = (({data, ...restProps}: Appointments.AppointmentContentProps) =>  {
	return (
	  	<Appointments.AppointmentContent data={data}>
			<div>
		  		<div>
					{data.title}
				</div>
				<div>
					{`Zone: ${data.zone}`}
				</div>
				<div>
					{`Benevole: ${data.benevole}`}
				</div>
			</div>
		</Appointments.AppointmentContent>
	);
});

export default function CreneauComponent() {	

	const [schedulerData,setSchedulerData] = useState<AppointmentModel[]>()
	let headersList = {
		Accept: "*",
		Autorization: 'Bearer '+getToken()?.toString(),
	};

	useEffect(() => {  
		let reqOptions = {
			url: "http://localhost:3000/attributions/",
			method: "get",
			headers: headersList
		};
		
		axios(reqOptions).then(function (response) {
			
			const result = []
        
			for (let i = 0; i < response.data.length; i++){
				let att = response.data[i]
				let temp = {
					startDate : att.dateDebut,
					endDate : att.dateFin,
					title : att.nomZone + " avec " + att.nom,
					zone : att.nomZone,
					benevole : att.nom
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
				<EditingState onCommitChanges={function (changes: ChangeSet): void {
					throw new Error('Function not implemented.');
				} }/>
				<IntegratedEditing />
				<WeekView
					startDayHour={9}
					endDayHour={19}
				/>	
				<Appointments 
					appointmentContentComponent={AppointmentContent}
				/>
				<Toolbar />
          		<DateNavigator />
				<TodayButton />
				<AppointmentTooltip
					showOpenButton
					showDeleteButton
				/>
				<AppointmentForm />
			</Scheduler>
		</Paper>
	);
}