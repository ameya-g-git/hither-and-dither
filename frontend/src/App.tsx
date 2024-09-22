import wave from "./assets/pixel_doodles/wave.svg";
import back_layer from "./assets/pixel_doodles/back_layer.svg";
import mid_layer from "./assets/pixel_doodles/mid_layer.svg";
import top_layer from "./assets/pixel_doodles/top_layer.svg";
import bayer from "./assets/img/bayerpattern.png";

import ScrollingImage from "./components/ScrollingImage";
import useMousePosition from "./hooks/useMousePosition";
import ParallaxLayer from "./components/ParallaxLayer";

// TODO: re-export the parallax layers so opacity doesn't need to be altered

export default function App() {
	const mousePosition = useMousePosition();

	const waveElements = (n: number) => {
		return Array(n)
			.fill("")
			.map((_, i) => (
				<ScrollingImage key={i} ltr={false} width="w-12">
					<img className="-mr-[0.01rem]" src={wave} />
				</ScrollingImage>
			));
	};

	return (
		<>
			<div className="box-border flex items-center w-full h-screen pl-16 crt-flicker crt-colorsep">
				<div
					id="bayer"
					className="absolute left-0 flex flex-row items-center justify-between w-full -top-96 animate-float -z-[99] opacity-25"
				>
					<img src={bayer} />
					<img src={bayer} />
					<img src={bayer} />
				</div>
				<div className="absolute flex items-center justify-center w-full h-full pt-16 pointer-events-none select-none">
					<ParallaxLayer mousePosition={mousePosition} factor={0.01}>
						<img src={back_layer} className="mt-16 opacity-50 h-5/6" alt="" />
					</ParallaxLayer>
					<ParallaxLayer mousePosition={mousePosition} factor={0.03}>
						<img src={mid_layer} className="h-5/6 opacity-60 ml-96" alt="" />
					</ParallaxLayer>
					<ParallaxLayer mousePosition={mousePosition} factor={0.05}>
						<img src={top_layer} className="h-4/6" alt="" />
					</ParallaxLayer>
				</div>
				<div className="ml-4" id="hero-text">
					<h1>
						hither <br /> & dither
					</h1>
					<div id="wave" className="flex flex-row w-full drop-shadow-lg shadow-light">
						{waveElements(12)}
					</div>
					<span className="inline-flex items-end gap-2">
						<h2 className="h-[3.5rem] mt-6">pursue your pixelated dreams...</h2>
						<h3 className="mb-2">(click to begin!)</h3>
					</span>
				</div>
			</div>
		</>
	);
}
