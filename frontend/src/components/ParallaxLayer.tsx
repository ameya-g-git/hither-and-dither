import { ReactNode } from "react";
import { position } from "../hooks/useMousePosition";

interface ParallaxLayerType {
	children: ReactNode;
	mousePosition: position;
	factor: number;
}

export default function ParallaxLayer({ children, mousePosition, factor }: ParallaxLayerType) {
	return (
		<div
			className="absolute flex items-center justify-center w-full h-full overflow-hidden"
			style={{
				transform: `translate(calc(${mousePosition.x * factor}px - 80px), calc(${mousePosition.y * factor}px - 80px)`,
			}}
		>
			{children}
		</div>
	);
}
