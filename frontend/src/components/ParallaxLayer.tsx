import { ReactNode, useContext } from "react";
import useMousePosition from "../hooks/useMousePosition";

interface ParallaxLayerType {
	children: ReactNode;
	factor: number;
}

export default function ParallaxLayer({ children, factor }: ParallaxLayerType) {
	// const mousePosition = useMousePosition();

	return (
		<div
			className="absolute flex items-center justify-center w-full h-full"
			// style={{
			// 	transform: `translate(calc(${mousePosition.x * factor}px - 80px), calc(${mousePosition.y * factor}px - 80px)`,
			// }}
		>
			{children}
		</div>
	);
}
