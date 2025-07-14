import clsx from "clsx";
import { SyntheticEvent, useState } from "react";
import { inputHandlerType } from "../hooks/useUploadedImages";
import { motion, Variants } from "motion/react";

interface ResButtonProps {
	id: string;
	onClick: inputHandlerType;
	variants: Variants;
}

export default function ResButton({ id, onClick, variants }: ResButtonProps) {
	const [counter, setCounter] = useState(0);
	const resolution = [1, 2, 4];

	const buttonStyles = clsx({
		"flex items-center p-0 pt-1 ease-out justify-center h-16 font-bold min-w-24 rounded-xl bg-medium scale-105 ":
			true,
		"scale-100": counter === 0,
		"scale-105 text-lg": counter === 1,
		"scale-115 text-xl": counter === 2,
	});

	function incrementCounter(e: SyntheticEvent) {
		e.preventDefault();
		e.stopPropagation();
		setCounter((prev) => {
			const nextCount = prev >= 2 ? 0 : prev + 1;
			onClick(id, "scale", resolution[nextCount]);
			return nextCount;
		});
	}
	return (
		<motion.button
			layoutId={`res-${id}`}
			key={`res-${id}`}
			variants={variants}
			onClick={(e: SyntheticEvent) => incrementCounter(e)}
			className={buttonStyles}
			style={{
				scale: 1 + resolution[counter] / 20,
				transitionProperty: "font-size scale",
				transitionTimingFunction: "ease-out",
			}}
		>
			{resolution[counter]}x
		</motion.button>
	);
}
