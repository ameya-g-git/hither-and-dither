import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import useMousePosition from "../hooks/useMousePosition";
import { inputHandlerType } from "../hooks/useUploadedImages";
import { motion, Variants } from "motion/react";

interface SliderProps {
	label: string;
	id: string;
	value: number;
	min: number;
	max: number;
	step: number;
	onChange: inputHandlerType;
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
			const value = ((mousePosition.x - sliderX) / sliderWidth) * max;
			setSliderVal(value > 0.99 * max ? max : value);
			onChange(id, label.toLowerCase(), value);
		}
	}, [mouseDown, mousePosition]);

	return (
		<motion.div variants={variants}>
			<div className="overflow-hidden">
				<input
					className="absolute z-[99] right-0 w-full"
					type="range"
					name={label.toLowerCase()}
					min={min}
					max={max}
					value={sliderVal}
					step={step}
					onChange={(e) => {
						setSliderVal(Number(e.target.value));
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
				<div className="w-full h-[3.5rem]">
					<div
						style={{
							width: `${(sliderVal / max) * 100}%`,
						}}
						className="flex items-center h-full overflow-hidden rounded-lg text-dark bg-medium"
					>
						<label className={labelStyles(true)}>{label}</label>
					</div>
				</div>
			</div>
		</motion.div>
	);
}
