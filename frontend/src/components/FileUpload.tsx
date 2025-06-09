import { useCallback, useContext, useEffect, useState } from "react";
import upload from "../assets/img/upload.svg";
import { uploadHandlerType } from "../hooks/useUploadedImages";
import { AnimatePresence, motion, Variant, Variants } from "framer-motion";

interface FileUploadType {
	className?: string;
	onUpload: uploadHandlerType;
	visible?: boolean;
	// isDraggedOver: boolean;
	// setIsDraggedOver: (isDraggedOver: boolean) => void;
}

/**
 * Displays a rectangular area that accepts dropping files in, as well as picking a file via your system's default file manager
 * @param className | Additional Tailwind classes
 * @param onUpload | A handler function to process images that have been uploaded via the component
 * @param visible | Override reactive visibility and just have it constantly visible
 * @returns | The JSX that displays the drag-and-drop uploader
 */

export default function FileUpload({
	className = "",
	onUpload,
}: FileUploadType) {
	const [isDraggedOver, setIsDraggedOver] = useState(false);

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

	// TODO: create a little modal for when the file size is too big, don't push it to imgState either

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
					if (file.size < 25e6) {
						// 25 MB limit, no need to be egregious with it
						onUpload(file); // handle file upload via a handler function prop
					} else {
						alert("file is too big! be nice to the servers!");
						// TODO: replace this with a dom animation, use the X( face like when a tab crashes, shake it left and right
					}
				}
			} else {
				console.error(
					"Error in uploading file, try uploading a file saved on your computer",
				);
			}
		},
		[onUpload],
	);

	const modal: Variants = {
		start: { opacity: 0 },
		end: { opacity: 1 },
		exit: { opacity: 0 },
	};

	const textContainer: Variants = {
		start: {
			opacity: 1,
		},
		end: {
			opacity: 1,
			transition: {
				staggerChildren: 0.25,
			},
		},
	};

	const text: Variants = {
		start: { opacity: 0, translateY: "3rem" },
		end: { opacity: 1, translateY: "0" },
		exit: { opacity: 0, translateY: "3rem" },
	};

	return (
		<div
			className={`${className} absolute h-full w-full z-[999]`}
			id="modal"
			onDragEnter={(e) => dragOverHandler(e as unknown as DragEvent)}
			onDragOver={(e) => dragOverHandler(e as unknown as DragEvent)}
			onDragLeave={(e) => dragLeaveHandler(e as unknown as DragEvent)}
			onDrop={(e) => {
				dragLeaveHandler(e as unknown as DragEvent);
				dropHandler(e as unknown as DragEvent);
			}}
		>
			<AnimatePresence>
				{isDraggedOver && (
					<motion.div
						id="drag-area"
						variants={modal}
						initial="start"
						animate="end"
						exit="exit"
						transition={{ duration: 0.1 }}
						className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 rounded-[2rem] h-[90%] w-full flex flex-col bg-dark/75 backdrop-blur-md items-center justify-center gap-2"
					>
						{/* <img alt="upload" className="w-32 -m-4" /> */}
						<motion.span
							variants={textContainer}
							initial="start"
							animate="end"
							exit="exit"
							className="flex flex-col items-center gap-8 "
						>
							<motion.img
								className="-mb-4"
								variants={text}
								src={upload}
								alt="Upload icon"
							/>
							<motion.h2 variants={text} className="text-3xl">
								let go of your file!
							</motion.h2>
							<motion.span
								variants={text}
								className="text-sm opacity-50 text-medium"
							>
								(all will be taken care of!)
							</motion.span>
						</motion.span>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
