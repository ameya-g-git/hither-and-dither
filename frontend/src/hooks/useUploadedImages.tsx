import { nanoid } from "nanoid";
import { useCallback, useReducer } from "react";

/**
 * @typedef UploadedImage
 *
 * @property {string} id | The id of the image, used for making form state updates easier
 * @property {string} fileName | The filename of the image
 * @property {string} src | The data URL of the image
 * IMAGE ADJUSTMENTS
 * @property {number} brightness
 * @property {number} contrast
 * DITHERING OPTIONS
 * @property {string} algorithm | Dithering algorithm of choice, represented by a short string ID
 * @property {number[][]} weights | weight matrix for respective algorithm
 * @property {string} palette | Palette ID
 * @property {string[]} colours | Colour palette in list format, colours represented in hexadecimal
 * @property {string} width
 * @property {number} scale
 */
export interface UploadedImage {
	id: string;
	fileName: string;
	src: string;

	brightness: number;
	contrast: number;

	algorithm: string;
	weights: number[][];
	palette: string;
	colours: string[];
	width: number;
	scale: number;
}

interface Action {
	type: string;
}

interface UploadAction extends Action {
	file: File;
	src: string;
}

interface InputAction extends Action {
	id: string;
	key: string;
	value: any;
}

export type uploadHandlerType = (file: File) => void;

export type inputHandlerType = (id: string, key: string, value: any) => void;

type UploadedFilesHookReturn = [UploadedImage[], uploadHandlerType, inputHandlerType];

/**
 * Reads an inputted files data URL. Adapted from Joseph Zimmerman's drag-and-drop uploader linked below:
 * https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/#additional-features
 * @param file
 * @returns Promise containing the data URL
 */
async function readDataURL(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onloadend = function () {
			if (typeof this.result === "string") {
				resolve(this.result);
			} else {
				reject(new Error("Failed to read file."));
			}
		};
		reader.onerror = function () {
			reject(new Error("Error reading file"));
		};
	});
}

/**
 * Converts an uploaded File to an easily parseable object with pertinent details for the app
 * @param file
 * @returns {UploadedImage}
 */
function fileToUploadedImage(file: File) {
	const image: UploadedImage = {
		id: nanoid(),
		fileName: file.name,
		src: "",

		brightness: 100,
		contrast: 100,

		algorithm: "fs",
		weights: [
			[0, 0, 7 / 16],
			[3 / 16, 5 / 16, 1 / 16],
		],
		palette: "bw_1",
		colours: ["#000000", "#ffffff"],
		width: 480,
		scale: 1,
	};

	return image;
}

/**
 * The main reducer function, containing all of the logic for updating imgState, such as an image upload handler and a form data handler
 * @param state | The current state before updates arrive
 * @param action | The action defined by a given dispatch() call
 * @returns {UploadedImage[]} | The updated state after the reducer call finishes
 */
function imgReducer(state: UploadedImage[] | undefined, action: UploadAction | InputAction) {
	switch (action.type) {
		case "UPLOAD_FILES": {
			const { file, src } = action as UploadAction;
			const uploadState = state as UploadedImage[];

			const image = fileToUploadedImage(file);
			image.src = src;

			return [...uploadState, image];
		}
		case "INPUT_CHANGE": {
			const { id, key, value } = action as InputAction;
			const formState = state as UploadedImage[];

			const imageIndex = formState.findIndex((img) => img.id === id);

			const newState = [...formState];

			newState[imageIndex] = {
				...formState[imageIndex],
				[key]: value,
			};

			return newState;
		}
		default: {
			return state;
		}
	}
}

/**
 * The main hook function, returning helper functions that make updating this complex state object easier
 * @param initialImages | The initial state of images
 * @returns {UploadedFilesHookReturn} | A list of handler functions for the hook to function
 */
export default function useUploadedFiles(initialImages: UploadedImage[]) {
	const [imgState, dispatch] = useReducer(imgReducer, [...initialImages]);

	const uploadHandler = useCallback((file: File) => {
		const src = readDataURL(file);

		Promise.resolve(src)
			.then((src) => {
				dispatch({
					type: "UPLOAD_FILES",
					file: file,
					src: src,
				});
			})
			.catch((error) => console.error("Error uploading files", error));
	}, []);

	const formHandler = useCallback((id: string, key: string, value: any) => {
		dispatch({
			type: "INPUT_CHANGE",
			id,
			key,
			value,
		});
	}, []);

	return [imgState, uploadHandler, formHandler] as UploadedFilesHookReturn;
}
