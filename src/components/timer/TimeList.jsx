import { useTimeStore } from "../store/timeStore";

export function TimeList() {
	const entries = useTimeStore((state) => state.entries);

	const formatDuration = (ms) => {
		const seconds = Math.floor(ms / 1000);
		const minutes = Math.floor(seconds / 60);
		const hours = Math.floor(minutes / 60);
		return `${hours}:${minutes % 60}:${seconds % 60}`;
	};

	return (
		<div className='mt-4'>
			{entries.map((entry) => (
				<div key={entry.id} className='p-4 mb-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow'>
					<div className='flex justify-between items-center'>
						<div>
							<h3 className='font-medium'>{entry.description}</h3>
							<p className='text-sm text-gray-500'>
								{entry.startTime.toLocaleTimeString()} - {entry.endTime?.toLocaleTimeString() || "Running"}
							</p>
						</div>
						<div className='text-lg font-mono'>{formatDuration(entry.duration)}</div>
					</div>
				</div>
			))}
		</div>
	);
}
