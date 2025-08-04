import clsx from "clsx";
import { useState } from "react";
import { nanoid } from "nanoid";
import { AnimatePresence, motion, Variants } from "motion/react";

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

import floppy from "../assets/pixel_doodles/floppy.svg";

interface ImageFormProps {
	img: UploadedImage;
	onChange: inputHandlerType;
	exit: boolean;
	onExit: () => void;
	formDisabled: boolean;
}

export default function ImageForm({ img, onChange, exit, onExit, formDisabled }: ImageFormProps) {
	const [windowAbove, setWindowAbove] = useState(true);
	const [paletteList, setPaletteList] = useState<string[]>(img.colours);
	const [customPaletteName, setCustomPaletteName] = useState(false);
	const [showSaveAnim, setShowSaveAnim] = useState(false);

	const CUSTOM_IND = 2;

	const windowStyles = (num: number, above: boolean) =>
		clsx({
			"w-2/3 h-2/3": true,
			"top-8 left-8": num == 1,
			"bottom-8 right-8": num == 2,
			"z-[1]": above,
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

	// TODO: add the freaking zip file animation Lol
	// TODO; also just general   change of Interface animations (close windows, hide input elements, etc.)
	// TODO: add the bayer 8x8 and special bayer matrices
	// TODO: add info hover thing for algorithm just to explain what's up

	const [paletteOptions, setPaletteOptions] = useState<OptionGroup[]>(defaultPalette);

	function deletePalette(id: string) {
		let newCustomOptions: Option[] = [...paletteOptions[CUSTOM_IND].options];

		const deleteIndex = newCustomOptions.findIndex((op) => op.id === id);
		newCustomOptions.splice(deleteIndex, 1);

		localStorage.removeItem(id);
		setPaletteOptions((prev) => {
			const updated = [...prev];

			updated[CUSTOM_IND] = {
				...updated[CUSTOM_IND],
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

				updated[CUSTOM_IND] = {
					...updated[CUSTOM_IND],
					options: [...updated[CUSTOM_IND].options, newPaletteOp],
				};

				return updated;
			});
		}

		setShowSaveAnim(true);
	}

	const formVar: Variants = {
		start: { opacity: 0 },
		end: { opacity: 1 },
	};

	const formChildVar: Variants = {
		start: { translateX: "-4rem", opacity: 0 },
		end: { translateX: "0rem", opacity: 1 },
		exit: { translateX: "-4rem", opacity: 0 },
	};

	return (
		<div className="flex flex-col w-full p-12  pt-16 mt-2 rounded-[4rem] md:flex-row bg-dark ">
			<motion.div
				variants={formVar}
				initial="start"
				animate="end"
				exit={exit ? "exit" : ""}
				onAnimationComplete={(def) => {
					if (exit && def === "exit") onExit();
				}}
				transition={{
					staggerChildren: 0.1,
				}}
				className="flex flex-row w-full"
			>
				<div className="flex flex-col w-1/2 gap-4 grow">
					<Dropdown
						className="z-40"
						current={img.algorithm}
						dropFor="algorithm"
						id={img.id}
						options={algOptions}
						onChange={(id, _, [opId, opVal]) => {
							onChange(id, "algorithm", opId);
							onChange(id, "weights", opVal);
						}}
						disabled={formDisabled}
						showLabel
						variants={formChildVar}
					/>
					<Dropdown
						className="z-30"
						current={img.palette}
						dropFor="palette"
						id={img.id}
						options={paletteOptions}
						onChange={(id, key, [opId, opVal]) => {
							setCustomPaletteName(false);
							setPaletteList(opVal);
							onChange(id, key, opId);
							onChange(id, "colours", opVal);
						}}
						onDelete={deletePalette}
						disabled={formDisabled}
						showLabel
						variants={formChildVar}
					/>
					<div className="inline-flex items-start gap-2 mb-2 -mt-4 h-fit">
						<motion.div
							variants={formChildVar}
							className="h-fit max w-fit relative gap-1.5 grid grid-rows-2 grid-flow-col"
						>
							{paletteList.map((col, i) => {
								return (
									<ColourChip
										key={i}
										col={col}
										disabled={formDisabled}
										onChange={(e) => {
											let newPaletteList = [...paletteList];
											newPaletteList[i] = e.target.value;
											setPaletteList(newPaletteList);
											setCustomPaletteName(true);
										}}
										onDelete={() => {
											setCustomPaletteName(true);

											let newPaletteList = [...paletteList];
											newPaletteList.splice(i, 1);

											setPaletteList(newPaletteList);
										}}
										onBlur={() => {
											onChange(img.id, "colours", paletteList);
										}}
									/>
								);
							})}
							{paletteList.length < 12 && (
								<div className="flex w-fit h-fit border-medium border-4 rounded-full items-center p-1 text-4xl *:cursor-pointer">
									<button
										disabled={formDisabled}
										className="flex items-center justify-center p-0 rounded-full bg-dark w-6 h-6 text-2xl pt-3.5 pl-0.5"
										onClick={(e) => {
											e.preventDefault();
											setCustomPaletteName(true);

											const newPaletteList = [...paletteList, "#ffffff"];
											setPaletteList(newPaletteList);
											onChange(img.id, "colours", newPaletteList);
										}}
									>
										<span className="w-full text-center h-fit text-medium">+</span>
									</button>
								</div>
							)}
						</motion.div>

						{customPaletteName && (
							<motion.div className="absolute flex flex-col -top-[4.75rem] items-end gap-5 right-2">
								<input
									onBlur={saveLocalPalette}
									disabled={formDisabled}
									type="text"
									placeholder="name your palette!"
									className="z-30 w-64 h-12 px-4 text-sm border-2 rounded-xl border-medium bg-dark"
								/>
								<AnimatePresence>
									{showSaveAnim && (
										<motion.div
											initial={{ opacity: 0, translateX: "-2rem" }}
											animate={{ opacity: 1, translateX: 0 }}
											exit={{ opacity: 0, translateX: "-2rem" }}
											onAnimationComplete={() => setTimeout(() => setShowSaveAnim(false), 500)}
											className="flex items-center h-6 gap-2"
										>
											<img src={floppy} className="h-full" alt="" />
											<span className="z-50 pt-1 text-xs select-none text-medium">saved!</span>
										</motion.div>
									)}
								</AnimatePresence>
							</motion.div>
						)}
					</div>

					<motion.label variants={formChildVar} className="text-lg">
						Image Adjustments
					</motion.label>
					<Slider
						label="Brightness"
						id={img.id}
						value={img.brightness}
						min={5}
						max={200}
						step={5}
						disabled={formDisabled}
						onChange={onChange}
						variants={formChildVar}
					/>
					<Slider
						label="Contrast"
						id={img.id}
						value={img.contrast}
						min={10}
						max={400}
						step={10}
						disabled={formDisabled}
						onChange={onChange}
						variants={formChildVar}
					/>
					<div className="flex flex-row items-center w-full gap-4 mt-4 max-h-16">
						<motion.label variants={formChildVar}>Export Settings</motion.label>
						<Dropdown
							className="z-40 -mt-6"
							dropFor="width"
							current={String(img.width)}
							id={img.id}
							options={widthOptions}
							disabled={formDisabled}
							onChange={(id, key, [_, opVal]) => onChange(id, key, opVal)}
							variants={formChildVar}
						/>
						<ResButton
							disabled={formDisabled}
							id={img.id}
							onClick={onChange}
							variants={formChildVar}
						/>
					</div>
				</div>
				<div className="w-1/2 p-8">
					<WindowImage
						onClick={() => setWindowAbove(false)}
						className={windowStyles(1, !windowAbove)}
						title={img.fileName}
						height="66%"
						exit={exit ? "exit" : ""}
					>
						<img src={img.src} className="object-contain w-full h-full aspect-auto" alt="" />
					</WindowImage>
					<WindowImage
						onClick={() => setWindowAbove(true)}
						className={windowStyles(2, windowAbove)}
						title={`${img.fileName.slice(0, -4)}_dithered_${img.algorithm}.png`}
						height="66%"
						exit={exit ? "exit" : ""}
					>
						<Canvas className="w-full h-full" img={img} draw={draw} />
					</WindowImage>
				</div>
			</motion.div>
		</div>
	);
}
