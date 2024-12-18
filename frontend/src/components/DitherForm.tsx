import { inputHandlerType, uploadHandlerType, UploadedImage } from "../hooks/useUploadedImages";
import Dropdown, { OptionGroup } from "./Dropdown";
import Slider from "./Slider";
import ResButton from "./ResButton";
import FileUpload from "./FileUpload";
import { useEffect, useMemo, useRef, useState } from "react";
import WindowImage from "./WindowImage";
import { windowImageStyles } from "../App";

interface DitherFormProps {
	imgState: UploadedImage[];
	onChange: inputHandlerType;
	onUpload: uploadHandlerType;
}
interface ImageFormProps {
	img: UploadedImage;
	onChange: inputHandlerType;
	open: boolean;
}

function ImageForm({ img, onChange, open }: ImageFormProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [canvasImage, _] = useState(new Image());

	useEffect(() => {
		if (canvasRef && canvasRef.current) {
			if (!canvasImage.src) {
				canvasImage.src = img.src;
			}
			const canvas = canvasRef.current;
			const context = canvas.getContext("2d");
			if (context) {
				context.filter = `brightness(${img.brightness}%) contrast(${img.contrast}%)`;
				const vRatio = canvas.width / canvasImage.width;
				const hRatio = canvas.height / canvasImage.height;

				const ratio = Math.min(vRatio, hRatio);
				var centerShift_x = (canvas.width - canvasImage.width * ratio) / 2;
				var centerShift_y = (canvas.height - canvasImage.height * ratio) / 2;
				context.clearRect(0, 0, canvas.width, canvas.height);
				context.drawImage(
					canvasImage,
					0,
					0,
					canvasImage.width,
					canvasImage.height,
					centerShift_x,
					centerShift_y,
					canvasImage.width * ratio,
					canvasImage.height * ratio
				);
			}
		}
	}, [img]);

	// useEffect(() => {
	// 	if (canvasRef && canvasRef.current) {
	// 		const canvas = canvasRef.current;
	// 		const imageData = canvas.toDataURL();
	// 		onChange(img.id, "src", imageData);
	// 	}
	// }, [open]);

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
		<div
			// TODO: make the open property in an UploadedImage do   something
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
					max={200}
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
					max={200}
					step={1}
					onChange={(val) => onChange(img.id, "contrast", val)}
				/>
				<div className="flex flex-row items-center w-full gap-4 mt-4 max-h-16">
					<label htmlFor="">Image Width</label>
					<Dropdown className="z-30 -mt-6" id={img.id} options={widthOptions} onChange={onChange} />
					<ResButton id={img.id} onClick={onChange} />
				</div>
			</div>
			<div className="w-1/2 p-8">
				<WindowImage className="w-2/3 h-2/3 top-8 left-8" title={img.fileName}>
					<img src={img.src} className={windowImageStyles} alt="" />
				</WindowImage>
				<WindowImage className="w-2/3 h-2/3 bottom-8 right-8" title={img.fileName}>
					<canvas className={windowImageStyles} ref={canvasRef} />
				</WindowImage>
			</div>
		</div>
	);
}

export default function DitherForm({ imgState, onChange, onUpload }: DitherFormProps) {
	const [showForm, setShowForm] = useState(false);

	useEffect(() => {
		if (imgState.length > 0) {
			setShowForm(true);
		}
	}, [imgState]);

	return (
		<div id="form" className="flex items-center justify-center w-full h-full">
			<form
				className="flex items-center z-50 justify-center w-10/12 before:absolute before:border-8 before:border-b-transparent before:border-r-transparent before:border-t-medium before:border-l-medium h-4/5 bg-dark pixel-corners before:h-3/5 before:w-[97.5%] before:-top-1 before:-left-2"
				action="proxy address"
			>
				{showForm ? (
					imgState.map((img, i) => {
						return <ImageForm img={img} onChange={onChange} open={img.open} />;
					})
				) : (
					<div className="flex flex-col items-center gap-4 text-center">
						<h2 className="">no images have been uploaded!</h2>
						<span className="inline-flex gap-2 text-center text-medium">
							feel free to drag n' drop or click the + icon below to add images!
						</span>
					</div>
				)}
			</form>
		</div>
	);
}
