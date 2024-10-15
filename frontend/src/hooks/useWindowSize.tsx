import { useState, useEffect } from "react";

export default function useWindowSize() {
	const [windowSize, setWindowSize] = useState({
		screenWidth: window.innerWidth,
		screenHeight: window.innerHeight,
	});

	useEffect(() => {
		function handleResize() {
			setWindowSize({
				screenWidth: window.innerWidth,
				screenHeight: window.innerHeight,
			});
		}

		window.addEventListener("resize", handleResize);

		// Remove event listener on cleanup
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return windowSize;
}
