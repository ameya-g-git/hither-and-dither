import icons from "../assets/pixel_doodles/icons.svg";
import shadow from "../assets/img/bayershadow.webp";
import { ReactNode, useState } from "react";
import { motion, Variants } from "motion/react";

interface WindowImageProps {
	x?: number;
	y?: number;
	className: string;
	title: string;
	height: string;
	children: ReactNode;
	onClick?: () => void;
}

export default function WindowImage({
	x,
	y,
	className,
	title,
	height,
	children,
	onClick,
}: WindowImageProps) {
	const [loaded, setLoaded] = useState(false);

	const windowVar: Variants = {
		start: { height: "8%" },
		end: { height: height },
	};

	return (
		<motion.div
			variants={windowVar}
			initial={loaded ? "end" : "start"}
			animate="end"
			transition={{
				delay: 0.5,
				ease: "easeInOut",
				duration: 0.5,
			}}
			onClick={onClick}
			className={`${className} absolute flex justify-center`}
			style={{
				transform: `translate(${x}vw, ${y}vh)`,
			}}
			onAnimationComplete={() => {
				setLoaded(true);
			}}
		>
			<div className="box-border absolute flex flex-row w-11/12 h-48 overflow-hidden -bottom-4">
				<img src={shadow} className="h-full" alt="" />
				<img src={shadow} className="h-full" alt="" />
			</div>
			<div className="flex flex-col w-full h-full gap-2 px-3 py-2 border-[6px] text-dark bg-medium border-dark overflow-clip">
				<div className="flex flex-row items-center justify-between w-full">
					<h3
						title={title}
						className="pt-3 overflow-hidden text-nowrap text-ellipsis"
					>
						{title}
					</h3>
					<img className="w-48 h-8" src={icons} alt="" />
				</div>
				<div
					className="w-full h-full transition-opacity border-4 border-dark"
					style={{ opacity: loaded ? 100 : 0 }}
				>
					{children}
				</div>
			</div>
		</motion.div>
	);
}
