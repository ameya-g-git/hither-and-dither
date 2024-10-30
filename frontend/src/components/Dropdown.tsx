import { useState } from "react";
import { inputHandlerType } from "../hooks/useUploadedImages";

export interface Option {
	val: string;
	name: string;
}

interface DropdownProps {
	def?: number;
	label: string;
	options: Option[];
	id: string;
	onChange: inputHandlerType;
}

export default function Dropdown({ def = 0, label, options, id, onChange }: DropdownProps) {
	const [showDropdownList, setShowDropdownList] = useState(false);

	return (
		<>
			<label className="mb-4">{label}</label>
			<div className="w-full min-h-20">
				{showDropdownList ? (
					<>
						<ol className="absolute flex flex-col justify-center w-full gap-2 border-4 rounded-2xl min-h-20 border-medium">
							{options.map((op, i) => (
								<li className="flex flex-col items-center justify-center w-full h-20 transition-all">
									<button
										className="flex flex-row items-center gap-6 select"
										onClick={(_) => onChange(id, "algorithm", op.val)}
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
						onClick={(_) => setShowDropdownList(true)}
					>
						<span>▶︎</span>
						<span className="">{`${options[def].name}`}</span>
					</button>
				)}
			</div>
		</>
	);
}
