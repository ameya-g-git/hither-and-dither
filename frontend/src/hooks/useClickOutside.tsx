import { RefObject, useEffect } from "react";

// Adapted from https://dev.to/brdnicolas/click-outside-magic-a-new-custom-hook-4np4

export const useClickOutside = (ref: RefObject<HTMLElement>, handleOnClickOutside: (event: Event) => void) => {
	useEffect(() => {
		const listener = (event: MouseEvent | TouchEvent) => {
			if (!ref.current || ref.current.contains(event.target as Node)) {
				return;
			}
			handleOnClickOutside(event);
		};
		document.addEventListener("mousedown", listener);
		document.addEventListener("touchstart", listener);
		return () => {
			document.removeEventListener("mousedown", listener);
			document.removeEventListener("touchstart", listener);
		};
	}, [ref, handleOnClickOutside]);
};
