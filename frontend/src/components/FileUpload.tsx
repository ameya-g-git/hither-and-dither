import { useCallback, useState } from "react";
import clsx from "clsx";

interface FileUploadType {
	onUpload: (file: File) => void;
	className: string;
}

/**
 * Displays a rectangular area that accepts dropping files in, as well as picking a file via your system's default file manager
 * @param onUpload | A handler function to process images that have been uploaded via the component
 * @param className | Additional Tailwind classes to make styling the component easier
 * @returns | The JSX that displays the drag-and-drop uploader
 */

export default function FileUpload({ onUpload, className }: FileUploadType) {
	const [isDraggedOver, setIsDraggedOver] = useState(false);

	// TODO: create a little modal for when the file size is too big, don't push it to imgState either

	const dragAreaStyles = clsx({
		"transition-all z-[999] pointer-events-none visible fixed h-screen w-screen flex flex-col bg-dark/75 backdrop-blur-md items-center justify-center gap-2 border-slate-700":
			true,
		"brightness-75 opacity-100": isDraggedOver,
		"opacity-0": !isDraggedOver,
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
			id="drag-area"
			className={dragAreaStyles}
			onDragEnter={(e) => dragOverHandler(e as unknown as DragEvent)}
			onDragOver={(e) => dragOverHandler(e as unknown as DragEvent)}
			onDragLeave={(e) => dragLeaveHandler(e as unknown as DragEvent)}
			onDrop={(e) => {
				dragLeaveHandler(e as unknown as DragEvent);
				dropHandler(e as unknown as DragEvent);
			}}
		>
			<img alt="upload" className="w-32 -m-4" />
			<span className="flex flex-col items-center gap-8 ">
				<h2 className="text-3xl">let go of your file!</h2>
				<span className="text-sm opacity-50 text-glow">(all will be taken care of)</span>
			</span>
		</div>
	);
}
