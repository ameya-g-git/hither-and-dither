import { useState, useEffect } from "react";

export default function useScrollLength() {
	const [scrollLength, setScrollLength] = useState(0);

	useEffect(() => {
		function handleScroll() {
			setScrollLength(window.scrollY);
		}

		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return scrollLength;
}
