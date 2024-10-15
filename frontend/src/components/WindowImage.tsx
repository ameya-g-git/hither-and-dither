import icons from "../assets/pixel_doodles/icons.svg";
import shadow from "../assets/img/bayershadow.webp";

interface WindowImageProps {
	x?: number;
	y?: number;
	className: string;
	img: string;
	title: string;
}

export default function WindowImage({ x, y, className, img, title }: WindowImageProps) {
	return (
		<div
			className={`${className} absolute flex justify-center`}
			style={{
				transform: `translate(${x}%, ${y}%)`,
			}}
		>
			<div className="box-border absolute flex flex-row w-11/12 h-48 overflow-hidden -bottom-4">
				<img src={shadow} className="h-full" alt="" />
				<img src={shadow} className="h-full" alt="" />
			</div>
			<div className="flex flex-col w-full h-full gap-2 px-3 py-2 border-8 text-dark bg-medium border-dark overflow-clip">
				<div className="flex flex-row items-center justify-between w-full">
					<h3 className="pt-3">{title}</h3>
					<img className="h-8" src={icons} alt="" />
				</div>
				<img className="object-cover h-full overflow-hidden border-4 border-box border-dark" src={img} alt="" />
			</div>
		</div>
	);
}
