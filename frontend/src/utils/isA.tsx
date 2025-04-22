import { Option } from "../components/Dropdown";

export function isPaletteOption(obj: any): obj is Option {
	return (
		obj &&
		typeof obj === "object" &&
		typeof obj["id"] === "string" &&
		typeof obj["name"] === "string" &&
		Array.isArray(obj["val"]) &&
		obj["val"].every((col) => typeof col === "string")
	);
}
