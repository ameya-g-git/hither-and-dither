import { uploadHandlerType } from "../hooks/useUploadedImages";

interface UploadButtonProps {
	onUpload: uploadHandlerType;
}

export default function UploadButton({ onUpload }: UploadButtonProps) {
	return (
		<div className="fixed rounded-xl transition-all shadow-medium/50 shadow-lg hover:shadow-2xl hover:shadow-medium pixel-corners-button--wrapper pixel-corners-button z-[999] w-24 h-24 bottom-8 right-8 bg-dark border-8 border-medium">
			<input
				type="file"
				id="fileElem"
				multiple
				accept="image/*"
				hidden
				onChange={(e) => {
					if (e.target.files && e.target.files.length > 0) {
						for (const file of e.target.files) {
							if (true) {
								// TODO: ADD FILE SIZE LIMIT, THE CODE IS HERE JUST ADD SOME ARBITRARY LIMIT
								onUpload(file); // handle file upload via a handler function prop
							}
						}
					}
				}}
			/>
			<label
				htmlFor="fileElem"
				className="text-3xl pt-4 flex text-glow items-center justify-center w-full h-full cursor-pointer"
			>
				+
			</label>
		</div>
	);
}
