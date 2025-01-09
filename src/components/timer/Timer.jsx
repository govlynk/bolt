import { useState } from "react";
import { Play, Square } from "lucide-react";
import { useTimeStore } from "../store/timeStore";

export function Timer() {
	const [description, setDescription] = useState("");
	const { addEntry, stopTimer, activeEntry } = useTimeStore();

	const startTimer = () => {
		const entry = {
			id: crypto.randomUUID(),
			projectId: "",
			description,
			startTime: new Date(),
			duration: 0,
			tags: [],
		};
		addEntry(entry);
	};

	return (
		<div className='p-4 bg-white rounded-lg shadow-md'>
			<div className='flex gap-4 items-center'>
				<input
					type='text'
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					placeholder='What are you working on?'
					className='flex-1 p-2 border rounded'
				/>
				{!activeEntry ? (
					<button onClick={startTimer} className='p-2 bg-green-500 text-white rounded hover:bg-green-600'>
						<Play />
					</button>
				) : (
					<button
						onClick={() => stopTimer(activeEntry.id)}
						className='p-2 bg-red-500 text-white rounded hover:bg-red-600'
					>
						<Square />
					</button>
				)}
			</div>
		</div>
	);
}
