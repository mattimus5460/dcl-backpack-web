'use client'
import type {NextPage} from "next";
import React, {useEffect, useState} from "react";
import {Grid} from "@mui/material";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {Calendar, Event, momentLocalizer} from "react-big-calendar";
import moment from "moment";

const Outfits: NextPage = () => {

	const [data, setData] = useState<Event[]>([]);
	const [dataSorted, setDataSorted] = useState<Map<string, any> | null>(null);

	useEffect(() => {


		// Retrieve all events
		const response = fetch(`https://events.decentraland.org/api/events`, {})
			.then(res => {
				if (res.ok) {
					return res.json();
				} else {
					throw new Error("bad res");
				}
			})
			.then((r) => {


				const events = r.data.map((event: any) => {
					return {
						title: event.name,
						start: new Date(event.next_start_at),
						end: new Date(event.next_finish_at),
					};
				});


				console.log(events);
				setData(events);
			})
			.catch(e => {
				console.log(e);
			});
	}, []);

	const localizer = momentLocalizer(moment);

	return (
		<Grid alignItems={"center"} container xs={12}>


			<Calendar
				localizer={localizer}
				events={data}
				startAccessor="start"
				endAccessor="end"
				style={{width: "100%", minHeight: 800}}

			/>

		</Grid>
	);
};
export default Outfits;
