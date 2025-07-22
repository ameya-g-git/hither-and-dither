import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { motion, Variants } from "motion/react";

import useMousePosition from "../hooks/useMousePosition";
import { inputHandlerType } from "../hooks/useUploadedImages";

interface SliderProps {
	label: string;
	id: string;
	value: number;
	min: number;
	max: number;
	step: number;
	onChange: inputHandlerType;
	disabled?: boolean;
	variants: Variants;
}

export default function Slider({
	label,
	id,
	value,
	min,
	max,
	step = 15,
	onChange,
	disabled = false,
	variants,
}: SliderProps) {
	const labelStyles = (dark: boolean) =>
		clsx({
			absolute: !dark,
			"text-dark": dark,
			"text-sm pl-4 select-none pointer-events-none": true,
		});

	const mousePosition = useMousePosition();
	const sliderRef = useRef<HTMLObjectElement>(null);

	const [mouseDown, setMouseDown] = useState(false);
	const [mouseIn, setMouseIn] = useState(false);
	const [sliderVal, setSliderVal] = useState(value);

	useEffect(() => {
		if (mouseDown && mouseIn && sliderRef && sliderRef.current) {
			const sliderRect = sliderRef.current.getBoundingClientRect();
			const sliderX = sliderRect.x;
			const sliderWidth = sliderRect.width;
			let newVal = ((mousePosition.x - sliderX) / sliderWidth) * max;

			if (newVal < min + (max - min) * 0.01) {
				newVal = min;
			} else if (newVal > 0.99 * max) {
				newVal = max;
			}

			setSliderVal(newVal);
			onChange(id, label.toLowerCase(), newVal);
		}
	}, [mouseDown, mousePosition]);

	return (
		<motion.div className="" variants={variants}>
			<div className="overflow-hidden">
				<input
					className="absolute z-[99] right-0 w-full"
					disabled={disabled}
					type="range"
					name={label.toLowerCase()}
					min={min}
					max={max}
					value={sliderVal}
					step={step}
					onChange={(e) => {
						setSliderVal(Math.max(Number(e.target.value)));
						onChange(id, label.toLowerCase(), e.target.value);
					}}
				/>
			</div>
			<div
				className="flex items-center justify-start w-full p-1 border-4 cursor-pointer bg-dark border-medium rounded-2xl "
				ref={sliderRef}
				onMouseDown={(_) => setMouseDown(true)}
				onMouseUp={(_) => setMouseDown(false)}
				onMouseEnter={(_) => setMouseIn(true)}
				onMouseLeave={(_) => {
					setMouseIn(false);
					setMouseDown(false);
				}}
			>
				<label className={labelStyles(false)} htmlFor={label.toLowerCase()}>
					{label}
				</label>
				<div className="w-full rounded-lg overflow-hidden h-[3.5rem]">
					<div
						style={{
							width: `${(sliderVal / max) * 100}%`,
						}}
						className="flex items-center h-full overflow-hidden text-dark bg-medium"
					>
						<label className={labelStyles(true)}>{label}</label>
					</div>
				</div>
			</div>
		</motion.div>
	);
}
