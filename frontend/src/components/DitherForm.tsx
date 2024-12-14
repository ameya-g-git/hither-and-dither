import { inputHandlerType, uploadHandlerType, UploadedImage } from "../hooks/useUploadedImages";
import Dropdown, { OptionGroup } from "./Dropdown";
import Slider from "./Slider";
import ResButton from "./ResButton";
import FileUpload from "./FileUpload";
import { useState } from "react";

interface DitherFormProps {
	imgState: UploadedImage[];
	onChange: inputHandlerType;
	onUpload: uploadHandlerType;
}

export default function DitherForm({ imgState, onChange, onUpload }: DitherFormProps) {
	const [isDraggedOver, setIsDraggedOver] = useState(false);

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
	console.log(imgState.length);

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
		<div id="form" className="flex items-center justify-center w-full h-full">
			<form
				className="flex items-center z-50 justify-center w-10/12 before:absolute before:border-8 before:border-b-transparent before:border-r-transparent before:border-t-medium before:border-l-medium h-4/5 bg-dark pixel-corners before:h-3/5 before:w-[97.5%] before:-top-1 before:-left-2"
				action="proxy address"
			>
				{imgState.length > 1 ? (
					imgState.map((img, i) => {
						return (
							<div
								// TODO: make the open property in an UploadedImage do   something
								key={i}
								className="absolute flex flex-row w-full h-full p-12 pt-16 mt-16 "
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
					})
				) : (
					<div className="flex flex-col items-center gap-4 text-center">
						<h2 className="">no images have been uploaded!</h2>
						<span className="inline-flex gap-2 text-center text-medium">
							feel free to drag n' drop or click the + icon to add images!
						</span>
					</div>
				)}
			</form>
		</div>
	);
}
