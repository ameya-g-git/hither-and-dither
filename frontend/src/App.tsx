import wave from "./assets/pixel_doodles/wave.svg";
import back_layer from "./assets/pixel_doodles/back_layer.svg";
import mid_layer from "./assets/pixel_doodles/mid_layer.svg";
import top_layer from "./assets/pixel_doodles/top_layer.svg";
import back_cloud from "./assets/pixel_doodles/back_cloud.webp";
import mid_cloud from "./assets/pixel_doodles/mid_cloud.webp";
import top_cloud from "./assets/pixel_doodles/top_cloud.webp";

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
import earth from "./assets/img/earth.webp";
import clouds from "./assets/img/clouds.webp";
import flower from "./assets/img/flower.webp";
import reef from "./assets/img/reef.webp";

import ScrollingImage from "./components/ScrollingImage";
import useMousePosition, { position } from "./hooks/useMousePosition";
import ParallaxLayer from "./components/ParallaxLayer";
import useScrollLength from "./hooks/useScrollLength";
import { createContext, useEffect, useState } from "react";
import WindowImage from "./components/WindowImage";

// TODO: re-export the parallax layers so opacity doesn't need to be altered
export const MousePosition = createContext<position>({ x: 0, y: 0 });

export default function App() {
	// const scrollLength = useScrollLength();
	// console.log(scrollLength);
	const [positions, setPositions] = useState([
		{ targetPosition: 0, currentPosition: 0 },
		{ targetPosition: 0, currentPosition: 0 },
		{ targetPosition: 0, currentPosition: 0 },
		{ targetPosition: 0, currentPosition: 0 },
	]);
	const targetPositionFunctions = (s: number) => [
		// list of functions to calculate target position of window
		Math.min(150, (s - 700) / 3),
		Math.max(450, -(s - 2500) / 3),
		Math.min(425, (s + 100) / 3),
		Math.max(1400, -(s - 5500) / 3),
	];

	const waveElements = (n: number) => {
		return Array(n)
			.fill("")
			.map((_, i) => (
				<ScrollingImage key={i} ltr={false} width="w-12">
					<img className="-mr-[0.01rem]" src={wave} />
				</ScrollingImage>
			));
	};

	const cloudElements = (n: number) => {
		return Array(n)
			.fill("")
			.map((_, i) => (
				<div key={i} className="relative max-h-96 w-full *:absolute *:top-8">
					<img src={back_cloud} className="mt-8 animate-float [--delay:500ms]" alt="" />
					<img src={mid_cloud} className="mt-4 animate-float [--delay:1000ms]" alt="" />
					<img src={top_cloud} className="animate-float [--delay:1500ms]" alt="" />
				</div>
			));
	};

	useEffect(() => {
		// update target position based on scroll length
		function handleScroll() {
			const scrollLength = window.scrollY;

			setPositions((prevPositions) =>
				prevPositions.map((pos, i) => ({
					...pos,
					targetPosition: targetPositionFunctions(scrollLength)[i], // use a predefined function to decide the window's target position
				}))
			);
		}

		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	useEffect(() => {
		const timeout = setTimeout(() => {
			setPositions((prevPositions) =>
				prevPositions.map((pos) => ({
					...pos,
					currentPosition:
						Math.abs(pos.currentPosition - pos.targetPosition) <= 0.1
							? pos.targetPosition
							: pos.currentPosition + (pos.targetPosition - pos.currentPosition) * 0.1,
				}))
			);
		}, 8);

		return () => clearTimeout(timeout);
	}, [positions]);

	return (
		<>
			<MousePosition.Provider value={useMousePosition()}>
				<div className="box-border flex items-center w-screen h-screen crt-flicker crt-colorsep">
					<div
						id="bayer"
						className="absolute left-0 flex flex-row items-center justify-center w-full -top-96 animate-float [--float-dist:2rem] overflow-hidden -z-[99] opacity-25"
					>
						<img src={bayer} />
						<img src={bayer} />
						<img src={bayer} />
					</div>
					<div className="absolute flex items-center justify-center w-full h-full pt-16 overflow-hidden pointer-events-none select-none">
						{/* TODO: fix the height of the space layers    it'll do */}
						<ParallaxLayer factor={0.01}>
							<img src={back_layer} className="h-screen mt-16 opacity-50" alt="" />
						</ParallaxLayer>
						<ParallaxLayer factor={0.03}>
							<img src={mid_layer} className="h-5/6 opacity-60 ml-96" alt="" />
						</ParallaxLayer>
						<ParallaxLayer factor={0.04}>
							<img src={top_layer} className="h-4/6" alt="" />
						</ParallaxLayer>
					</div>
					<div className="ml-16 " id="hero-text">
						<h1>
							hither <br /> & dither
						</h1>
						<div id="wave" className="flex flex-row w-full drop-shadow-lg shadow-light">
							{waveElements(12)}
						</div>
						<span className="inline-flex items-end gap-2">
							<h2 className="h-[3.5rem] mt-6">pursue your pixelated dreams...</h2>
							<h4 className="mb-2">(click to begin!)</h4>
						</span>
					</div>
				</div>
				<div className="mt-24 overflow-visible z-[99]">
					<ParallaxLayer factor={0.01}>
						<img src={webb} className="absolute h-80 -top-48 animate-float left-4 [--delay:1000ms]" alt="" />
						<img src={pearl} className="absolute w-96 -top-56 animate-float -right-24 [--delay:500ms]" alt="" />
						<img src={venus} className="absolute w-96 -top-24 animate-float left-[60%] [--delay:1600ms]" alt="" />
					</ParallaxLayer>
					<ParallaxLayer factor={0.03}>
						<img src={supper} className="absolute h-56 -top-48 animate-float left-[45%] [--delay:1000ms]" alt="" />
						<img src={creation} className="absolute h-64 -top-56 animate-float left-32 [--delay:1500ms] " alt="" />
						<img src={david} className="absolute h-80 -top-48 animate-float left-3/4 [--delay:750ms]" alt="" />
					</ParallaxLayer>
					<ParallaxLayer factor={0.05}>
						<img src={mona} className="absolute w-72 -top-48 animate-float left-[20%] [--delay:1000ms]" alt="" />
						<img src={moon} className="absolute h-60 -top-24 animate-float left-1/2 [--delay:1000ms]" alt="" />
					</ParallaxLayer>
					<ParallaxLayer factor={0.06}>
						<img src={flowers} className="absolute h-80 -top-48 animate-float left-[30%] [--delay:750ms]" alt="" />
						<img src={waves} className="absolute h-56 -top-16 animate-float left-[35%] [--delay:500ms]" alt="" />
					</ParallaxLayer>
				</div>
			</MousePosition.Provider>
			<div className="box-border w-screen h-screen overflow-hidden bg-medium">
				<div className="flex flex-row *:-mr-4 z-50">{cloudElements(7)}</div>
				<div className="w-full h-full overflow-hidden">
					<WindowImage
						x={positions[0].currentPosition}
						y={400}
						className="w-1/3 aspect-[5/3]"
						title="DSC_0132"
						img={clouds}
					/>
					<WindowImage
						x={1000}
						y={positions[2].currentPosition}
						className="w-[30%] aspect-[4/3]"
						title="DJI_5129"
						img={reef}
					/>
					<WindowImage
						// x={Math.min(150, }
						x={positions[3].currentPosition}
						y={500}
						className="w-1/4 aspect-square"
						title="IMG_7823"
						img={earth}
					/>
					<WindowImage
						x={600}
						y={positions[1].currentPosition}
						className="w-1/4 aspect-[4/5]"
						title="IMG_8214"
						img={flower}
					/>
					<span
						style={{
							transform: `translate(${positions[0].currentPosition - 100}px, 650px)`,
						}}
						className="absolute left-0 tracking-widest font-bold text-2xl window-title [--stroke:3px] text-dark"
					>
						the beauty of the world...
					</span>
					<span
						style={{
							transform: `translate(500px, ${positions[1].currentPosition + 300}px)`,
						}}
						className="absolute tracking-widest font-bold text-2xl window-title [--stroke:3px] text-dark"
					>
						in just a couple pixels...
					</span>
				</div>
			</div>
		</>
	);
}
