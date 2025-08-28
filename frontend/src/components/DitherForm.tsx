import clsx from "clsx";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { nanoid } from "nanoid";

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
import dataURItoBlob from "../utils/dataUrlToBlob";

interface DitherFormProps {
	imgState: UploadedImage[];
	onChange: inputHandlerType;
	onUpload: uploadHandlerType;
	onDelete: deleteHandlerType;
}

export interface DitheredImage {
	name: string;
	url: string;
	data: Blob;
}

interface PresignedURLResponse {
	url: string;
	fields: object;
}

// TODO: add disclaimer messages if the loading is taking too long
// mention that ordered dithering is known to take some time
// then just do a funny one if it takes a bit longer

// TODO: then we just like   figure out how to secure the API url properly : )

// and that .... should be ............. it

export default function DitherForm({ imgState, onChange, onUpload, onDelete }: DitherFormProps) {
	const [showForm, setShowForm] = useState(true);
	const [showUpload, setShowUpload] = useState(true);
	const [loading, setLoading] = useState(false);
	const [loadingMessages, setLoadingMessages] = useState<string[]>([]);
	const [ditheredImages, setDitheredImages] = useState<DitheredImage[]>([]);
	const [currImageIndex, setCurrImageIndex] = useState(0);
	const [errorMsg, setErrorMsg] = useState("");
	const [progress, setProgress] = useState(0);

	const [tabHover, setTabHover] = useState(false);
	const [tabFocus, setTabFocus] = useState(false);
	const [tabDelIndex, setTabDelIndex] = useState(-1);

	// TODO: disable add image button

	const buttonStyles = (open: boolean) =>
		clsx({
			"h-full min-w-0 w-full overflow-hidden text-nowrap cursor-pointer pr-6 text-lg font-bold border-8 border-b-0 rounded-b-none rounded-3xl text-ellipsis bg-dark":
				true,
			"border-medium text-glow": open,
			"border-medium/50 text-medium hover:border-medium hover:text-glow": !open,
		});

	async function submitImages() {
		try {
			setLoading(true);
			setShowUpload(false);
			const API_URL: string = import.meta.env.VITE_API_URL; // TODO: move api url probably in an environment variable or whatever the securest way is

			if (imgState.length > 7) throw new Error("too many images uploaded! relax!! i'm not rich!!!");

			// upload images temporarily to s3 bucket
			for (const img of imgState) {
				const fileName = `${img.id}.${img.fileName.split(".")[img.fileName.split(".").length - 1]}`;

				// validate if image already exists in bucket
				const { found }: { found: boolean } = await fetch(
					`${API_URL}/validate?fileName=${fileName}`,
					{ method: "GET", mode: "cors" },
				).then((res) => res.json());

				// skip image if it exists
				if (found) {
					console.log(img.fileName + " found, skipping upload");
					setProgress((prev) => (prev += 20 / imgState.length));
					setLoadingMessages((prev) => [img.fileName + " already uploaded!", ...prev]);
					continue;
				}

				console.log("getting presigned url for " + img.fileName);
				const response: PresignedURLResponse = await fetch(
					`${API_URL}/getPresignedUrl?fileName=${fileName}`,
					{ method: "GET" },
				).then((res) => res.json());

				// TODO: later on, i need to make sure to change all of my access control origins to the cloudfront distribution
				// so this includes my lambda headers, api gateway CORS config, and now s3 CORS config

				const { url, fields } = response;
				const formData = new FormData();
				Object.entries(fields).map(([key, value]) => formData.append(key, value));
				formData.append("Content-Type", "image/*");
				formData.append("file", dataURItoBlob(img.src), fileName);

				if (loadingMessages.length > 0)
					setLoadingMessages((prev) => [`uploading ${imgState.length} images...`, ...prev]);
				else
					setLoadingMessages((prev) => [
						`uploading ${((20 - progress) * imgState.length) / 20} images...`,
						...prev.slice(1),
					]);

				console.log("uploading: ", img.fileName);
				// upload image to S3
				await fetch(url, { method: "POST", body: formData }).then(() => {
					setProgress((prev) => prev + 20 / imgState.length);
				});
			}

			if (20 - progress == 20 / imgState.length)
				setLoadingMessages((prev) => ["uploading done!", ...prev]);

			// dither images, getting them from s3 using their id
			for (const img of imgState) {
				const { id, width, fileName, algorithm, weights, colours, brightness, contrast, scale } =
					img;
				const newFileKey = `${id}-dithered-${algorithm}-${nanoid()}.png`;
				const newFileName = `${fileName.split(".").slice(0, -1).join(".")}-dithered-${algorithm}.png`;

				console.log("dithering:", fileName);

				// initialize dither request, receiving a presigned S3 url in a successful response
				// this url is generated before the object exists
				const response = await fetch(`${API_URL}/dither`, {
					method: "POST",
					body: JSON.stringify({
						width,
						key: `${id}.${img.fileName.split(".")[img.fileName.split(".").length - 1]}`,
						newFileKey,
						algorithm,
						weights,
						palette: colours,
						scale,
						brightness,
						contrast,
					}),
				}).then((res) => {
					// return jsonified response if all is good
					if (res.ok) {
						setLoadingMessages((prev) => ["dithering " + fileName, ...prev]);
						setProgress((prev) => prev + 10 / imgState.length);
						return res.json();
					}

					// if server-side error occurs, construct a custom JSON response based on error text
					const message = res.text().then((text) => ({
						statusCode: res.status,
						body: JSON.stringify({ message: res.status + " " + JSON.parse(text).message }),
					}));
					return message;
				});

				if (response.statusCode >= 500) {
					throw new Error(JSON.parse(response.body).message);
				}

				// presigned URL for the dithered image stored in S3
				// once the object exists at the designated key, append its data to ditheredImages
				const ditherURL: string = JSON.parse(response.body).url;

				// repeatedly check for the existence of the object
				let tries = 36;
				let timeout = (ms: number) => new Promise((res) => setTimeout(res, ms));

				function validateDither() {
					if (tries < 0) throw new Error(`Timeout limit exceeded, ${fileName} not dithered.`);

					// wait 10s and then validate if the dithered image exists
					timeout(10000).then(() => {
						tries -= 1;

						fetch(`${API_URL}/validate/dither?fileName=${newFileKey}`, { method: "GET" })
							.then((res) => {
								return res.json();
							})
							.then((data) => {
								// if the image does not exist, rerun the function
								if (!data.found) return validateDither();

								// if the image exists, append its data to ditheredImages
								fetch(ditherURL, { method: "GET" })
									.then((res) => res.blob())
									.then((ditherBlob) => {
										console.log("dithering complete: ", newFileName);
										setLoadingMessages((prev) => [`dithering ${newFileName} complete!`, ...prev]);
										setProgress((prev) => prev + 70 / imgState.length);
										setDitheredImages((prev) => [
											...prev,
											{
												name: newFileName,
												url: ditherURL,
												data: ditherBlob,
											},
										]);
									});
							});
					});
				}

				validateDither();

				if (tries <= 0) {
					throw new Error(`Dithering timeout exceeded. ${fileName} not dithered.`);
				}
			}

			// const response = await fetch("/api", { method: "POST", body: formData });

			// if (response.status === 200 || response.status === 201) {
			// 	console.log("Uploaded images to server");
			// 	fetch("/api/images")
			// 		.then<DitheredImage[]>((res) => res.json())
			// 		.then((data) => {
			// 			setDitheredImages(data);
			// 			setLoading(false);
			// 		});
			// } else {
			// 	const { status, statusText } = response;
			// 	console.error("Error:", statusText, status);
			// 	const { error } = await response.json();
			// 	throw new Error(status + " " + error);
			// }
		} catch (e: any) {
			setErrorMsg(e.message);
			setLoading(false);
		}
	}

	// TODO: when i create the readme for this project, along with the AWS architecture diagram,
	// i'll probably want to store all dithers in an s3 bucket. they're small files, and likely won't fuck me up
	// i'll mention the DSQL idea in a "Next Steps / Future Ideas" section at least

	// TODO: also   give each API route their request body models

	useEffect(() => {
		setTabHover(true);
		setTabFocus(true);
	}, [imgState]);

	useEffect(() => {
		if (currImageIndex < 0 && !showForm) submitImages();
	}, [currImageIndex, showForm]);

	useEffect(() => {
		console.log("checking", ditheredImages.length);
		if (imgState.length > 0 && ditheredImages.length === imgState.length) setLoading(false);
	}, [ditheredImages]);

	return (
		<div id="form" className="flex items-center justify-center w-full h-full pt-32 pb-24 ">
			<form className="flex after:z-10 items-center justify-center h-full min-h-[80dvh] w-10/12 before:absolute before:border-8 before:border-b-transparent before:border-r-transparent before:border-t-medium before:border-l-medium bg-dark pixel-corners rounded-[4rem] rounded-tl-none before:h-3/5 before:w-[calc(100%-2.5rem)] before:-top-1 before:-left-2">
				{showUpload && (
					<FileUpload
						numImg={imgState.length}
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
									<>
										<motion.div
											layout="position"
											layoutId={img.id}
											key={img.id}
											className="relative w-full min-w-0 max-w-[50%] -mr-9"
											style={{
												zIndex:
													i === currImageIndex || i === tabDelIndex
														? imgState.length
														: imgState.length - i,
											}}
										>
											<button
												key={img.id}
												title={img.fileName}
												className={buttonStyles(i == currImageIndex && !showUpload)}
												onMouseOver={() => {
													setTabDelIndex(i);
													setTabHover(true);
												}}
												onFocus={() => {
													setTabDelIndex(i);
													setTabFocus(true);
												}}
												onMouseLeave={() => {
													setTabDelIndex(-1);
													setTabHover(false);
												}}
												onBlur={() => {
													setTabDelIndex(-1);
													setTabFocus(false);
												}}
												onClick={(e) => {
													e.preventDefault();
													setShowUpload(false);
													setCurrImageIndex(i);
												}}
											>
												{img.fileName}
											</button>
										</motion.div>
										{i === tabDelIndex && i !== currImageIndex && (
											<button
												onClick={(e) => {
													e.preventDefault();
													onDelete(img.id);
												}}
												onMouseOver={() => setTabDelIndex(i)}
												title={`delete ${img.fileName}`}
												className="absolute z-50 flex items-center justify-center w-12 h-12 pl-0 text-xl border-4 rounded-full -top-4 bg-dark border-medium text-medium "
												style={{ left: `${(i * 100) / imgState.length}%` }}
											>
												x
											</button>
										)}
									</>
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
											setLoading(true);
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
								setProgress(0);
								setLoadingMessages([]);
								setDitheredImages([]);
								setErrorMsg("");
							}}
						>
							<img src={arrow} className="w-full h-full" alt="Back" />
						</button>
						<DitheredImages
							errorMsg={errorMsg}
							loading={loading}
							loadingMessages={loadingMessages}
							ditheredImages={ditheredImages}
							progress={progress}
						/>
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
							disabled={imgState.length >= 7}
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
