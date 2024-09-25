import { ReactNode, useContext } from "react";
import { MousePosition } from "../App";

interface ParallaxLayerType {
	children: ReactNode;
	factor: number;
}

export default function ParallaxLayer({ children, factor }: ParallaxLayerType) {
	const mousePosition = useContext(MousePosition);

	return (
		<div
			className="absolute flex items-center justify-center w-full h-full"
			style={{
				transform: `translate(calc(${mousePosition.x * factor}px - 80px), calc(${mousePosition.y * factor}px - 80px)`,
			}}
		>
			{children}
		</div>
	);
}
