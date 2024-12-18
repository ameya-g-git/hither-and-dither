import icons from "../assets/pixel_doodles/icons.svg";
import shadow from "../assets/img/bayershadow.webp";
import { ReactNode } from "react";

interface WindowImageProps {
	x?: number;
	y?: number;
	className: string;
	title: string;
	children: ReactNode;
}

export default function WindowImage({ x, y, className, title, children }: WindowImageProps) {
	return (
		<div
			className={`${className} absolute flex justify-center`}
			style={{
				transform: `translate(${x}vw, ${y}vh)`,
			}}
		>
			<div className="box-border absolute flex flex-row w-11/12 h-48 overflow-hidden -bottom-4">
				<img src={shadow} className="h-full" alt="" />
				<img src={shadow} className="h-full" alt="" />
			</div>
			<div className="flex flex-col w-full h-full gap-2 px-3 py-2 border-[6px] text-dark bg-medium border-dark overflow-clip">
				<div className="flex flex-row items-center justify-between w-full">
					<h3 className="pt-3">{title.length > 12 ? title.slice(0, 12) + "..." : title}</h3>
					<img className="h-8" src={icons} alt="" />
				</div>
				{children}
			</div>
		</div>
	);
}
