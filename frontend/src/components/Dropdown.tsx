import { useState } from "react";
import { inputHandlerType } from "../hooks/useUploadedImages";
import { motion } from "framer-motion";

export interface Option {
	val: string;
	name: string;
}

interface DropdownProps {
	value: string; // form value that is currently selected, will update the label shown on the collapsed dropdown
	label: string;
	options: Option[];
	id: string;
	onChange: inputHandlerType;
}

export default function Dropdown({ value, label, options, id, onChange }: DropdownProps) {
	const [showDropdownList, setShowDropdownList] = useState(false);

	function toggleDropdown(event: Event) {
		event.stopPropagation();
		setShowDropdownList((prev) => !prev);
	}

	return (
		<>
			<label className="mb-4">{label}</label>
			<div className="w-full min-h-20">
				{showDropdownList ? (
					<>
						<ol className="absolute flex flex-col justify-center w-full gap-2 border-4 rounded-2xl min-h-20 border-medium">
							{options.map((op, i) => (
								<li key={i} className="flex flex-col items-center justify-center w-full h-20 transition-all">
									<button
										className="flex flex-row items-center gap-6 select"
										onClick={(e) => {
											toggleDropdown(e as unknown as Event);
											onChange(id, "algorithm", op.val);
										}}
									>
										{i === 0 && <span className="">▼</span>}
										<span className={`${i != 0 && "pl-9"} pt-1`}>{op.name}</span>
									</button>
									{i != options.length - 1 && <hr />}
								</li>
							))}
						</ol>
					</>
				) : (
					<button
						className="flex flex-row items-center w-full gap-6 pt-1 border-4 border-medium select min-h-20"
						onClick={(e) => toggleDropdown(e as unknown as Event)}
					>
						<span>▶︎</span>
						<span className="">{options.find((op) => op.val == value)?.name}</span>
					</button>
				)}
			</div>
		</>
	);
}
