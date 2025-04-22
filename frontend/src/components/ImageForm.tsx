import clsx from "clsx";
import { useRef, useMemo, useState, useEffect, memo } from "react";
import { windowImageStyles } from "../App";
import Dropdown, { Option, OptionGroup } from "./Dropdown";
import ResButton from "./ResButton";
import Slider from "./Slider";
import WindowImage from "./WindowImage";
import { UploadedImage, inputHandlerType } from "../hooks/useUploadedImages";
import { useClickOutside } from "../hooks/useClickOutside";
import { nanoid } from "nanoid";
import { isPaletteOption } from "../utils/isA";

interface ImageFormProps {
	img: UploadedImage;
	onChange: inputHandlerType;
}

export default function ImageForm({ img, onChange }: ImageFormProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const canvasImage = useMemo(() => new Image(), []);
	const [windowAbove, setWindowAbove] = useState(true);
	const [paletteList, setPaletteList] = useState<string[]>(img.colours);
	const [tempColor, setTempColor] = useState<string>("");
	const [customPaletteName, setCustomPaletteName] = useState(false);

	const customInd = 2;

	function loadCustomPalettes(): Option[] {
		const customPalettes: Option[] = [];

		for (const name of Object.keys(localStorage)) {
			// check if palette with the same name already exists, don't load it again if so
			let loadedPalette: unknown = JSON.parse(localStorage!.getItem(name) as string);

			// check if the data loaded from localStorage is the right type to be an Option
			if (!isPaletteOption(loadedPalette)) continue;

			// make sure palette name isn't taken already
			if (customPalettes.some((op) => op.name === loadedPalette.name)) continue;

			// make sure palette doesn't already exist
			if (customPalettes.some((op) => op.id === loadedPalette.id)) continue;

			customPalettes.push(loadedPalette);
		}

		return customPalettes;
	}

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
				{ id: "s", val: [[0, 0, 1]], name: "Simple" },
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
					],
					name: "Bayer 4x4",
				},
			],
		},
	];

	const [paletteOptions, setPaletteOptions] = useState<OptionGroup[]>([
		{
			name: "Standard",
			options: [
				{ id: "h&d", val: ["#140428", "#79468a"], name: "Hither & Dither" },
				{ id: "bw_1", val: ["#000000", "#ffffff"], name: "1-Bit Grayscale" },
				{ id: "bw_2", val: ["#000000", "#565656", "#acacac", "#ffffff"], name: "2-Bit Grayscale" },
				{
					id: "rgb_3",
					val: ["#000000", "#0000ff", "#00ffff", "#00ff00", "#ffff00", "#ff0000", "#ff00ff", "#ffffff"],
					name: "3-Bit RGB",
				},
				{ id: "cmyk", val: ["#00ffff", "#ff00ff", "#ffff00", "#000000"], name: "CMYK" },
			],
		},
		{
			name: "Retro",
			options: [
				{ id: "gboy", val: ["#294139", "#39594a", "#5a7942", "#7b8210"], name: "Game Boy" },
				{ id: "gboy_l", val: ["#181818", "#4a5138", "#8c926b", "#c5caa4"], name: "Game Boy Pocket" },
			],
		},
		{
			name: "Custom",
			options: loadCustomPalettes().map((op) => ({ ...op, deletable: true })),
		},
	]);

	console.log(img);

	// useEffect(() => {
	// 	console.log("did its thing");
	// 	setPaletteOptions((prev) => prev.map((opGroup) => ({ name: "test", options: [] })));
	// }, []);

	// useEffect(() => {

	// 	setPaletteOptions((prev) => {
	// 		const updated = [...prev];
	// 		updated[customInd] = { ...updated[customInd], options: [...customPalettes] };

	// 		return updated;
	// 	});
	// }, []);

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
					onDelete={(id) => {
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
					}}
					showLabel
				/>

				<div className="flex flex-wrap gap-2 mb-2 -mt-4 *:rounded-full *:border-medium *:border-4">
					{paletteList.map((col, i) => {
						return (
							<div className="relative items-center p-1 *:cursor-pointer" key={i}>
								<div className="w-12 h-12 rounded-full " style={{ backgroundColor: col }}></div>
								<input
									className="absolute top-0 left-0 w-12 h-12 border-none rounded-full outline-none opacity-0"
									type="color"
									value={col}
									id={`${img.id}-col${i}`}
									name={`${img.id}-col${i}`}
									onChange={(e) => {
										setTempColor(e.target.value);

										let newPaletteList = [...paletteList];
										newPaletteList[i] = tempColor;
										setPaletteList(newPaletteList);
									}}
									onBlur={() => {
										setCustomPaletteName(true);
										onChange(img.id, "colours", paletteList);
									}}
								/>
								<button
									className="absolute flex items-center justify-center text-medium w-8 h-8 border-[3px] text-sm border-medium rounded-full -bottom-2 -right-2 bg-dark [&&]:p-0"
									onClick={(e) => {
										e.preventDefault();
										setCustomPaletteName(true);

										let newPaletteList = [...paletteList];
										newPaletteList.splice(i, 1);

										setPaletteList(newPaletteList);
										onChange(img.id, "colours", newPaletteList);
									}}
								>
									x
								</button>
							</div>
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
							<span className="[&&]:text-4xl italic w-full text-center h-fit pl-1 pt-5 text-medium">+</span>
						</button>
					</div>
					{customPaletteName && (
						// name custom palette
						<input
							onBlur={(e) => {
								if (!e.target.value) return;
								const existingPalette = localStorage.getItem(img.palette);
								console.log(existingPalette, isPaletteOption(existingPalette));
								if (existingPalette && isPaletteOption(JSON.parse(existingPalette))) {
									const existingPaletteOp: Option = JSON.parse(existingPalette);
									localStorage.setItem(
										e.target.value,
										JSON.stringify({ ...existingPaletteOp, name: e.target.value, val: img.colours }),
									);
								} else {
									const newPaletteOp: Option = { id: `hnd-${nanoid()}`, name: e.target.value, val: img.colours };
									localStorage.setItem(newPaletteOp.id, JSON.stringify(newPaletteOp));
									onChange(img.id, "palette", newPaletteOp.id);
								}
							}}
							type="text"
							placeholder="name your palette!"
							className="h-16 px-4 border-4 w-72 bg-dark"
						/>
					)}
				</div>
				<label className="text-lg">Image Adjustments</label>
				<Slider label="Brightness" id={img.id} value={img.brightness} min={1} max={200} step={1} onChange={onChange} />
				<Slider label="Contrast" id={img.id} value={img.contrast} min={1} max={400} step={1} onChange={onChange} />
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
