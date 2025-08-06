import saveAs from "file-saver";
import JSZip from "jszip";
import moment from "moment";
import { AnimatePresence, motion, stagger, Variants } from "motion/react";
import { useEffect, useState } from "react";

import { DitheredImage } from "./DitherForm";
import { spinners, loadingMessages } from "../utils/loader";

import grad from "../assets/img/gradient.png";
import download from "../assets/pixel_doodles/download.svg";
import err from "../assets/pixel_doodles/crash.svg";
import zip from "../assets/pixel_doodles/zip.svg";

interface DitheredImagesProps {
	ditheredImages: DitheredImage[];
	loading: boolean;
	errorMsg: string;
}

export default function DitheredImages({ ditheredImages, loading, errorMsg }: DitheredImagesProps) {
	const [ditherBlob, setDitherBlob] = useState<Blob>();
	const [loader, setLoader] = useState<string | string[]>();
	const [loaderFrame, setLoaderFrame] = useState<number>(0);
	const [loaderMessages, setLoaderMessages] = useState<string[]>([]);
	const [showZip, setShowZip] = useState(false);
	const [popImages, setPopImages] = useState(false);
	const [popZip, setPopZip] = useState(false);

	/**
	 * Converts a data URL to a UInt8Array for ease of downloading via JSZip
	 * @param data | data URL of a file
	 * @returns {Uint8Array} | UInt8Array encoded version of the data URL
	 */
	function dataURLtoUint8Array(data: string): Uint8Array {
		const base64 = data.split(",")[1];
		const binaryString = atob(base64);
		const len = binaryString.length;
		const bytes = new Uint8Array(len);

		for (let i = 0; i < len; i++) {
			bytes[i] = binaryString.charCodeAt(i);
		}

		return bytes;
	}

	useEffect(() => {
		if (ditheredImages.length > 0) {
			const zip = JSZip();

			for (const image of ditheredImages) {
				const binaryData = dataURLtoUint8Array(image.data);
				zip.file(`${image.name}.png`, binaryData);
			}

			zip.generateAsync({ type: "blob" }).then((blob) => {
				setDitherBlob(blob);
			});
		}
	}, [ditheredImages]);

	let intervalId: number = 0;
	let messageId = 0;

	useEffect(() => {
		if (loading) {
			setLoader(spinners[Math.floor(Math.random() * spinners.length)]);
			setLoaderMessages([loadingMessages[Math.floor(Math.random() * loadingMessages.length)]]);
		}
	}, [loading]);

	useEffect(() => {
		if (loading && loader) {
			intervalId = setInterval(() => {
				setLoaderFrame((prev) => (prev + 1 >= loader.length ? 0 : prev + 1));
			}, 200);
			messageId = setInterval(() => {
				setLoaderMessages((prev) => [
					loading ? loadingMessages[Math.floor(Math.random() * loadingMessages.length)] : "",
					...prev,
				]);
			}, 2048);
		} else {
			clearInterval(intervalId);
			clearInterval(messageId);
			intervalId = 0;
			messageId = 0;
		}
	}, [loader]);

	const messageAnim: Variants = {
		start: { opacity: 0, scale: 0.75, translateY: "-3rem" },
		end: { opacity: 1, scale: 1, translateY: "0rem" },
		sub: { opacity: 1, scale: 0.75, translateY: "0rem" },
	};

	return loading ? (
		<div
			className="relative flex flex-col items-center justify-center w-full h-full gap-8 mt-24 animate"
			id="loading"
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
			<div className="relative flex flex-col w-full h-48 gap-4 pt-24 overflow-hidden">
				<AnimatePresence>
					{loaderMessages.map((msg, i) => (
						// TODO: add a little disclaimer message if the length of loaderMessages is too long
						<motion.h3
							layout="position"
							layoutId={msg + (i - loaderMessages.length + 1)}
							key={msg + (i - loaderMessages.length + 1)}
							className="absolute w-full text-center text-medium"
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
			</div>
			<div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-dark to-transparent"></div>
		</div>
	) : ditheredImages.length == 0 && errorMsg.length > 0 ? (
		<div className="flex flex-col items-center justify-center w-4/5 h-3/5">
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
		<div className="relative h-64" id="dithered-images">
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
										}}
										className="absolute z-50 object-cover w-24 h-24 ease-out border-2 shadow-lg cursor-pointer shadow-dark left-1/2 border-medium rounded-xl"
										src={dImg.data}
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
								if (!popImages) setTimeout(() => setPopImages(true), 250);
								if (def === "pop" && popZip) setPopZip(false);
							}}
							src={zip}
							alt=""
						/>
					)}
					<div className="absolute w-full h-80 bottom-4 bg-gradient-to-b from-transparent to-50% to-dark" />
					<h2 className="h-28 p-4 text-4xl text-center leading-[6rem] mt-12 -mb-7">
						your images are ready!
					</h2>
					<h4 className="mb-4 text-sm opacity-50 pl-36 text-medium">have a splendid day!</h4>
					<button
						id="width"
						onClick={(e) => {
							e.preventDefault();
							saveAs(ditherBlob, `dithered-images-${moment().format("YYYYMMDD-HHmmss")}.zip`);
						}}
						className="flex flex-row items-center h-16 gap-4 px-4 py-8 border-4 rounded-lg text-light bg-dark border-medium"
					>
						<img src={download} className="h-8" alt="" />
						<span className="mt-2 text-xl">download!</span>
					</button>
				</div>
			)}
		</div>
	);
}
