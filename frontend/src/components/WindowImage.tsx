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
		<div className={className}>
			<img src={shadow} className="absolute h-48 px-4 overflow-hidden -bottom-6" alt="" />
			<div className="flex flex-col w-full h-full gap-2 px-3 py-2 border-8 text-dark bg-medium border-dark overflow-clip">
				<div className="flex flex-row items-center justify-between w-full">
					<h4>{title}</h4>
					<img className="h-8 " src={icons} alt="" />
				</div>
				<img className="object-cover h-full overflow-hidden" src={img} alt="" />
			</div>
		</div>
	);
}
