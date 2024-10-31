import { useState } from "react";
import { inputHandlerType } from "../hooks/useUploadedImages";
import { motion } from "framer-motion";

interface Option {
	val: string;
	name: string;
}

export interface OptionGroup {
	name: string;
	options: Option[];
}

interface DropdownProps {
	value: string; // form value that is currently selected, will update the label shown on the collapsed dropdown
	label: string;
	options: OptionGroup[]; // allowing for groups time to kms
	id: string;
	onChange: inputHandlerType;
}

export default function Dropdown({ value, label, options, id, onChange }: DropdownProps) {
	const [showDropdownList, setShowDropdownList] = useState(false);
	const [currentOption, setCurrentOption] = useState(options[0].options[0]);
	const [optionsList, setOptionsList] = useState<OptionGroup[]>([
		// options list filtered without currentOption
		{ ...options[0], options: options[0].options.slice(1) },
		...options.slice(1),
	]);

	function toggleDropdown(event: Event, option?: Option) {
		// toggles dropdown and updates form state, currentOption, and optionsList simultaneously
		event.stopPropagation();
		event.preventDefault();
		setShowDropdownList((prev) => !prev);
		if (option) {
			setCurrentOption(option);
			setOptionsList((prev) => {
				return prev.map((group, i) => {
					return { ...group, options: options[i].options.filter((op) => op.val !== option.val) };
				});
			});
		}
	}

	// TODO: ok im more insane   if i want the animation to work i need to change the positioning of options depending on what's selected
	// TODO: create hook to detect clicking off
	// TODO: add framer motion animation for this   although this can come later during the  Polishing state tbh
	// i should   check these TODOs one day

	return (
		<>
			<label className="mb-4 text-lg">{label}</label>
			<div
				className={`${
					showDropdownList && "overflow-y-scroll"
				} relative flex flex-col w-full gap-6 text-sm border-4 min-h-16 max-h-64 rounded-2xl border-medium`}
			>
				<div className="sticky top-0 z-50 bg-dark rounded-2xl">
					<button
						className="flex flex-row items-center h-16 gap-6 select"
						onClick={(e) => {
							toggleDropdown(e as unknown as Event);
						}}
					>
						{currentOption.name}
					</button>
					{showDropdownList && <hr className="absolute w-full" />}
				</div>
				{showDropdownList && (
					<div className="flex flex-col gap-4 px-4">
						{optionsList.map((group, i) => (
							<div className="w-full min-h-16">
								<label className="text-sm text-medium/50">{group.name}</label>
								<ol className="flex flex-col items-center">
									{group.options.map((op) => (
										<>
											<li className="w-full h-12">
												<button
													className="flex flex-row items-center h-12 gap-6 select"
													onClick={(e) => {
														toggleDropdown(e as unknown as Event, op);
														onChange(id, "algorithm", op.val);
													}}
												>
													{op.name}
												</button>
											</li>
										</>
									))}
								</ol>
								{i != optionsList.length - 1 && <hr />}
							</div>
						))}
					</div>
				)}
			</div>
		</>
	);

	// return (
	// 	<>
	// 		<label className="mb-4">{label}</label>
	// 		<div className="w-full min-h-20">
	// 			{showDropdownList ? (
	// 				<>
	// 					<ol className="absolute flex flex-col justify-center w-full gap-2 border-4 rounded-2xl min-h-20 border-medium">
	// 						{options.map((op, i) => (
	// 							<li key={i} className="flex flex-col items-center justify-center w-full h-20 transition-all">
	// 								<button
	// 									className="flex flex-row items-center gap-6 select"
	// 									onClick={(e) => {
	// 										toggleDropdown(e as unknown as Event);
	// 										onChange(id, "algorithm", op.val);
	// 									}}
	// 								>
	// 									{i === 0 && <span className="">▼</span>}
	// 									<span className={`${i != 0 && "pl-9"} pt-1`}>{op.name}</span>
	// 								</button>
	// 								{i != options.length - 1 && <hr />}
	// 							</li>
	// 						))}
	// 					</ol>
	// 				</>
	// 			) : (
	// 				<button
	// 					className="flex flex-row items-center w-full gap-6 pt-1 border-4 border-medium select min-h-20"
	// 					onClick={(e) => toggleDropdown(e as unknown as Event)}
	// 				>
	// 					<span>▶︎</span>
	// 					<span className="">{options.find((op) => op.val == value)?.name}</span>
	// 				</button>
	// 			)}
	// 		</div>
	// 	</>
	// );
}
