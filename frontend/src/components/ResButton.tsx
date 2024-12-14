import clsx from "clsx";
import { useState } from "react";
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

	function incrementCounter(e: Event) {
		e.preventDefault();
		e.stopPropagation();
		setCounter((prev) => prev + 1);
		if (counter >= 2) {
			setCounter(0);
		}
	}
	return (
		<button
			id="width"
			onClick={(e) => {
				incrementCounter(e as unknown as Event);
				onClick(id, "width", resolution[counter]);
			}}
			className={buttonStyles}
		>
			{resolution[counter]}x
		</button>
	);
}
