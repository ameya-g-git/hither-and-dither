import saveAs from "file-saver";
import { useEffect, useState } from "react";
import { DitheredImage } from "./DitherForm";
import JSZip from "jszip";
import moment from "moment";
import { spinners, loadingMessages } from "../utils/loader";

import download from "../assets/img/download.svg";
import { AnimatePresence, motion, Variants } from "framer-motion";
import clsx from "clsx";

interface DitheredImagesProps {
	ditheredImages: DitheredImage[];
	loading: boolean;
}

export default function DitheredImages({
	ditheredImages,
	loading,
}: DitheredImagesProps) {
	const [ditherBlob, setDitherBlob] = useState<Blob>();
	const [loader, setLoader] = useState<string | string[]>();
	const [loaderFrame, setLoaderFrame] = useState<number>(0);
	const [loaderMessage, setLoaderMessage] = useState("");

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
		setLoader(
			loading ? spinners[Math.floor(Math.random() * spinners.length)] : "",
		);
		setLoaderMessage(
			loading
				? loadingMessages[Math.floor(Math.random() * loadingMessages.length)]
				: "",
		);
	}, [loading]);

	useEffect(() => {
		if (loading && loader) {
			intervalId = setInterval(() => {
				setLoaderFrame((prev) => (prev + 1 >= loader.length ? 0 : prev + 1));
			}, 200);
			messageId = setInterval(() => {
				setLoaderMessage(
					loading
						? loadingMessages[
								Math.floor(Math.random() * loadingMessages.length)
							]
						: "",
				);
			}, 4096);
		} else {
			clearInterval(intervalId);
			clearInterval(messageId);
			intervalId = 0;
			messageId = 0;
		}
	}, [loader]);

	const messageAnim: Variants = {
		start: { opacity: 0, scale: 0.75, translateX: "6rem" },
		end: { opacity: 1, scale: 1, translateX: "0rem" },
		exit: { opacity: 0, scale: 0.75, translateX: "-6rem" },
	};

	// TODO: fix up interface for downloading images
	// TODO: add subtle animations and stuff   hooray we're basically at the polishing up phase

	return loading ? (
		<div
			className="relative flex flex-col items-center justify-center w-full gap-4"
			id="loading"
		>
			{loader && (
				<pre
					className="absolute -translate-x-1/2 left-1/2"
					style={{
						fontSize: loader && typeof loader == "string" ? "7rem" : "5rem",
					}}
				>
					{loader[loaderFrame]}
				</pre>
			)}
			<AnimatePresence>
				<motion.h3
					className="absolute w-full text-center text-medium top-16"
					key={loaderMessage}
					variants={messageAnim}
					initial="start"
					animate="end"
					exit="exit"
					transition={{ duration: 1 }}
				>
					{loaderMessage}
				</motion.h3>
			</AnimatePresence>
		</div>
	) : (
		<div className="relative h-64 " id="dithered-images">
			{ditherBlob && (
				<div className="flex flex-col z-[9999] items-center gap-2">
					<div className="relative w-full h-24 -mb-10">
						{ditheredImages.map((dImg, i) => (
							<img
								key={i}
								className="absolute z-[9999] object-cover w-24 h-24 transition-all ease-in-out border-2 cursor-pointer top-1/2 left-1/2 border-medium/50 rounded-xl shadow-medium"
								style={{
									transform: `translateX(-50%) rotate(${
										25 *
										(ditheredImages.length % 2 === 0
											? i - (ditheredImages.length - 1) / 2
											: i - Math.floor(ditheredImages.length / 2))
									}deg) translateY(-7rem)`,
									zIndex: 100 + i,
								}}
								src={dImg.data}
							></img>
						))}
					</div>
					<h2 className="h-28 p-4 text-4xl text-center leading-[6rem] -mb-7">
						your images are ready!
					</h2>
					<h4 className="mb-4 text-sm opacity-50 pl-36 text-medium">
						have a splendid day!
					</h4>
					<button
						id="width"
						onClick={(e) => {
							e.preventDefault();
							saveAs(
								ditherBlob,
								`dithered-images-${moment().format("YYYYMMDD-HHmmss")}.zip`,
							);
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
