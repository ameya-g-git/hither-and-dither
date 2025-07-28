import { useEffect, useMemo, useRef, useState } from "react";
import { UploadedImage } from "../hooks/useUploadedImages";

interface CanvasProps {
	img: UploadedImage;
	draw: (
		canvas: HTMLCanvasElement,
		context: CanvasRenderingContext2D,
		canvasImage: HTMLImageElement,
	) => void;
	className: string;
}

export default function Canvas({ img, draw, className }: CanvasProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const canvasImage = useMemo(() => new Image(), []);
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		if (!canvasImage.src) {
			canvasImage.src = img.src;
			canvasImage.addEventListener("load", () => {
				setTimeout(() => {
					// slight timeout to ensure canvasref is defined before drawing
					setLoaded(true);
				}, 100);
			});
		}
	}, [img.src]);

	useEffect(() => {
		if (canvasRef && canvasRef.current) {
			const canvas = canvasRef.current;
			canvas.width = canvas.clientWidth;
			canvas.height = canvas.clientHeight > 0 ? canvas.clientHeight : canvas.clientWidth;

			const context = canvas.getContext("2d");
			if (context && canvasImage) {
				draw(canvas, context, canvasImage);
			}
		}
	}, [img, loaded, canvasRef]);

	return <canvas className={className} ref={canvasRef} />;
}
