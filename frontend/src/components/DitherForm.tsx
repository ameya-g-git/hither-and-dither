import clsx from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";

import { UploadedImage, inputHandlerType, uploadHandlerType, openHandlerType } from "../hooks/useUploadedImages";
import Dropdown, { OptionGroup } from "./Dropdown";
import Slider from "./Slider";
import ResButton from "./ResButton";
import WindowImage from "./WindowImage";
import { windowImageStyles } from "../App";
import FileUpload from "./FileUpload";

interface DitherFormProps {
	imgState: UploadedImage[];
	onChange: inputHandlerType;
	onOpen: openHandlerType;
	onUpload: uploadHandlerType;
}
interface ImageFormProps {
	img: UploadedImage;
	onChange: inputHandlerType;
	open: boolean;
}

interface DitheredImage {
	name: string;
	data: string;
}

// TODO: i really want to do this    because of how easy the dither_general algorithm works, i want to make an interface to let people create their own weight matrices
// this hopefully isn't me going too crazy with scope but!! doesn't seem too hard to implement. at this point, do i just send the weight matrix over the request? i think that could be fine    yeah it's fine json.loads() does the job for me nicely

function ImageForm({ img, onChange, open }: ImageFormProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const canvasImage = useMemo(() => new Image(), []);
	const [windowAbove, setWindowAbove] = useState(true);
	const windowStyles = (num: number, above: boolean) =>
		clsx({
			"w-2/3 h-2/3": true,
			"top-8 left-8": num == 1,
			"bottom-8 right-8": num == 2,
			"z-[999]": above,
			"z-0": !above,
		});

	useEffect(() => {
		// brightness + contrast handler
		if (canvasRef && canvasRef.current) {
			if (!canvasImage.src) {
				canvasImage.src = img.src;
			}
			const canvas = canvasRef.current;
			const context = canvas.getContext("2d");
			if (context) {
				context.filter = `grayscale(100%) brightness(${img.brightness}%) contrast(${img.contrast}%)`;
				const vRatio = canvas.width / canvasImage.width;
				const hRatio = canvas.height / canvasImage.height;
				const imgData = context.getImageData(0, 0, canvas.width, canvas.height);

				context.putImageData(imgData, 0, 0);

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
					canvasImage.height * ratio,
				);
			}
		}
	}, [img]);

	const widthOptions: OptionGroup[] = [
		{
			name: "",
			options: [
				{ id: "360", val: 360, name: "360px" },
				{ id: "480", val: 480, name: "480px" },
				{ id: "720", val: 720, name: "720px" },
			],
		},
	];

	const algOptions: OptionGroup[] = [
		{
			name: "Diffusion",
			options: [
				{ id: "s", val: [[[0, 1]], 1], name: "Simple" },
				{
					id: "fs",
					val: [
						[0, 0, 7 / 16],
						[3 / 16, 5 / 16, 1 / 16],
					],
					name: "Floyd-Steinberg",
				},
				{
					id: "jjn",
					val: [
						[0, 0, 0, 7 / 48, 5 / 48],
						[3 / 48, 5 / 48, 7 / 48, 5 / 48, 3 / 48],
						[1 / 48, 3 / 48, 5 / 48, 3 / 48, 1 / 48],
					],
					name: "JJN",
				},
				{
					id: "stk",
					val: [
						[0, 0, 0, 8 / 42, 4 / 42],
						[2 / 42, 4 / 42, 8 / 42, 4 / 42, 2 / 42],
						[1 / 42, 2 / 42, 4 / 42, 2 / 42, 1 / 42],
					],
					name: "Stucki",
				},
				{
					id: "atk",
					val: [
						[0, 0, 0, 1 / 8, 1 / 8],
						[0, 1 / 8, 1 / 8, 1 / 8, 0],
						[0, 0, 1 / 8, 0, 0],
					],
					name: "Atkinson",
				},
				{
					id: "urk",
					val: [
						[0, 0, 0, 8 / 32, 4 / 32],
						[2 / 32, 4 / 32, 8 / 32, 4 / 32, 2 / 32],
					],
					name: "Burkes",
				},
				{
					id: "2sra",
					val: [
						[0, 0, 0, 5 / 32, 3 / 32],
						[2 / 32, 4 / 32, 5 / 32, 4 / 32, 2 / 32],
						[0, 2 / 32, 3 / 32, 2 / 32, 0],
					],
					name: "Two-Row Sierra",
				},
				{
					id: "sra",
					val: [
						[0, 0, 0, 4 / 16, 3 / 16],
						[1 / 16, 2 / 16, 3 / 16, 2 / 16, 1 / 16],
					],
					name: "Sierra",
				},
				{
					id: "sra_l",
					val: [
						[0, 0, 2 / 4],
						[1 / 4, 1 / 4, 0],
					],
					name: "Sierra Lite",
				},
			],
		},
		{
			name: "Ordered",
			options: [
				{
					id: "b2x2",
					val: [
						[0, 2 / 4],
						[3 / 4, 1 / 4],
					],
					name: "Bayer 2x2",
				},
				{
					id: "b4x4",
					val: [
						[0, 8 / 16, 2 / 16, 10 / 16],
						[12 / 16, 4 / 16, 14 / 16, 6 / 16],
						[3 / 16, 11 / 16, 1 / 16, 9 / 16],
						[15 / 16, 7 / 16, 13 / 16, 5 / 16],
						,
					],
					name: "Bayer 4x4",
				},
			],
		},
	];

	const paletteOptions: OptionGroup[] = [
		{
			name: "Standard",
			options: [
				{ id: "bw", name: "B&W" },
				{ id: "cmyk", name: "CMYK" },
			],
		},
		{
			name: "Retro",
			options: [
				{ id: "gboy", name: "Gameboy" },
				{ id: "gboy2", name: "Gameboy2" },
			],
		},
	];
	return (
		<div className="absolute flex flex-col w-full h-full p-12 pt-16 mt-2 md:flex-row bg-dark ">
			<div className="flex flex-col gap-4 grow">
				<Dropdown
					className="z-50"
					current={img.algorithm}
					dropFor="algorithm"
					id={img.id}
					options={algOptions}
					onChange={(id, _, [opId, opVal]) => {
						onChange(id, "algorithm", opId);
						onChange(id, "weights", opVal);
					}}
					showLabel
				/>
				<Dropdown
					className="z-40"
					current={img.palette}
					dropFor="palette"
					id={img.id}
					options={paletteOptions}
					onChange={(id, key, [opId, _]) => onChange(id, key, opId)}
					showLabel
				/>
				<label className="text-lg">Image Adjustments</label>
				<Slider label="Brightness" id={img.id} value={img.brightness} min={1} max={200} step={1} onChange={onChange} />
				<Slider label="Contrast" id={img.id} value={img.contrast} min={1} max={200} step={1} onChange={onChange} />
				<div className="flex flex-row items-center w-full gap-4 mt-4 max-h-16">
					<label htmlFor="">Image Width</label>
					<Dropdown
						className="z-30 -mt-6"
						dropFor="width"
						current={String(img.width)}
						id={img.id}
						options={widthOptions}
						onChange={(id, key, [_, opVal]) => onChange(id, key, opVal)}
					/>
					<ResButton id={img.id} onClick={onChange} />
				</div>
			</div>
			<div className="w-1/2 p-8">
				<WindowImage
					onClick={() => setWindowAbove(false)}
					className={windowStyles(1, !windowAbove)}
					title={img.fileName}
				>
					<img src={img.src} className={windowImageStyles} alt="" />
				</WindowImage>
				<WindowImage
					onClick={() => setWindowAbove(true)}
					className={windowStyles(2, windowAbove)}
					title={`${img.fileName.slice(0, -4)}_dithered_${img.algorithm}.png`}
				>
					<canvas className={windowImageStyles} ref={canvasRef} />
				</WindowImage>
			</div>
		</div>
	);
}

export default function DitherForm({ imgState, onChange, onOpen, onUpload }: DitherFormProps) {
	const [showForm, setShowForm] = useState(false);
	const [loading, setLoading] = useState(false);
	const [ditheredImages, setDitheredImages] = useState<DitheredImage[]>([]);
	// TODO: erm do i want to put the submit handler within useUploadedImages.tsx ? if so i would need to store a loading variable as well. is that too much to have?

	const buttonStyles = (open: boolean) =>
		clsx({
			"absolute small-pixel-corners h-20 before:bg-dark text-nowrap pr-8 overflow-hidden text-lg font-bold border-8 border-b-0 rounded-b-none max-w-80 rounded-3xl text-ellipsis bg-dark -top-16":
				true,
			"border-medium text-glow": open,
			"border-medium/50 text-medium hover:border-medium hover:text-glow": !open,
		});

	useEffect(() => {
		if (imgState.length > 0) {
			setShowForm(true);
		}
	}, [imgState]);

	async function submitImages() {
		const formData = new FormData();

		formData.append("images", JSON.stringify(imgState));

		try {
			const response = await fetch("/api", { method: "POST", body: formData });

			if (response.status === 200 || response.status === 201) {
				console.log("Uploaded images to server");
			} else {
				console.error("Error:", response.statusText, response.status);
			}
		} catch (error) {
			console.error("Error:", error);
		}

		// setLoading(true);

		// fetch("/api/images")
		// 	.then<DitheredImage[]>((res) => res.json())
		// 	.then((data) => setDitheredImages(data))
		// 	.then(() => setLoading(false))
		// 	.catch((e) => console.error(e));
	}

	return (
		<div id="form" className="flex items-center justify-center w-full h-full">
			<form className="flex items-center z-50 justify-center w-10/12 before:absolute before:border-8 before:border-b-transparent before:border-r-transparent before:border-t-medium before:border-l-medium h-4/5 bg-dark pixel-corners before:h-3/5 before:w-[97.5%] before:-top-1 before:-left-2">
				{!imgState.length && <FileUpload onUpload={onUpload} />}
				<button
					className="absolute top-0 right-0 z-50 flex items-center justify-center h-16 px-4 text-sm font-bold bg-medium text-dark"
					onClick={(e) => {
						e.preventDefault();
						submitImages();
					}}
				>
					DITHER IT!!
				</button>
				{showForm ? (
					imgState.map((img, i) => {
						return (
							<>
								<button
									title={img.fileName}
									className={buttonStyles(img.open)}
									onClick={(e) => {
										e.stopPropagation();
										e.preventDefault();
										onOpen(img.id);
									}}
									style={{
										left: `${i * 250 - 8}px`,
										zIndex: img.open ? 999 : imgState.length - i - 999,
									}}
								>
									{img.fileName.slice(0, img.fileName.length - 4)}
								</button>
								{img.open && <ImageForm img={img} onChange={onChange} open={img.open} />}
							</>
						);
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
