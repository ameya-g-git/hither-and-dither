import saveAs from "file-saver";
import { useEffect, useState } from "react";
import { DitheredImage } from "./DitherForm";
import JSZip from "jszip";
import moment from "moment";

import download from "../assets/img/download.svg";

interface DitheredImagesProps {
	ditheredImages: DitheredImage[];
	loading: boolean;
}

export default function DitheredImages({ ditheredImages, loading }: DitheredImagesProps) {
	const [ditherBlob, setDitherBlob] = useState<Blob>();

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

			// TODO: work on download interface

			zip.generateAsync({ type: "blob" }).then((blob) => {
				setDitherBlob(blob);
			});
		}
	}, [ditheredImages]);

	// TODO: fix up interface for downloading images
	// TODO: add subtle animations and stuff   hooray we're basically at the polishing up phase

	return loading ? (
		<img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fc.tenor.com%2FGw-jI11oSC8AAAAC%2Floading-now-loading.gif&f=1&nofb=1&ipt=5c3d4012a11463564c7534d1376fd80bfddd20ce2ba945615b8e35f04264226a&ipo=images"></img>
	) : (
		<div id="dithered-images">
			{ditherBlob && (
				<div className="flex flex-col items-center gap-2">
					{ditheredImages.map((dImg) => (
						<img className="absolute w-24 h-24" src={dImg.data}></img>
					))}
					<h2 className="text-4xl">your images are ready!</h2>
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
