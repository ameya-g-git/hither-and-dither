import { useState } from "react";
import useUploadedFiles, { UploadedImage } from "../hooks/useUploadedImages";
import Dropdown, { OptionGroup } from "./Dropdown";
import Slider from "./Slider";

interface DitherFormProps {
	imgState: UploadedImage[];
	onChange: () => void;
}

export default function DitherForm({ imgState, onChange }: DitherFormProps) {
	const [brightness, setBrightness] = useState(50); // TODO: adapt these to lists depending on how images are uploaded
	const [contrast, setContrast] = useState(50);

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

	const [imgState, uploadHandler, openHandler, formHandler] = useUploadedFiles([
		{
			id: "1",
			fileName: "1",
			src: "1",
			open: true,
			algorithm: "fs",
			palette: "bw",
			width: 48,
			scale: 2,
		},
	]);

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
							<Dropdown className="z-50" label="Algorithm" id={img.id} options={algOptions} onChange={formHandler} />
							<Dropdown className="z-40" label="Palette" id={img.id} options={paletteOptions} onChange={formHandler} />
							<label className="text-lg">Image Adjustments</label>
							<Slider
								label="Brightness"
								id={img.id}
								value={brightness}
								min={1}
								max={100}
								step={1}
								onChange={(val) => setBrightness(val)}
							/>
							<Slider
								label="Brightness"
								id={img.id}
								value={brightness}
								min={1}
								max={100}
								step={1}
								onChange={(val) => setContrast(val)}
							/>
						</div>
						<div className="w-1/2"></div>
					</div>
				);
			})}
		</form>
	);
}
