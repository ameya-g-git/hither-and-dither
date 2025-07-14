import { useRef, useState } from "react";
import { AnimatePresence, motion, Variants } from "motion/react";

import { inputHandlerType } from "../hooks/useUploadedImages";
import { useClickOutside } from "../hooks/useClickOutside";
import { useKeyPress } from "../hooks/useKeyPress";

export interface Option {
	id: string;
	val?: any;
	name: string;
	deletable?: boolean;
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
	onDelete?: (id: string) => void;
	className?: string;
	showLabel?: boolean;
	variants?: Variants;
}

interface DropdownOptionProps {
	option: Option;
	onClick: (e: Event) => void;
	onDelete: (id: string) => void;
	variants: Variants;
}

// simple component for a single dropdown option just to make component code a little Cleaner
function DropdownOption({ option, onClick, onDelete, variants }: DropdownOptionProps) {
	return (
		<motion.li variants={{ ...variants }} className="relative w-full h-12">
			<motion.button
				className="flex flex-row items-center h-12 rounded-xl select"
				exit={{ fontSize: 0 }}
				transition={{ delay: 0.25 }}
				onClick={(e) => onClick(e as unknown as Event)}
			>
				{option.name}
			</motion.button>
			{option.deletable && (
				<motion.button
					initial={{ translateX: 0 }}
					exit={{ translateX: "10rem" }}
					transition={{ ease: "easeIn", duration: 0.5 }}
					className="absolute top-0 right-0 h-10 [&&]:p-2 mx-2 border-4 rounded-md aspect-square bg-dark text-medium border-medium"
					onClick={(e) => {
						e.preventDefault();
						onDelete(option.id);
					}}
				>
					delete
				</motion.button>
			)}
		</motion.li>
	);
}

function findOptionFromId(options: OptionGroup[], id: string): Option {
	let foundOption: Option = { id: "", name: "", val: "" };
	if (options.length <= 0) {
		return foundOption;
	}

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
	onDelete,
	className,
	showLabel = false,
	variants = {},
}: DropdownProps) {
	const [showDropdownList, setShowDropdownList] = useState(false);
	const [currentOption, setCurrentOption] = useState(findOptionFromId(options, current));
	const dropdownRef = useRef(null);

	function toggleDropdown(event: Event, option?: Option) {
		// toggles dropdown and updates currentOption and optionsList simultaneously
		event.stopPropagation();
		event.preventDefault();
		setShowDropdownList((prev) => !prev);
		if (option) {
			setCurrentOption(option);
		}
	}

	function optionClick(e: Event, op: Option) {
		toggleDropdown(e, op);
		onChange(id, dropFor.toLowerCase(), [op.id, op!.val]);
	}

	useClickOutside(dropdownRef, (_) => setShowDropdownList(false));
	useKeyPress("Escape", (_) => setShowDropdownList(false));

	const opt: Variants = {
		start: { translateX: "-2rem", opacity: 0 },
		end: { translateX: "0", opacity: 1 },
	};

	return (
		<motion.div
			layoutId={`dropdown-${dropFor}${id}`}
			variants={variants}
			transition={{ ease: "easeOut" }}
			className={`min-h-32 min-w-48 ${className ? className : ""}`}
		>
			{showLabel && (
				<label className="text-lg ">{dropFor.slice(0, 1).toUpperCase() + dropFor.slice(1)}</label>
			)}
			<motion.div
				ref={dropdownRef}
				layout
				layoutId={`options-${dropFor}${id}`}
				style={{
					height: showDropdownList
						? `${Math.min(16, options.map((x) => x.options.length).reduce((x, y) => x + y, 0) * 4)}rem`
						: "4.5rem",
				}}
				transition={{ type: "tween", ease: "easeInOut" }}
				className={`${
					showDropdownList ? "overflow-y-auto pr-0.5" : ""
				} absolute overflow-x-hidden top-10 transition-all bg-dark mb-8 flex flex-col w-full gap-6 text-sm border-4 min-h-16 max-h-64 rounded-2xl border-medium`}
			>
				<motion.div className="sticky top-0 z-50 max-h-16 bg-dark">
					<button
						className={`flex flex-row items-center w-full h-16 gap-4 rounded-xl select`}
						onClick={(e) => {
							toggleDropdown(e as unknown as Event);
						}}
					>
						<span
							style={{
								transition: "all 0.1s ease-out",
								rotate: showDropdownList ? "90deg" : "0deg",
							}}
							className="mb-1 text-lg"
						>
							▶︎
						</span>
						{currentOption.name}
					</button>
					{showDropdownList && <hr className="absolute w-full" />}
				</motion.div>

				{showDropdownList && (
					<motion.div
						initial="start"
						animate="end"
						exit="exit"
						transition={{ delayChildren: 0.1, staggerChildren: 0.2 }}
						className="flex flex-col gap-4 px-4 bg-dark"
					>
						{options.map((group, i) => (
							<motion.div variants={opt} key={i} className="w-full min-h-16">
								<label className="text-sm text-medium/50">{group.name}</label>
								<motion.ol
									transition={{ delayChildren: 0.25, staggerChildren: 0.1 }}
									variants={opt}
									className="flex flex-col items-center gap-0.5 mt-3"
									layout
								>
									<AnimatePresence>
										{group.options.map((op, j) =>
											op.id !== current ? (
												<DropdownOption
													key={j}
													option={op}
													onClick={(e) => optionClick(e, op)}
													variants={opt}
													onDelete={op.deletable && onDelete ? onDelete : () => {}}
												/>
											) : (
												<></>
											),
										)}
									</AnimatePresence>
								</motion.ol>
								{i != options.length - 1 && <hr />}
							</motion.div>
						))}
					</motion.div>
				)}
			</motion.div>
		</motion.div>
	);
}
