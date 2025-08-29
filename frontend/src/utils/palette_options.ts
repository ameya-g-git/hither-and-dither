import isPaletteOption from "./isPaletteOption";
import { Option, OptionGroup } from "../components/Dropdown";

export function loadCustomPalettes(): Option[] {
	const customPalettes: Option[] = [];

	for (const name of Object.keys(localStorage).reverse()) {
		// reverse the list because that often preserves order in terms of recency
		let loadedPalette: unknown = JSON.parse(localStorage!.getItem(name) as string);

		// check if the data loaded from localStorage is the right type to be an Option
		if (!isPaletteOption(loadedPalette)) continue;

		// make sure palette name isn't taken already
		if (customPalettes.some((op) => op.name === loadedPalette.name)) {
			localStorage.removeItem(loadedPalette.id);
			continue;
		}

		// make sure palette doesn't already exist
		if (customPalettes.some((op) => op.id === loadedPalette.id)) {
			localStorage.removeItem(loadedPalette.id);
			continue;
		}

		customPalettes.push(loadedPalette);
	}

	return customPalettes;
}

// TODO: add more freaking palettes

export const defaultPalette: OptionGroup[] = [
	{
		name: "Standard",
		options: [
			{ id: "hnd", val: ["#140428", "#79468a"], name: "Hither & Dither" },
			{ id: "bw_1", val: ["#000000", "#ffffff"], name: "1-Bit Grayscale" },
			{ id: "rnb", val: ["#000000", "#ff5555", "#55ffff", "#ffffff"], name: "Red 'n Blue" },
			{ id: "pnc", val: ["#000000", "#ff00ff", "#00ffff", "#ffffff"], name: "Pink 'n Cyan" },
			{ id: "rgd", val: ["#000000", "#6D6D4C", "#EA3F25", "#F9DB9B"], name: "Rugged Red" },
			{
				id: "bw_2",
				val: ["#000000", "#565656", "#acacac", "#ffffff"],
				name: "2-Bit Grayscale",
			},
			{
				id: "vm8",
				val: [
					"#381631",
					"#e21c61",
					"#e26159",
					"#fea85f",
					"#d8dcb4",
					"#5eb6ad",
					"#1b958d",
					"#105390",
				],
				name: "VividMemory8",
			},
			{
				id: "ra",
				val: [
					"#000030",
					"#3f0a57",
					"#85106b",
					"#b02c2c",
					"#b8673e",
					"#d9932b",
					"#f0bd71",
					"#ffe3ba",
				],
				name: "Royal Armoury",
			},
			{
				id: "rgb_3",
				val: [
					"#000000",
					"#0000ff",
					"#00ffff",
					"#00ff00",
					"#ffff00",
					"#ff0000",
					"#ff00ff",
					"#ffffff",
				],
				name: "3-Bit RGB",
			},
			{
				id: "p_rgb_3",
				val: [
					"#dd7777",
					"#eebb00",
					"#dddd77",
					"#77dd77",
					"#bbffff",
					"#77dddd",
					"#dd77ee",
					"#bbbbbb",
				],
				name: "Pastel 3-Bit RGB",
			},
			{
				id: "cmyk",
				val: ["#00ffff", "#ff00ff", "#ffff00", "#000000"],
				name: "CMYK",
			},
			{
				id: "libr",
				val: ["#FF94FA", "#01BFDC", "#FEF303", "#1619AE"],
				name: "Libremag",
			},
		],
	},
	{
		name: "Retro",
		options: [
			{
				id: "gboy",
				val: ["#294139", "#39594a", "#5a7942", "#7b8210"],
				name: "Game Boy",
			},
			{
				id: "gboy_l",
				val: ["#181818", "#4a5138", "#8c926b", "#c5caa4"],
				name: "Game Boy Pocket",
			},
			{
				id: "gboy_b",
				val: ["#004f3a", "#00694a", "#009a70", "#00b582"],
				name: "Game Boy Light - Backlit",
			},
			{
				id: "aplii_hr",
				val: ["#000000", "#b63dff", "#ea5d15", "#10a4e3", "#43c300", "#ffffff"],
				name: "Apple II - High-res",
			},
			{
				id: "secam",
				val: [
					"#000000",
					"#2121ff",
					"#f03c79",
					"#ff50ff",
					"#7fff00",
					"#7fffff",
					"#ffff3f",
					"#ffffff",
				],
				name: "SECAM",
			},
			{
				id: "chnl_f",
				val: [
					"#e0e0e0",
					"#101010",
					"#91ffa6",
					"#ced0ff",
					"#fcfcfc",
					"#ff3153",
					"#02cc5d",
					"#4b3ff3",
				],
				name: "Fairchild Channel F",
			},
		],
	},
	{
		name: "Custom",
		options: loadCustomPalettes().map((op) => ({ ...op, deletable: true })),
	},
];
