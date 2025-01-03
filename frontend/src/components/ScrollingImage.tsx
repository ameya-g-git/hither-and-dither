import clsx from "clsx";
import { ReactNode } from "react";
interface props {
	ltr: boolean;
	width: string;
	children: ReactNode;
}

export default function ScrollingImage({ ltr, width, children }: props) {
	const containerStyles = clsx(`flex items-center h-full ${width} overflow-hidden ${ltr ? "" : "-scale-x-100"}`);

	const imageStyles = clsx(`flex flex-row last:m-0 justify-end animate-infinite-scroll`);

	return (
		<div role="presentation" className={containerStyles}>
			<div className={imageStyles}>
				{children}
				{children}
			</div>
		</div>
	);
}
