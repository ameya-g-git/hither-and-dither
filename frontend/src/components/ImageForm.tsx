import clsx from "clsx";
import { useState } from "react";
import { nanoid } from "nanoid";

import { windowImageStyles } from "../App";
import Dropdown, { Option, OptionGroup } from "./Dropdown";
import ResButton from "./ResButton";
import Slider from "./Slider";
import WindowImage from "./WindowImage";
import ColourChip from "./ColourChip";
import Canvas from "./Canvas";

import { UploadedImage, inputHandlerType } from "../hooks/useUploadedImages";
import { isPaletteOption } from "../utils/isA";
import { algOptions } from "../utils/alg_options";
import { defaultPalette } from "../utils/palette_options";
import { widthOptions } from "../utils/width_options";

interface ImageFormProps {
	img: UploadedImage;
	onChange: inputHandlerType;
}

export default function ImageForm({ img, onChange }: ImageFormProps) {
	const [windowAbove, setWindowAbove] = useState(true);
	const [tempColor, setTempColor] = useState<string>("");
	const [paletteList, setPaletteList] = useState<string[]>(img.colours);
	const [customPaletteName, setCustomPaletteName] = useState(false);

	const customInd = 2;

	const windowStyles = (num: number, above: boolean) =>
		clsx({
			"w-2/3 h-2/3 transition-opacity": true,
			"top-8 left-8": num == 1,
			"bottom-8 right-8": num == 2,
			"z-[999]": above,
			"z-0": !above,
		});

	function draw(
		canvas: HTMLCanvasElement,
		context: CanvasRenderingContext2D,
		canvasImage: HTMLImageElement,
	) {
		context.filter = `grayscale(100%) brightness(${img.brightness}%) contrast(${img.contrast}%)`;
		const vRatio = canvas.width / canvasImage.width;
		const hRatio = canvas.height / canvasImage.height;
		const imgData = context.getImageData(0, 0, canvas.width, canvas.height);

		context.putImageData(imgData, 0, 0);

		console.log(canvas.width, canvas.height, canvasImage.width, canvasImage.height);

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

	// TODO: please improve the loading animation LMAO (maybe save a list of messages and have them scroll down? also improve spacing on multi-line spinners)
	// TODO: add the freaking zip file animation Lol
	// TODO; also just general   change of Interface animations (close windows, hide input elements, etc.)
	// TODO: add the bayer 8x8 and special bayer matrices

	const [paletteOptions, setPaletteOptions] = useState<OptionGroup[]>(defaultPalette);

	function deletePalette(id: string) {
		let newCustomOptions: Option[] = [...paletteOptions[customInd].options];

		const deleteIndex = newCustomOptions.findIndex((op) => op.id === id);
		newCustomOptions.splice(deleteIndex, 1);

		localStorage.removeItem(id);
		setPaletteOptions((prev) => {
			const updated = [...prev];

			updated[customInd] = {
				...updated[customInd],
				options: newCustomOptions,
			};

			return updated;
		});
	}

	function saveLocalPalette(e: React.FocusEvent<HTMLInputElement>) {
		if (!e.target.value) return;

		const existingPalette = localStorage.getItem(img.palette);

		if (existingPalette && isPaletteOption(JSON.parse(existingPalette))) {
			const existingPaletteOp: Option = JSON.parse(existingPalette);
			localStorage.setItem(
				e.target.value,
				JSON.stringify({
					...existingPaletteOp,
					name: e.target.value,
					val: img.colours,
				}),
			);
		} else {
			const newPaletteOp: Option = {
				id: `hnd-${nanoid()}`,
				name: e.target.value,
				val: img.colours,
				deletable: true,
			};
			localStorage.setItem(newPaletteOp.id, JSON.stringify(newPaletteOp));
			onChange(img.id, "palette", newPaletteOp.id);
			setPaletteOptions((prev) => {
				const updated = [...prev];

				updated[customInd] = {
					...updated[customInd],
					options: [...updated[customInd].options, newPaletteOp],
				};

				return updated;
			});
		}
	}
	return (
		<div className="absolute flex flex-col w-full h-full p-12 pt-16 mt-2 rounded-[4rem] md:flex-row bg-dark ">
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
					onChange={(id, key, [opId, opVal]) => {
						setCustomPaletteName(false); // hide custom palette name on palette change
						setPaletteList(opVal);
						onChange(id, key, opId);
						onChange(id, "colours", opVal);
					}}
					onDelete={deletePalette}
					showLabel
				/>

				<div className="flex flex-wrap gap-2 mb-2 -mt-4 *:rounded-full *:border-medium *:border-4">
					{paletteList.map((col, i) => {
						return (
							<ColourChip
								col={col}
								onChange={(e) => {
									let newPaletteList = [...paletteList];
									newPaletteList[i] = e.target.value;
									setPaletteList(newPaletteList);
								}}
								onDelete={() => {
									setCustomPaletteName(true);

									let newPaletteList = [...paletteList];
									newPaletteList.splice(i, 1);

									setPaletteList(newPaletteList);
								}}
								onBlur={() => {
									setCustomPaletteName(true);
									onChange(img.id, "colours", paletteList);
								}}
							/>
						);
					})}
					<div className="flex items-center p-1 text-4xl *:cursor-pointer">
						<button
							className="flex items-center justify-center w-12 h-12 rounded-full [&&]:p-0 bg-dark hover:brightness-125"
							onClick={(e) => {
								e.preventDefault();
								setCustomPaletteName(true);

								const newPaletteList = [...paletteList, "#ffffff"];
								setPaletteList(newPaletteList);
								onChange(img.id, "colours", newPaletteList);
							}}
						>
							<span className="[&&]:text-4xl italic w-full text-center h-fit pl-1 pt-5 text-medium">
								+
							</span>
						</button>
					</div>
					{customPaletteName && (
						// name custom palette
						<input
							onBlur={saveLocalPalette}
							type="text"
							placeholder="name your palette!"
							className="h-16 px-4 border-4 w-72 bg-dark"
						/>
					)}
				</div>
				<label className="text-lg">Image Adjustments</label>
				<Slider
					label="Brightness"
					id={img.id}
					value={img.brightness}
					min={1}
					max={200}
					step={1}
					onChange={onChange}
				/>
				<Slider
					label="Contrast"
					id={img.id}
					value={img.contrast}
					min={1}
					max={400}
					step={1}
					onChange={onChange}
				/>
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
					height="66%"
				>
					<img src={img.src} className="object-contain w-full h-full aspect-auto" alt="" />
				</WindowImage>
				<WindowImage
					onClick={() => setWindowAbove(true)}
					className={windowStyles(2, windowAbove)}
					title={`${img.fileName.slice(0, -4)}_dithered_${img.algorithm}.png`}
					height="66%"
				>
					<Canvas className="w-full h-full" img={img} draw={draw} />
				</WindowImage>
			</div>
		</div>
	);
}
