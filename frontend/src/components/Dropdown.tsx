import { useRef, useState } from "react";
import { inputHandlerType } from "../hooks/useUploadedImages";
import { motion } from "framer-motion";
import { useClickOutside } from "../hooks/useClickOutside";

interface Option {
	val: string;
	name: string;
}

export interface OptionGroup {
	name: string;
	options: Option[];
}

interface DropdownProps {
	label: string; // label for dropdown
	options: OptionGroup[];
	id: string; // id of image its updating
	onChange: inputHandlerType; // form state change handler function
	className?: string;
}

export default function Dropdown({ label, options, id, onChange, className }: DropdownProps) {
	const [showDropdownList, setShowDropdownList] = useState(false);
	const [currentOption, setCurrentOption] = useState(options[0].options[0]);
	const [optionsList, setOptionsList] = useState<OptionGroup[]>([
		// options list filtered without currentOption
		{ ...options[0], options: options[0].options.slice(1) },
		...options.slice(1),
	]);
	const dropdownRef = useRef(null);

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

	useClickOutside(dropdownRef, (_) => setShowDropdownList(false));

	// TODO: ok im more insane   if i want the animation to work i need to change the positioning of options depending on what's selected
	// TODO: add framer motion animation for this   although this can come later during the  Polishing state tbh
	// i should   check these TODOs one day

	return (
		<div className={`min-h-32 ${className ? className : ""}`}>
			<label className="text-lg ">{label}</label>
			<div
				ref={dropdownRef}
				className={`${
					showDropdownList && "overflow-y-scroll"
				} absolute top-10 scrollbar-thin scrollbar-track-dark scrollbar-thumb-medium scrollbar-track-rounded-full mb-8 flex flex-col w-full gap-6 text-sm border-4 min-h-16 max-h-64 rounded-2xl border-medium`}
			>
				<div className="sticky top-0 z-10 bg-dark rounded-2xl">
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
					<div className="flex flex-col gap-4 px-4 bg-dark">
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
		</div>
	);
}
