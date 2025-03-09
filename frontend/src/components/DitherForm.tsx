import clsx from "clsx";
import { useState } from "react";

import { UploadedImage, inputHandlerType, uploadHandlerType, openHandlerType } from "../hooks/useUploadedImages";
import FileUpload from "./FileUpload";
import DitheredImages from "./DitheredImages";
import ImageForm from "./ImageForm";

import upload from "../assets/img/upload.svg";
import arrow from "../assets/img/arrow.svg";
import ditherIt from "../assets/img/ditherit.svg";

interface DitherFormProps {
	imgState: UploadedImage[];
	onChange: inputHandlerType;
	onOpen: openHandlerType;
	onUpload: uploadHandlerType;
}

export interface DitheredImage {
	name: string;
	data: string;
}

// TODO: i really want to do this    because of how easy the dither_general algorithm works, i want to make an interface to let people create their own weight matrices
// this hopefully isn't me going too crazy with scope but!! doesn't seem too hard to implement. at this point, do i just send the weight matrix over the request? i think that could be fine    yeah it's fine json.loads() does the job for me nicely

export default function DitherForm({ imgState, onChange, onOpen, onUpload }: DitherFormProps) {
	const [showForm, setShowForm] = useState(true);
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
		setShowForm(false);
		setLoading(true);

		fetch("/api/images")
			.then<DitheredImage[]>((res) => res.json())
			.then((data) => {
				setDitheredImages(data);
			})
			.then(() => setLoading(false))
			.catch((e) => console.error(e));
	}

	return (
		<div id="form" className="flex items-center justify-center w-full h-full">
			<form className="flex items-center z-50 justify-center w-10/12 before:absolute before:border-8 before:border-b-transparent before:border-r-transparent before:border-t-medium before:border-l-medium h-4/5 bg-dark pixel-corners before:h-3/5 before:w-[97.5%] before:-top-1 before:-left-2">
				{!imgState.length && <FileUpload onUpload={onUpload} />}
				{imgState.length > 0 && (
					<button
						id="width"
						className="absolute z-[999] flex items-center justify-center w-24 h-24 p-4 text-sm font-bold -translate-y-1/2 border-[6px] -right-12 top-1/2 bg-dark border-medium rounded-xl"
						onClick={(e) => {
							e.preventDefault();
							submitImages();
						}}
						title="DITHER IT!!!"
					>
						<img src={ditherIt} className="w-full" alt="" />
					</button>
				)}
				{showForm ? (
					imgState.length == 0 ? (
						<div className="flex flex-col items-center w-full gap-4 text-center bg-dark">
							<img className="w-48" src={upload} alt="Upload icon" />
							<h2 className="">no images have been uploaded!</h2>
							<span className="inline-flex gap-2 text-center text-medium">
								feel free to drag n' drop or click the + icon below to add images!
							</span>
						</div>
					) : (
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
									{img.open && <ImageForm key={i} img={img} onChange={onChange} />}
								</>
							);
						})
					)
				) : (
					<>
						<button
							id="width"
							title="go back to editing"
							className="absolute flex items-center justify-center w-16 h-16 p-4 border-4 rounded-lg shadow-xl shadow-light/10 top-8 left-8 border-medium bg-dark"
							onClick={() => {
								setShowForm(true);
								setDitheredImages([]);
							}}
						>
							<img src={arrow} className="w-full h-full" alt="Back" />
						</button>
						<DitheredImages loading={loading} ditheredImages={ditheredImages} />
					</>
				)}
			</form>
		</div>
	);
}
