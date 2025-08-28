import { motion } from "motion/react";

interface ProgressBarProps {
	progress: number;
}

export default function ProgressBar({ progress }: ProgressBarProps) {
	return (
		<div className="h-20 p-2 border-8 w-96 rounded-3xl border-medium">
			<div className="h-full overflow-hidden rounded-lg">
				<motion.div
					layout="size"
					className="h-full rounded-lg bg-medium"
					transition={{ duration: 0.2, ease: "easeOut" }}
					style={{ width: `${progress}%` }}
				></motion.div>
			</div>
		</div>
	);
}
