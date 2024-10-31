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
		{ ...options[0], options: options[0].options.slice(1) },
		...options.slice(1),
	]);

	function toggleDropdown(event: Event, option?: Option) {
		event.stopPropagation();
		event.preventDefault();
		setShowDropdownList((prev) => !prev);
		if (option) {
			setCurrentOption(option);
			setOptionsList((prev) => {
				return prev.map((group) => {
					return { ...group, options: group.options.filter((op) => op.val !== option.val) };
				});
			});
		}
	}

	// TODO: ok im more insane   if i want the animation to work i need to change the positioning of options depending on what's selected

	// TODO: if im truly insane truly bonkers i will allow for groups of options as well teehee

	// TODO: add framer motion animation for this   although this can come later during the  Polishing state tbh
	// i should   check these TODOs one day

	return (
		<div className="w-full p-4 pb-0 border-4 min-h-20 rounded-2xl border-medium">
			{showDropdownList ? (
				options.map((group) => (
					<div className="w-full min-h-20">
						<label className="text-sm text-medium/50">{group.name}</label>
						<ol className="flex flex-col items-center h-full">
							{group.options.map((op) => (
								<>
									<li className="w-full h-16">
										<button
											className="flex flex-row items-center h-full gap-6 select"
											onClick={(e) => {
												toggleDropdown(e as unknown as Event, op);
												onChange(id, "algorithm", op.val);
											}}
										>
											{op.name}
										</button>
									</li>
									<hr />
								</>
							))}
						</ol>
					</div>
				))
			) : (
				<button
					className="flex flex-row items-center h-full gap-6 select"
					onClick={(e) => {
						toggleDropdown(e as unknown as Event);
					}}
				>
					{currentOption.name}
				</button>
			)}
		</div>
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
