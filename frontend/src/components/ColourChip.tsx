import clsx from "clsx";
import { ChangeEvent } from "react";

interface ColourChipProps {
	col: string;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
	onDelete: () => void;
	onBlur: () => void;
	small: boolean;
}

export default function ColourChip({ col, onChange, onDelete, onBlur, small }: ColourChipProps) {
	const chipStyles = clsx({
		"rounded-full": true,
		"w-10 h-10": !small,
		"w-6 h-6": small,
	});

	return (
		<div className="colour-chip border-medium border-4 h-fit w-fit rounded-full relative items-center *:cursor-pointer p-1">
			<div className={chipStyles} style={{ backgroundColor: col }}>
				{" "}
			</div>
			<input
				className="absolute top-0 left-0 w-12 h-12 border-none rounded-full outline-none opacity-0"
				type="color"
				value={col}
				onChange={onChange}
				onBlur={onBlur}
			/>
			<button
				className="absolute flex items-center justify-center text-medium w-8 h-6 border-[3px] text-xs border-medium rounded-full -bottom-2 -right-2 bg-dark [&&]:p-0"
				onClick={(e) => {
					e.preventDefault();
					onDelete();
				}}
			>
				x
			</button>
		</div>
	);
}
