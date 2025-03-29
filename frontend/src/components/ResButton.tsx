import clsx from "clsx";
import { SyntheticEvent, useState } from "react";
import { inputHandlerType } from "../hooks/useUploadedImages";

interface ResButtonProps {
	id: string;
	onClick: inputHandlerType;
}

export default function ResButton({ id, onClick }: ResButtonProps) {
	const [counter, setCounter] = useState(0);
	const resolution = [1, 2, 4];

	const buttonStyles = clsx({
		"flex items-center  transition-all ease-out justify-center h-16 font-bold min-w-24 rounded-xl bg-medium scale-105 ":
			true,
		"scale-100": counter === 0,
		"scale-105 text-lg": counter === 1,
		"scale-115 text-xl": counter === 2,
	});

	function incrementCounter(e: SyntheticEvent) {
		e.preventDefault();
		e.stopPropagation();
		setCounter((prev) => {
			const nextCount = prev + 1 > 2 ? 0 : prev + 1;
			onClick(id, "scale", resolution[nextCount]);
			return nextCount;
		});
	}
	return (
		<button id="width" onClick={(e: SyntheticEvent) => incrementCounter(e)} className={buttonStyles}>
			{resolution[counter]}x
		</button>
	);
}
