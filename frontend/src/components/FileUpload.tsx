import { useCallback, useState } from "react";
import clsx from "clsx";
import { AnimatePresence, motion, Variants } from "framer-motion";

import { uploadHandlerType } from "../hooks/useUploadedImages";
import upload from "../assets/pixel_doodles/upload.svg";
import crash from "../assets/pixel_doodles/crash.svg";

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

export default function FileUpload({ className = "", onUpload }: FileUploadType) {
	const [isDraggedOver, setIsDraggedOver] = useState(false);
	const [isClicked, setIsClicked] = useState(false);
	const [showCrashModal, setShowCrashModal] = useState(false);

	const inputClasses = clsx(
		"mt-0.5 w-[calc(100%-1rem)] h-[calc(100%-1rem)] transition-all rounded-[4.5rem] rounded-tl-none",
	);

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
						// alert("file is too big! be nice to the servers!");
						setShowCrashModal(true);
					}
				}
			} else {
				console.error("Error in uploading file, try uploading a file saved on your computer");
			}
		},
		[onUpload],
	);

	const modal: Variants = {
		start: { opacity: 0 },
		end: {
			opacity: 1,
			transition: {
				staggerChildren: 0.25,
			},
		},
		exit: { opacity: 0 },
	};

	const text: Variants = {
		start: { opacity: 0, translateY: "3rem" },
		end: { opacity: 1, translateY: "0" },
		exit: { opacity: 0, translateY: "3rem" },
	};

	const shake: Variants = {
		start: { x: "4rem" },
		end: {
			x: 0,
			transition: {
				type: "spring",
				stiffness: 500,
				mass: 1,
				damping: 7.5,
			},
		},
	};

	return (
		<div
			className={`${className} absolute flex items-center justify-center w-full z-50`}
			id="modal"
			onDragEnter={(e) => dragOverHandler(e as unknown as DragEvent)}
			onDragOver={(e) => dragOverHandler(e as unknown as DragEvent)}
			onDragLeave={(e) => dragLeaveHandler(e as unknown as DragEvent)}
			onDrop={(e) => {
				dragLeaveHandler(e as unknown as DragEvent);
				dropHandler(e as unknown as DragEvent);
			}}
		>
			<label
				onClick={(e) => e.stopPropagation()}
				htmlFor="fileElem"
				className={`font-normal text-center bg-dark ${inputClasses}`}
			>
				<div
					className={`flex flex-col items-center justify-center w-full h-full gap-4 transition-all select-none ${isClicked ? "scale-90" : "scale-100"} `}
				>
					<img className="w-48" src={upload} alt="Upload icon" />
					<h2 className="w-full h-16 text-center">no images have been uploaded!</h2>
					<span className="inline-flex gap-2 text-center text-medium">
						feel free to drag n' drop or click here to add images!
					</span>
				</div>
			</label>
			~
			<input
				type="file"
				id="fileElem"
				key={"fileElem"}
				name="fileElem"
				onMouseLeave={() => setIsClicked(false)}
				onMouseDown={() => setIsClicked(true)}
				onMouseUp={() => setIsClicked(false)}
				className={`absolute top-1/2 left-1/2 hover:backdrop-brightness-125 cursor-pointer text-transparent -translate-x-1/2 -translate-y-1/2 ${inputClasses}`}
				multiple
				accept="image/*"
				onChange={(e) => {
					if (e.target.files && e.target.files.length > 0) {
						for (const file of e.target.files) {
							if (file.size < 25e6) {
								// 25 MB limit, no need to be egregious with it
								onUpload(file); // handle file upload via a handler function prop
							} else {
								setShowCrashModal(true);
							}
						}
					}
				}}
			/>
			<AnimatePresence>
				{isDraggedOver && (
					<motion.div
						id="drag-area"
						variants={modal}
						initial="start"
						animate="end"
						exit="exit"
						transition={{ duration: 0.1 }}
						className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 rounded-[2rem] h-[90%] w-full flex flex-col bg-dark/75 backdrop-blur-md items-center justify-center gap-8"
					>
						<motion.img className="w-24 -mb-4" variants={text} src={upload} alt="Upload icon" />
						<motion.h2 variants={text} className="w-full h-20 -mb-6 text-3xl text-center">
							let go of your file!
						</motion.h2>
						<motion.span variants={text} className="text-sm opacity-50 text-medium">
							(all will be taken care of!)
						</motion.span>
					</motion.div>
				)}

				{showCrashModal && (
					<motion.div
						key="crash-modal"
						id="file-reject"
						className="absolute flex flex-col items-center justify-center w-full gap-2 -translate-x-1/2 -translate-y-1/2 bg-dark/75 backdrop-blur-md h-5/6 top-1/2 left-1/2 "
						variants={modal}
						initial="start"
						animate="end"
						exit="exit"
					>
						<motion.img
							className="-mb-2"
							variants={shake}
							onAnimationComplete={() => setShowCrashModal(false)}
							src={crash}
							alt="Upload icon"
						/>
						<h2 className="w-full h-20 text-3xl text-center -mb-7">file too large!</h2>
						<span className="mb-8 mr-16 text-xs text-center text-medium/75">
							be nice to the servers!
						</span>
						<span className="text-xs text-center text-medium/75">
							<small>(and my wallet)</small>
						</span>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
