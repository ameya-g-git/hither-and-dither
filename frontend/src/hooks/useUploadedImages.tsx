import { nanoid } from "nanoid";
import { useCallback, useReducer } from "react";

/**
 * @typedef UploadedImage
 *
 * @property {string} id | The id of the image, used for making form state updates easier
 * @property {string} fileName | The filename of the image
 * @property {string} src | The data URL of the image
 * @property {boolean} open | True if this image is the currently open one in the menu
 * IMAGE ADJUSTMENTS
 * @property {number} brightness
 * @property {number} contrast
 * DITHERING OPTIONS
 * @property {string} algorithm | Dithering algorithm of choice
 * @property {string} palette
 * @property {string} width
 * @property {number} scale
 */
export interface UploadedImage {
	id: string;
	fileName: string;
	src: string;
	open: boolean;

	brightness: number;
	contrast: number;

	algorithm: string;
	palette: string;
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

interface SelectAction extends Action {
	id: string;
}

interface InputAction extends Action {
	id: string;
	key: string;
	value: any;
}

type uploadHandlerType = (file: File) => void;

export type selectHandlerType = (id: string, value: boolean) => void;

export type inputHandlerType = (id: string, key: string, value: any) => void;

type UploadedFilesHookReturn = [UploadedImage[], uploadHandlerType, selectHandlerType, inputHandlerType];

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
		open: true,

		brightness: 100,
		contrast: 100,

		algorithm: "fs",
		palette: "bw", // TODO: figure out a better way to encode this maybe ???
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
function imgReducer(state: UploadedImage[] | undefined, action: UploadAction | InputAction | SelectAction) {
	switch (action.type) {
		case "UPLOAD_FILES": {
			const { file, src } = action as UploadAction;
			const uploadState = state as UploadedImage[];
			const fileList: UploadedImage[] = [];

			const image = fileToUploadedImage(file);
			image.src = src;
			fileList.push(image);

			return [...uploadState, ...fileList];
		}
		case "OPEN_MENU": {
			const { id } = action as SelectAction;
			const imageIndex = state!.findIndex((img) => img.id === id);
			const newState: UploadedImage[] = state!.map((image) => {
				return { ...image, open: false };
			});

			newState[imageIndex] = {
				...newState[imageIndex],
				open: true,
			};

			return newState;
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

	const openHandler = useCallback((id: string) => {
		dispatch({
			type: "OPEN_MENU",
			id,
		});
	}, []);

	const formHandler = useCallback((id: string, key: string, value: any) => {
		dispatch({
			type: "INPUT_CHANGE",
			id,
			key,
			value,
		});
	}, []);

	return [imgState, uploadHandler, openHandler, formHandler] as UploadedFilesHookReturn;
}
