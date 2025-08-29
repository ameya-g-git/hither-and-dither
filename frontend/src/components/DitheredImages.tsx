import saveAs from "file-saver";
import JSZip from "jszip";
import moment from "moment";
import { AnimatePresence, motion, Variants } from "motion/react";
import { useEffect, useState } from "react";

import { DitheredImage } from "./DitherForm";
import { spinners } from "../utils/loader";

import download from "../assets/pixel_doodles/download.svg";
import err from "../assets/pixel_doodles/crash.svg";
import zip from "../assets/pixel_doodles/zip.svg";
import ProgressBar from "./ProgressBar";

interface DitheredImagesProps {
	ditheredImages: DitheredImage[];
	loading: boolean;
	loadingMessages: string[];
	errorMsg: string;
	progress: number;
}

export default function DitheredImages({
	ditheredImages,
	loading,
	loadingMessages,
	errorMsg,
	progress,
}: DitheredImagesProps) {
	const [ditherBlob, setDitherBlob] = useState<Blob>();
	const [loader, setLoader] = useState<string | string[]>();
	const [loaderFrame, setLoaderFrame] = useState<number>(0);
	const [showZip, setShowZip] = useState(false);
	const [popImages, setPopImages] = useState(false);
	const [popZip, setPopZip] = useState(false);
	const [loadingAnimComplete, setLoadingAnimComplete] = useState(false);

	useEffect(() => {
		if (ditheredImages.length > 0) {
			const zip = JSZip();

			ditheredImages.forEach((image) => {
				zip.file(image.name, image.data);
			});

			zip.generateAsync({ type: "blob" }).then((blob) => {
				setDitherBlob(blob);
			});
		}
	}, [ditheredImages]);

	let intervalId = 0;

	useEffect(() => {
		// initialize loader
		if (loading) setLoader(spinners[Math.floor(Math.random() * spinners.length)]);
		// hide the loading screen after a short delay to let animations show
		else setTimeout(() => setLoadingAnimComplete(true), 500);
	}, [loading]);

	// iterate loader frame every 200ms
	useEffect(() => {
		if (loading && loader) {
			intervalId = window.setInterval(() => {
				setLoaderFrame((prev) => (prev + 1 >= loader.length ? 0 : prev + 1));
			}, 200);
		} else {
			clearInterval(intervalId);
			intervalId = 0;
		}
	}, [loader]);

	const messageAnim: Variants = {
		start: { opacity: 0, scale: 0.75, translateY: "-3rem" },
		end: { opacity: 1, scale: 1, translateY: "0rem" },
		sub: { opacity: 1, scale: 0.75, translateY: "0rem" },
	};

	const loadingAnim: Variants = {
		start: { opacity: 0 },
		end: { opacity: 1 },
		exit: { opacity: 0 },
	};

	return (
		<AnimatePresence mode="wait">
			{loading || !loadingAnimComplete ? (
				//* MARK: LOADING SCREEN
				<motion.div
					className="relative flex flex-col items-center justify-center w-full h-full gap-8 mt-24 animate"
					variants={loadingAnim}
					initial="start"
					animate="end"
					exit="exit"
					id="loading"
					key="loading"
				>
					{loader && (
						<pre
							className="leading-[4.5rem]"
							style={{
								fontSize: loader && typeof loader == "string" ? "7rem" : "4rem",
							}}
						>
							{loader[loaderFrame]}
						</pre>
					)}
					<ProgressBar progress={progress} />
					<div className="relative flex flex-col items-center w-full h-48 gap-4 pt-24 overflow-hidden">
						<AnimatePresence>
							{loadingMessages.map((msg, i) => (
								<motion.h3
									layout="position"
									layoutId={msg + (loadingMessages.length - i)}
									key={msg + (loadingMessages.length - i)}
									className="absolute w-4/5 text-center text-nowrap text-ellipsis text-medium"
									style={{ top: `${i * 1.5 + Math.min(i, 1)}rem` }}
									variants={messageAnim}
									initial="start"
									animate={i === 0 ? "end" : "sub"}
									exit="exit"
									transition={{ duration: 0.5 }}
								>
									{msg}
								</motion.h3>
							))}
						</AnimatePresence>
						<div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-dark to-transparent"></div>
					</div>
					{/* <div className="flex flex-col w-full gap-3">
							{loadingMessages.length > 10 && (
								<motion.span
									initial={{ opacity: 0, translateY: "3rem" }}
									animate={{ opacity: 1, translateY: 0 }}
									className="w-full text-center text-medium"
								>
									sorry it's taking so long! just wait a bit longer...
								</motion.span>
							)}
							{loadingMessages.length > 40 && (
								<motion.span
									initial={{ opacity: 0, translateY: "3rem" }}
									animate={{ opacity: 1, translateY: 0 }}
									className="w-full text-center text-medium"
								>
									okay, now i'm concerned.{" "}
									<a
										className="underline hover:brightness-125 focus:brightness-125 active:brightness-125"
										href="mailto:ameya.gup@proton.me?subject=hither%20and%20dither%20bug!!"
									>
										reach out to me
									</a>{" "}
									to let me know!
								</motion.span>
							)}
						</div> */}
				</motion.div>
			) : ditheredImages.length == 0 && errorMsg.length > 0 ? (
				//* MARK: ERROR SCREEN
				<div key="error" className="flex flex-col items-center justify-center w-4/5 h-3/5">
					<img src={err} className="h-48" alt="" />
					<h2 className="w-full h-16 -mb-3 text-center">error while processing images!</h2>
					<span className="mt-2 leading-9 text-center text-medium">
						try reuploading?
						<br />
						<a
							className="underline focus:brightness-125 active:brightness-125"
							target="_blank"
							rel="noopener noreferrer"
							href="mailto:ameya.gup@proton.me?subject=hither%20and%20dither%20bug!!"
						>
							reach out to me
						</a>{" "}
						if the error's bigger!
					</span>
					<span className="mt-8 text-medium">error: {errorMsg}</span>
				</div>
			) : (
				//* MARK: DOWNLOAD
				<div key="download" className="relative h-64" id="dithered-images">
					{ditherBlob && (
						<div className="flex flex-col z-[9999] items-center justify-center gap-2">
							<div className="relative w-full h-24 -mb-10">
								<AnimatePresence>
									{ditheredImages.map((dImg, i) =>
										popImages ? null : (
											<motion.img
												initial="start"
												animate="end"
												exit="exit"
												key={dImg.name + i}
												variants={{
													start: {
														opacity: 0,
														transformOrigin: "bottom center",
														transform: `translateX(-50%) rotate(${
															(90 / ditheredImages.length) *
															(ditheredImages.length % 2 === 0
																? i - (ditheredImages.length - 1) / 2
																: i - Math.floor(ditheredImages.length / 2))
														}deg) translateY(0rem) scale(0)`,
													},
													end: {
														opacity: 1,
														transform: `translate(-50%, 3rem) rotate(${
															(90 / ditheredImages.length) *
															(ditheredImages.length % 2 === 0
																? i - (ditheredImages.length - 1) / 2
																: i - Math.floor(ditheredImages.length / 2))
														}deg) translate(0, -4rem) scale(1)`,
														transition: { type: "spring", duration: 0.75, delay: i * 0.1 },
													},
													exit: {
														opacity: 1,
														transform: `translate(-50%, 6rem) rotate(0deg) translate(0, -7rem) scale(0)`,
														transition: { type: "spring", duration: 0.75, delay: i * 0.2 },
													},
												}}
												onAnimationStart={(def) => {
													if (def === "exit") setTimeout(() => setPopZip(true), 200 + i * 200);
												}}
												onAnimationComplete={(def) => {
													if (i === ditheredImages.length - 1 && def === "end") setShowZip(true);
													if (i === ditheredImages.length - 1 && def === "exit")
														saveAs(
															ditherBlob,
															`dithered-images-${moment().format("YYYYMMDD-HHmmss")}.zip`,
														);
												}}
												className="absolute z-50 object-cover w-24 h-24 ease-out border-2 shadow-lg cursor-pointer shadow-dark left-1/2 border-medium rounded-xl"
												src={dImg.url}
											></motion.img>
										),
									)}
								</AnimatePresence>
							</div>
							{showZip && (
								<motion.img
									initial="start"
									animate={popZip ? "pop" : "end"}
									variants={{
										start: {
											bottom: 0,
											opacity: 0,
										},
										end: {
											bottom: "6rem",
											opacity: 1,
											transition: {
												duration: 1,
												ease: "anticipate",
											},
										},
										pop: {
											bottom: "6rem",
											opacity: 1,
											scale: 1.1,
											transition: {
												type: "spring",
												bounce: 0.5,
												duration: 0.1,
											},
										},
									}}
									className="absolute w-48 pb-8"
									onAnimationComplete={(def) => {
										if (def === "pop" && popZip) setPopZip(false);
									}}
									src={zip}
									alt="Pixel art of a .zip file icon"
								/>
							)}
							<div className="absolute w-full h-80 bottom-4 bg-gradient-to-b from-transparent to-50% to-dark" />
							<h2 className="h-28 p-4 text-4xl text-center leading-[6rem] mt-12 -mb-7">
								your images are ready!
							</h2>
							<h4 className="mb-4 text-sm pl-36 text-medium">have a splendid day!</h4>
							<button
								id="width"
								onClick={(e) => {
									e.preventDefault();
									setPopImages(true);
								}}
								className="flex flex-row items-center h-16 gap-4 px-4 py-8 border-4 rounded-lg text-light bg-dark border-medium"
							>
								<img src={download} className="h-8" alt="" />
								<span className="mt-2 text-xl">download!</span>
							</button>
						</div>
					)}
				</div>
			)}
		</AnimatePresence>
	);
}
