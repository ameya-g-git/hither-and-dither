import clsx from "clsx";
import { Variants } from "motion/react";
import { ChangeEvent, useState } from "react";

interface ColourChipProps {
	col: string;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
	onDelete: () => void;
	onBlur: () => void;
	disabled: boolean;
}

export default function ColourChip({ col, onChange, onDelete, onBlur, disabled }: ColourChipProps) {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<div className="colour-chip border-medium border-4 h-fit w-fit rounded-full relative *:cursor-pointer p-1">
			<div className="w-6 h-6 rounded-full" style={{ backgroundColor: col }}>
				{" "}
			</div>
			<input
				className="absolute top-0 left-0 w-12 h-12 border-none rounded-full outline-none opacity-0"
				type="color"
				disabled={disabled}
				value={col}
				onFocus={() => setIsHovered(true)}
				onMouseOver={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
				onBlur={onBlur}
				onChange={onChange}
			/>
			{isHovered && (
				<button
					title={`Delete ${col}`}
					onMouseOver={() => setIsHovered(true)}
					onMouseLeave={() => setIsHovered(false)}
					onBlur={() => setIsHovered(false)}
					disabled={disabled}
					className="absolute flex items-center justify-center text-medium w-8 h-6 border-[3px] text-xs border-medium rounded-full -top-2 -left-3 bg-dark [&&]:p-0"
					onClick={(e) => {
						e.preventDefault();
						onDelete();
					}}
				>
					x
				</button>
			)}
		</div>
	);
}
