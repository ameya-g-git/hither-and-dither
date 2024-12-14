import { useState } from "react";
import { inputHandlerType, UploadedImage } from "../hooks/useUploadedImages";
import Dropdown, { OptionGroup } from "./Dropdown";
import Slider from "./Slider";
import clsx from "clsx";
import ResButton from "./ResButton";

interface DitherFormProps {
	imgState: UploadedImage[];
	onChange: inputHandlerType;
}

export default function DitherForm({ imgState, onChange }: DitherFormProps) {
	const widthOptions: OptionGroup[] = [
		{
			name: "",
			options: [
				{ val: 360, name: "360px" },
				{ val: 480, name: "480px" },
				{ val: 720, name: "720px" },
			],
		},
	];

	const algOptions: OptionGroup[] = [
		{
			name: "Diffusion",
			options: [
				{ val: "fs", name: "Floyd-Steinberg" },
				{ val: "fs2", name: "Floyd-Steinberg2" },
			],
		},
		{
			name: "Ordered",
			options: [
				{ val: "b2x2", name: "Bayer 2x2" },
				{ val: "b4x4", name: "Bayer 4x4" },
			],
		},
	];

	const paletteOptions: OptionGroup[] = [
		{
			name: "Standard",
			options: [
				{ val: "bw", name: "B&W" },
				{ val: "cmyk", name: "CMYK" },
			],
		},
		{
			name: "Retro",
			options: [
				{ val: "gboy", name: "Gameboy" },
				{ val: "gboy2", name: "Gameboy2" },
			],
		},
	];

	return (
		<form className="flex items-center justify-center w-full h-full" action="proxy address">
			{imgState.map((img, i) => {
				return (
					<div
						// TODO: make the open property in an UploadedImage do   something
						key={i}
						className="absolute pt-16 p-12 flex flex-row w-10/12 mt-16 before:absolute before:border-8 before:border-b-transparent before:border-r-transparent before:border-t-medium before:border-l-medium h-4/5 bg-dark pixel-corners before:h-3/5 before:w-[97.5%] before:-top-1 before:-left-2"
					>
						<div className="flex flex-col gap-4 grow">
							<Dropdown className="z-50" label="Algorithm" id={img.id} options={algOptions} onChange={onChange} />
							<Dropdown className="z-40" label="Palette" id={img.id} options={paletteOptions} onChange={onChange} />
							<label className="text-lg">Image Adjustments</label>
							<Slider
								label="Brightness"
								id={img.id}
								value={img.brightness}
								min={1}
								max={100}
								step={1}
								onChange={(val) => {
									onChange(img.id, "brightness", val);
								}}
							/>
							<Slider
								label="Contrast"
								id={img.id}
								value={img.contrast}
								min={1}
								max={100}
								step={1}
								onChange={(val) => onChange(img.id, "contrast", val)}
							/>
							<div className="flex flex-row items-center w-full gap-4 mt-4 max-h-16">
								<label htmlFor="">Image Width</label>
								<Dropdown className="z-30 -mt-6" id={img.id} options={widthOptions} onChange={onChange} />
								<ResButton id={img.id} onClick={onChange} />
							</div>
						</div>
						<div className="w-1/2"></div>
					</div>
				);
			})}
		</form>
	);
}
