import { uploadHandlerType } from "../hooks/useUploadedImages";

interface UploadButtonProps {
	onUpload: uploadHandlerType;
}

// TODO: this shadow ugly please change it

export default function UploadButton({ onUpload }: UploadButtonProps) {
	return (
		<div className="fixed rounded-xl transition-all shadow-medium/50 shadow-lg hover:shadow-2xl hover:shadow-medium pixel-corners-button--wrapper pixel-corners-button z-[999] w-24 h-24 bottom-8 right-8 bg-dark border-[6px] border-medium">
			<input
				type="file"
				id="fileElem"
				multiple
				accept="image/*"
				hidden
				onChange={(e) => {
					if (e.target.files && e.target.files.length > 0) {
						for (const file of e.target.files) {
							if (file.size < 25e6) {
								// 25 MB limit, no need to be egregious with it
								onUpload(file); // handle file upload via a handler function prop
							} else {
								alert("file is too big! be nice to the servers!");
							}
						}
					}
				}}
			/>
			<label
				htmlFor="fileElem"
				className="flex items-center justify-center w-full h-full pt-4 text-3xl cursor-pointer text-glow"
			>
				+
			</label>
		</div>
	);
}
