import wave from "./assets/pixel_doodles/wave.svg";
import ScrollingImage from "./components/ScrollingImage";

export default function App() {
	const waveElements = (n: number) => {
		return Array(n)
			.fill("")
			.map((_, i) => (
				<ScrollingImage ltr={false} width="w-12">
					<img key={i} className="-mr-[0.01rem]" src={wave} />
				</ScrollingImage>
			));
	};

	return (
		<>
			<div className="flex items-center w-screen h-screen crt-flicker crt-colorsep">
				<div id="hero-text">
					<h1>
						hither <br /> & dither
					</h1>
					<div
						id="wave"
						className="flex flex-row w-full drop-shadow-lg shadow-light"
					>
						{waveElements(12)}
					</div>
					<span className="inline-flex items-end gap-2">
						<h2 className="h-[3.5rem] mt-6">pursue your pixelated dreams...</h2>
						<h3 className="mb-2">(click to begin!)</h3>
					</span>
				</div>
				<div className="absolute"></div>
			</div>
		</>
	);
}
