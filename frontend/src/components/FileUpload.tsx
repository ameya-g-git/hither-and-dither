import { useCallback, useContext, useEffect, useState } from "react";
import clsx from "clsx";
import { MousePosition, ScreenSize } from "../App";

interface FileUploadType {
	onUpload: (file: File) => void;
	// isDraggedOver: boolean;
	// setIsDraggedOver: (isDraggedOver: boolean) => void;
}

/**
 * Displays a rectangular area that accepts dropping files in, as well as picking a file via your system's default file manager
 * @param onUpload | A handler function to process images that have been uploaded via the component
 * @param isDraggedOver | Controls visibility if the component is being dragged over, aids in animation
 * @param setIsDraggedOver | Visibility toggle function
 * @returns | The JSX that displays the drag-and-drop uploader
 */

export default function FileUpload({ onUpload }: FileUploadType) {
	const mousePosition = useContext(MousePosition);
	const { screenWidth, screenHeight } = useContext(ScreenSize);
	const [isDraggedOver, setIsDraggedOver] = useState(false);

	const screenPadding = 10;

	// useEffect(() => {
	// 	if (
	// 		mousePosition.x < screenPadding ||
	// 		mousePosition.x > screenWidth - screenPadding ||
	// 		mousePosition.y < screenPadding ||
	// 		mousePosition.y > screenHeight - screenPadding
	// 	) {
	// 		setIsDraggedOver(false);
	// 	}
	// }, [mousePosition, screenHeight, screenWidth]);

	// TODO: use the `isDraggedOver` prop to do a framer motion animation
	// TODO: create a little modal for when the file size is too big, don't push it to imgState either

	const dragAreaStyles = clsx({
		"transition-all isDraggedOver fixed h-full w-full flex flex-col bg-dark/75 backdrop-blur-md items-center justify-center gap-2 border-slate-700":
			true,
		"brightness-75 opacity-100 ": isDraggedOver,
		"opacity-100": !isDraggedOver,
	});

	function dragOverHandler(e: DragEvent) {
		e.preventDefault();
		e.stopPropagation();
		setIsDraggedOver(true);
	}

	function dragLeaveHandler(e: DragEvent) {
		e.preventDefault();
		e.stopPropagation();
		setIsDraggedOver(false);
	}

	const dropHandler = useCallback(
		(e: DragEvent) => {
			e.preventDefault();
			e.stopPropagation();
			const dt = e.dataTransfer;
			const files = dt!.files; // get files from drag event
			if (files.length > 0) {
				for (const file of files) {
					if (true) {
						// TODO: ADD FILE SIZE LIMIT, THE CODE IS HERE JUST ADD SOME ARBITRARY LIMIT
						onUpload(file); // handle file upload via a handler function prop
					}
				}
			} else {
				console.error("Error in uploading file, try uploading a file saved on your computer");
			}
		},
		[onUpload]
	);

	return (
		<div
			className="absolute w-screen h-screen"
			id="modal"
			onDragEnter={(e) => dragOverHandler(e as unknown as DragEvent)}
			onDragOver={(e) => dragOverHandler(e as unknown as DragEvent)}
			onDragLeave={(e) => dragLeaveHandler(e as unknown as DragEvent)}
			onDrop={(e) => {
				dragLeaveHandler(e as unknown as DragEvent);
				dropHandler(e as unknown as DragEvent);
			}}
		>
			{isDraggedOver && (
				<div id="drag-area" className={dragAreaStyles}>
					{/* <img alt="upload" className="w-32 -m-4" /> */}
					<span className="flex flex-col items-center gap-8 ">
						<h2 className="text-3xl">let go of your file!</h2>
						<span className="text-sm opacity-50 text-glow">(all will be taken care of!)</span>
					</span>
				</div>
			)}
		</div>
	);
}
