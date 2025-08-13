import { ReactNode, useEffect, useState } from "react";
import { motion, Variants } from "motion/react";

import icons from "../assets/pixel_doodles/icons.svg";
import shadow from "../assets/img/shadow.webp";

interface WindowImageProps {
	x?: number;
	y?: number;
	className: string;
	title: string;
	height: string;
	children: ReactNode;
	onClick?: () => void;
	exit?: string;
}

export default function WindowImage({
	x,
	y,
	className,
	title,
	height,
	children,
	onClick,
	exit = "exit",
}: WindowImageProps) {
	const [loaded, setLoaded] = useState(false);

	const windowVar: Variants = {
		start: { height: "10%" },
		end: { height: height },
		exit: { height: "10%", opacity: 0 },
	};

	useEffect(() => {});

	return (
		<motion.div
			key={title}
			variants={windowVar}
			animate="end"
			exit={exit}
			transition={{
				delay: 0.5,
				ease: "easeInOut",
				duration: 0.5,
			}}
			onClick={onClick}
			className={`${className} absolute h-[12%] flex justify-center`}
			style={{
				transform: `translate(${x}vw, ${y}vh)`,
			}}
			onAnimationComplete={() => setLoaded(true)}
		>
			<div className="box-border absolute flex flex-row w-11/12 h-6 overflow-hidden -bottom-4">
				<img src={shadow} className="h-full" alt="" />
				<img src={shadow} className="h-full" alt="" />
			</div>
			<div className="relative flex flex-col w-full h-full gap-2 px-3 py-2 border-[6px] text-dark bg-medium border-dark ">
				<div className="flex flex-row items-center justify-between w-full h-12">
					<h3 title={title} className="pt-3 overflow-hidden text-nowrap text-ellipsis">
						{title}
					</h3>
					<img className="h-8" src={icons} alt="" />
				</div>
				<div className="h-[calc(100%-3rem)] w-full border-4 overflow-clip border-dark">
					<div
						className="w-full h-full transition-opacity duration-500"
						style={{ opacity: loaded ? 100 : 0 }}
					>
						{children}
					</div>
				</div>
			</div>
		</motion.div>
	);
}
