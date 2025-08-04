import clsx from "clsx";
import { useEffect, useState } from "react";

import {
	UploadedImage,
	deleteHandlerType,
	inputHandlerType,
	uploadHandlerType,
} from "../hooks/useUploadedImages";
import FileUpload from "./FileUpload";
import DitheredImages from "./DitheredImages";
import ImageForm from "./ImageForm";

import arrow from "../assets/pixel_doodles/arrow.svg";
import ditherIt from "../assets/pixel_doodles/ditherit.svg";
import addImg from "../assets/pixel_doodles/addimage.svg";
import { AnimatePresence, motion } from "motion/react";

interface DitherFormProps {
	imgState: UploadedImage[];
	onChange: inputHandlerType;
	onUpload: uploadHandlerType;
	onDelete: deleteHandlerType;
}

export interface DitheredImage {
	name: string;
	data: string;
}

export default function DitherForm({ imgState, onChange, onUpload, onDelete }: DitherFormProps) {
	const [showForm, setShowForm] = useState(true);
	const [loading, setLoading] = useState(false);
	const [showUpload, setShowUpload] = useState(true);
	const [ditheredImages, setDitheredImages] = useState<DitheredImage[]>([]);
	const [currImageIndex, setCurrImageIndex] = useState(0);
	const [errorMsg, setErrorMsg] = useState("");

	const [tabHover, setTabHover] = useState(false);
	const [tabFocus, setTabFocus] = useState(false);
	const [tabDelIndex, setTabDelIndex] = useState(-1);

	const buttonStyles = (open: boolean) =>
		clsx({
			"h-full max-w-80 min-w-0 w-full overflow-hidden text-nowrap cursor-pointer pr-6 text-lg font-bold border-8 border-b-0 rounded-b-none rounded-3xl text-ellipsis bg-dark":
				true,
			"border-medium text-glow": open,
			"border-medium/50 text-medium hover:border-medium hover:text-glow": !open,
		});

	async function submitImages() {
		try {
			setLoading(true);
			setShowUpload(false);

			const formData = new FormData();
			formData.append("images", JSON.stringify(imgState));

			const response = await fetch("/api", { method: "POST", body: formData });

			if (response.status === 200 || response.status === 201) {
				console.log("Uploaded images to server");
				fetch("/api/images")
					.then<DitheredImage[]>((res) => res.json())
					.then((data) => {
						setDitheredImages(data);
						setLoading(false);
					});
			} else {
				const { status, statusText } = response;
				console.error("Error:", statusText, status);
				const { error } = await response.json();
				throw new Error(status + " " + error);
			}
		} catch (e: any) {
			setErrorMsg(e.message);
			setLoading(false);
		}
	}

	useEffect(() => {
		setTabHover(true);
		setTabFocus(true);
	}, [imgState]);

	useEffect(() => {
		if (currImageIndex < 0 && !showForm) submitImages();
	}, [currImageIndex, showForm]);

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
									<motion.div
										layout="position"
										layoutId={img.id}
										key={img.id}
										transition={{}}
										className="relative min-w-0 max-w-72 -mr-9"
										style={{
											zIndex: i == currImageIndex ? imgState.length : imgState.length - i,
										}}
									>
										<button
											key={img.id}
											className={buttonStyles(i == currImageIndex && !showUpload)}
											onMouseOver={() => {
												setTabDelIndex(i);
												setTabHover(true);
											}}
											onMouseLeave={() => setTabHover(false)}
											onFocus={() => {
												setTabDelIndex(i);
												setTabFocus(true);
											}}
											onBlur={() => setTabFocus(false)}
											autoFocus
											title={img.fileName}
											onClick={(e) => {
												e.preventDefault();
												setShowUpload(false);
												setCurrImageIndex(i);
											}}
										>
											{img.fileName}
										</button>
										{i === tabDelIndex && (
											<button
												onClick={(e) => {
													e.preventDefault();
													onDelete(img.id);
												}}
												title={`delete ${img.fileName}`}
												className="absolute z-50 flex items-center justify-center w-12 h-12 pl-0 text-xl border-4 rounded-full -top-4 -right-2 bg-dark border-medium text-medium "
											>
												x
											</button>
										)}
									</motion.div>
								);
							})}
						</div>
						<div className="w-full h-full">
							<AnimatePresence mode="wait">
								{currImageIndex >= 0 && currImageIndex < imgState.length && (
									<ImageForm
										key={imgState[currImageIndex].id}
										img={imgState[currImageIndex]}
										formDisabled={showUpload}
										onChange={onChange}
										exit={!tabHover && !tabFocus && !showUpload}
										onExit={() => {
											setShowForm(false);
										}}
									/>
								)}
							</AnimatePresence>
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
								setCurrImageIndex(0);
								setShowForm(true);
								setDitheredImages([]);
								setErrorMsg("");
								fetch("/api/delete", { method: "POST" });
							}}
						>
							<img src={arrow} className="w-full h-full" alt="Back" />
						</button>
						<DitheredImages errorMsg={errorMsg} loading={loading} ditheredImages={ditheredImages} />
					</>
				)}
				{imgState.length > 0 && showForm && (
					<div className="flex flex-col w-24 z-[999] -right-12 gap-4 absolute top-1/2 -translate-y-1/2 *:rounded-xl">
						<button
							disabled={loading || ditheredImages.length > 0}
							className="flex hover:brightness-125 items-center justify-center w-24 h-24 p-4 text-sm font-bold border-[6px] bg-dark border-medium"
							onMouseOver={() => setTabHover(false)}
							onFocus={() => setTabFocus(false)}
							onClick={(e) => {
								e.preventDefault();
								if (showUpload || tabHover || tabFocus) setShowForm(false);
								setCurrImageIndex(-1);
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
