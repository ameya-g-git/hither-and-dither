import wave from "./assets/pixel_doodles/wave.svg";
import back_layer from "./assets/pixel_doodles/back_layer.svg";
import mid_layer from "./assets/pixel_doodles/mid_layer.svg";
import top_layer from "./assets/pixel_doodles/top_layer.svg";
import bayer from "./assets/img/bayerpattern.png";
import creation from "./assets/img/creation.webp";
import david from "./assets/img/david.webp";
import flowers from "./assets/img/flowers.webp";
import mona from "./assets/img/mona.webp";
import moon from "./assets/img/moon.webp";
import pearl from "./assets/img/pearl.webp";
import supper from "./assets/img/supper.webp";
import venus from "./assets/img/venus.webp";
import waves from "./assets/img/waves.webp";
import webb from "./assets/img/webb.webp";

import ScrollingImage from "./components/ScrollingImage";
import useMousePosition, { position } from "./hooks/useMousePosition";
import ParallaxLayer from "./components/ParallaxLayer";
import useScrollLength from "./hooks/useScrollLength";
import { createContext } from "react";

// TODO: re-export the parallax layers so opacity doesn't need to be altered
export const MousePosition = createContext<position>({ x: 0, y: 0 });

export default function App() {
	const scrollLength = useScrollLength();

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
		<MousePosition.Provider value={useMousePosition()}>
			<div className="flex items-center w-full h-screen pl-24 crt-flicker crt-colorsep">
				<div
					id="bayer"
					className="absolute left-0 flex flex-row items-center justify-between w-full -top-96 animate-float [--float-dist:2rem] -z-[99] opacity-25"
				>
					<img src={bayer} />
					<img src={bayer} />
					<img src={bayer} />
				</div>
				<div className="absolute flex items-center justify-center w-full h-full pt-16 pointer-events-none select-none">
					<ParallaxLayer factor={0.01}>
						<img src={back_layer} className="mt-16 opacity-50 h-5/6" alt="" />
					</ParallaxLayer>
					<ParallaxLayer factor={0.03}>
						<img src={mid_layer} className="h-5/6 opacity-60 ml-96" alt="" />
					</ParallaxLayer>
					<ParallaxLayer factor={0.05}>
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
			<div className="h-screen overflow-visible">
				<ParallaxLayer factor={0.03}>
					<img src={creation} className="absolute h-56 -top-48 animate-float left-[2%]" alt="" />
				</ParallaxLayer>
			</div>
		</MousePosition.Provider>
	);
}
