import { img } from "motion/react-client";
import { useEffect, useMemo, useRef, useState } from "react";
import { windowImageStyles } from "../App";
import { UploadedImage } from "../hooks/useUploadedImages";

interface CanvasProps {
	img: UploadedImage;
	draw: (
		canvas: HTMLCanvasElement,
		context: CanvasRenderingContext2D,
		canvasImage: HTMLImageElement,
	) => void;
}

export default function Canvas({ img, draw }: CanvasProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const canvasImage = useMemo(() => new Image(), []);
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		if (!canvasImage.src) {
			canvasImage.src = img.src;
		}
		setTimeout(() => {
			// slight timeout to ensure canvasref is defined before drawing
			setLoaded(true);
		}, 100);
	}, [img.src]);

	useEffect(() => {
		if (canvasRef && canvasRef.current) {
			const canvas = canvasRef.current;
			const context = canvas.getContext("2d");
			if (context && canvasImage) {
				draw(canvas, context, canvasImage);
			}
		}
	}, [img, loaded, canvasRef]);

	return <canvas className={windowImageStyles} ref={canvasRef} />;
}
