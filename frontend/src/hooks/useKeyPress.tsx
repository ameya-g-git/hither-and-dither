import { useEffect } from "react";

export const useKeyPress = (key: string, handleOnKeyPress: (event: Event) => void) => {
	useEffect(() => {
		const listener = (e: KeyboardEvent) => {
			console.log(e.key);
			if (e.key === key) {
				handleOnKeyPress(e);
			}
		};
		document.addEventListener("keyup", listener);
		return () => {
			document.removeEventListener("keyup", listener);
		};
	}, [key, handleOnKeyPress]);
};
