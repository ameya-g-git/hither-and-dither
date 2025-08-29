import { isPaletteOption } from "./isA";
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

export const defaultPalette: OptionGroup[] = [
	{
		name: "Standard",
		options: [
			{ id: "h&d", val: ["#140428", "#79468a"], name: "Hither & Dither" },
			{ id: "bw_1", val: ["#000000", "#ffffff"], name: "1-Bit Grayscale" },
			{
				id: "bw_2",
				val: ["#000000", "#565656", "#acacac", "#ffffff"],
				name: "2-Bit Grayscale",
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
				id: "cmyk",
				val: ["#00ffff", "#ff00ff", "#ffff00", "#000000"],
				name: "CMYK",
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
		],
	},
	{
		name: "Custom",
		options: loadCustomPalettes().map((op) => ({ ...op, deletable: true })),
	},
];
