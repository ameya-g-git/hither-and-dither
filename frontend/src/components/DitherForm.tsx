import clsx from "clsx";
import { useState } from "react";

import { UploadedImage, inputHandlerType, uploadHandlerType } from "../hooks/useUploadedImages";
import FileUpload from "./FileUpload";
import DitheredImages from "./DitheredImages";
import ImageForm from "./ImageForm";

import arrow from "../assets/pixel_doodles/arrow.svg";
import ditherIt from "../assets/pixel_doodles/ditherit.svg";
import addImg from "../assets/pixel_doodles/addimage.svg";
import { AnimatePresence } from "motion/react";

interface DitherFormProps {
	imgState: UploadedImage[];
	onChange: inputHandlerType;
	onUpload: uploadHandlerType;
}

export interface DitheredImage {
	name: string;
	data: string;
}

export default function DitherForm({ imgState, onChange, onUpload }: DitherFormProps) {
	const [showForm, setShowForm] = useState(true);
	const [loading, setLoading] = useState(false);
	const [showUpload, setShowUpload] = useState(true);
	const [ditheredImages, setDitheredImages] = useState<DitheredImage[]>([]);
	const [currImageIndex, setCurrImageIndex] = useState(0);

	const buttonStyles = (open: boolean) =>
		clsx({
			"h-full -mr-9 text-nowrap pr-8 overflow-hidden text-lg font-bold border-8 border-b-0 rounded-b-none max-w-80 rounded-3xl text-ellipsis bg-dark":
				true,
			"border-medium text-glow": open,
			"border-medium/50 text-medium hover:border-medium hover:text-glow": !open,
		});

	async function submitImages() {
		const formData = new FormData();

		formData.append("images", JSON.stringify(imgState));

		try {
			setShowUpload(false);
			setShowForm(false);
			setLoading(true);

			const response = await fetch("/api", { method: "POST", body: formData });

			if (response.status === 200 || response.status === 201) {
				console.log("Uploaded images to server");
			} else {
				console.error("Error:", response.statusText, response.status);
			}

			fetch("/api/images")
				.then<DitheredImage[]>((res) => res.json())
				.then((data) => {
					setDitheredImages(data);
				})
				.then(() => setLoading(false));
		} catch (error) {
			console.error("Error:", error);
			setLoading(false);
			setDitheredImages([]);
		}
	}

	// TODO: use custom named variant setting specifically for when the dither button is pressed
	// this is when i want to play the exit animations, the animations between different "tabs" is already good for me

	return (
		<div id="form" className="flex items-center justify-center w-full h-full pt-32 pb-24 ">
			<form className="flex after:z-10 items-center justify-center h-full min-h-[80dvh] w-10/12 before:absolute before:border-8 before:border-b-transparent before:border-r-transparent before:border-t-medium before:border-l-medium bg-dark pixel-corners rounded-[4rem] rounded-tl-none before:h-3/5 before:w-[calc(100%-2.5rem)] before:-top-1 before:-left-2">
				{showUpload && (
					<FileUpload
						className={imgState.length > 0 ? "h-[calc(100%-1rem)] bottom-0" : "h-full"}
						onUpload={(file) => {
							setCurrImageIndex(imgState.length);
							setShowUpload(false);
							onUpload(file);
						}}
					/>
				)}
				{showForm ? (
					<div className="w-full min-h-[80dvh] h-full">
						<div className="absolute flex flex-row w-[calc(100%-7rem)] h-20 -left-2 -top-16">
							{imgState.map((img, i) => {
								return (
									<button
										key={img.id}
										style={{
											zIndex: i == currImageIndex ? imgState.length : imgState.length - i,
										}}
										title={img.fileName}
										className={buttonStyles(i == currImageIndex && !showUpload)}
										onClick={(e) => {
											e.stopPropagation();
											e.preventDefault();
											setShowUpload(false);
											setCurrImageIndex(i);
										}}
									>
										{img.fileName}
									</button>
								);
							})}
						</div>
						<div className="w-full h-full">
							{/* <AnimatePresence> */}
							{!showUpload && currImageIndex >= 0 && currImageIndex < imgState.length && (
								<ImageForm
									key={imgState[currImageIndex].id}
									img={imgState[currImageIndex]}
									onChange={onChange}
								/>
							)}
							{/* </AnimatePresence> */}
						</div>
					</div>
				) : (
					<>
						<button
							disabled={loading}
							id="width"
							title="go back to editing"
							className="absolute flex items-center justify-center w-16 h-16 p-4 border-4 rounded-lg shadow-xl shadow-light/10 top-8 left-8 border-medium bg-dark"
							onClick={() => {
								setShowForm(true);
								setDitheredImages([]);
								fetch("/api/delete", { method: "POST" });
							}}
						>
							<img src={arrow} className="w-full h-full" alt="Back" />
						</button>
						<DitheredImages loading={loading} ditheredImages={ditheredImages} />
					</>
				)}
				{imgState.length > 0 && showForm && (
					<div className="flex flex-col w-24 z-[999] -right-12 gap-4 absolute top-1/2 -translate-y-1/2 *:rounded-xl">
						<button
							disabled={loading || ditheredImages.length > 0}
							className="flex hover:brightness-125 items-center justify-center w-24 h-24 p-4 text-sm font-bold border-[6px] bg-dark border-medium"
							onClick={(e) => {
								e.preventDefault();
								submitImages();
							}}
							title="DITHER IT!!!"
						>
							<img src={ditherIt} className="w-full" alt="" />
						</button>
						<button
							className="flex hover:brightness-125 items-center justify-center w-24 h-24 p-4 text-sm font-bold border-[6px] bg-dark border-medium"
							onClick={(e) => {
								e.preventDefault();
								setShowUpload(true);
							}}
							title="add image"
						>
							<img src={addImg} className="w-full" alt="" />
						</button>
					</div>
				)}
			</form>
		</div>
	);
}
