import wave from "./assets/pixel_doodles/wave.svg";
import ScrollingImage from "./components/ScrollingImage";

export default function App() {
	const waveElements = (n: number) => {
		return Array(n)
			.fill("")
			.map((_, i) => (
				<ScrollingImage ltr={false} width="w-10">
					<img key={i} className="w-12 -mr-2" src={wave} />
				</ScrollingImage>
			));
	};

	return (
		<>
			<div className="flex items-center w-screen h-screen">
				<div id="hero-text">
					<h1 className="">
						hither <br /> & dither
					</h1>
					<div className="flex flex-row w-full *:-mr-1.5">
						{waveElements(1)}
					</div>
				</div>
			</div>
		</>
	);
}
