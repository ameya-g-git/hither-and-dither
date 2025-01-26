import { useRef, useState } from "react";
import { inputHandlerType } from "../hooks/useUploadedImages";
import { motion } from "framer-motion";
import { useClickOutside } from "../hooks/useClickOutside";
import { useKeyPress } from "../hooks/useKeyPress";

interface Option {
	id: string;
	val?: any;
	name: string;
}

export interface OptionGroup {
	name: string;
	options: Option[];
}

interface DropdownProps {
	dropFor: string; // label for dropdown
	current: any;
	options: OptionGroup[];
	id: string; // id of image its updating
	onChange: inputHandlerType; // form state change handler function
	className?: string;
	showLabel?: boolean;
}

interface DropdownOptionProps {
	option: Option;
	onClick: (e: Event) => void;
}

// simple component for a single dropdown option just to make component code a little Cleaner
function DropdownOption({ option, onClick }: DropdownOptionProps) {
	return (
		<li className="w-full h-12">
			<button className="flex flex-row items-center h-12 gap-6 select" onClick={(e) => onClick(e as unknown as Event)}>
				{option.name}
			</button>
		</li>
	);
}

function findOptionFromId(options: OptionGroup[], id: string): Option {
	let foundOption: Option = { id: "", name: "", val: "" };

	options.forEach((opGroup) => {
		if (opGroup.options.findIndex((op) => op.id === id) >= 0) {
			foundOption = opGroup.options.find((op) => op.id === id)!;
		}
	});

	return foundOption;
}
export default function Dropdown({
	dropFor,
	current,
	options,
	id,
	onChange,
	className,
	showLabel = false,
}: DropdownProps) {
	const [showDropdownList, setShowDropdownList] = useState(false);
	const [currentOption, setCurrentOption] = useState(findOptionFromId(options, current));
	const [optionsList, setOptionsList] = useState<OptionGroup[]>(
		// options list filtered without currentOption
		options.map((opGroup, i) => ({ ...opGroup, options: options[i].options.filter((op) => op.id !== current) })),
	);
	const dropdownRef = useRef(null);

	function toggleDropdown(event: Event, option?: Option) {
		// toggles dropdown and updates currentOption and optionsList simultaneously
		event.stopPropagation();
		event.preventDefault();
		setShowDropdownList((prev) => !prev);
		if (option) {
			setCurrentOption(option);
			setOptionsList((prev) => {
				return prev.map((group, i) => {
					return { ...group, options: options[i].options.filter((op) => op.id !== option.id) };
				});
			});
		}
	}

	function optionClick(e: Event, op: Option) {
		toggleDropdown(e, op);
		onChange(id, dropFor.toLowerCase(), op.id);
		// TODO: this is where i would also use onChange for whatever field is going to hold the weight matrix
	}

	useClickOutside(dropdownRef, (_) => setShowDropdownList(false));
	useKeyPress("Escape", (_) => setShowDropdownList(false));

	// TODO: ok im more insane   if i want the animation to work i need to change the positioning of options depending on what's selected
	// TODO: add framer motion animation for this   although this can come later during the  Polishing state tbh
	// i should   check these TODOs one day

	return (
		<div className={`min-h-32 min-w-48 ${className ? className : ""}`}>
			{showLabel && <label className="text-lg ">{dropFor.slice(0, 1).toUpperCase() + dropFor.slice(1)}</label>}
			<div
				ref={dropdownRef}
				className={`${
					showDropdownList && "overflow-y-auto"
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
										<DropdownOption option={op} onClick={(e) => optionClick(e, op)} />
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
