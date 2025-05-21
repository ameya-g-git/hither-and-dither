import { ChangeEvent } from "react";

interface ColourChipProps {
	col: string;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
	onDelete: () => void;
	onBlur: () => void;
}

export default function ColourChip({
	col,
	onChange,
	onDelete,
	onBlur,
}: ColourChipProps) {
	return (
		<div className="relative items-center p-1 *:cursor-pointer">
			<div
				className="w-12 h-12 rounded-full "
				style={{ backgroundColor: col }}
			></div>
			<input
				className="absolute top-0 left-0 w-12 h-12 border-none rounded-full outline-none opacity-0"
				type="color"
				value={col}
				onChange={onChange}
				onBlur={onBlur}
			/>
			<button
				className="absolute flex items-center justify-center text-medium w-8 h-8 border-[3px] text-sm border-medium rounded-full -bottom-2 -right-2 bg-dark [&&]:p-0"
				onClick={(e) => {
					e.preventDefault();
					onDelete();
				}}
			>
				x
			</button>
		</div>
	);
}

{
	/* <div
        className="relative items-center p-1 *:cursor-pointer"
        key={i}
    >
        <div
            className="w-12 h-12 rounded-full "
            style={{ backgroundColor: col }}
        ></div>
        <input
            className="absolute top-0 left-0 w-12 h-12 border-none rounded-full outline-none opacity-0"
            type="color"
            value={col}
            id={`${img.id}-col${i}`}
            name={`${img.id}-col${i}`}
            onChange={(e) => {
                setTempColor(e.target.value);

                let newPaletteList = [...paletteList];
                newPaletteList[i] = tempColor;
                setPaletteList(newPaletteList);
            }}
            onBlur={() => {
                setCustomPaletteName(true);
                onChange(img.id, "colours", paletteList);
            }}
        />
        <button
            className="absolute flex items-center justify-center text-medium w-8 h-8 border-[3px] text-sm border-medium rounded-full -bottom-2 -right-2 bg-dark [&&]:p-0"
            onClick={(e) => {
                e.preventDefault();
                setCustomPaletteName(true);

                let newPaletteList = [...paletteList];
                newPaletteList.splice(i, 1);

                setPaletteList(newPaletteList);
                onChange(img.id, "colours", newPaletteList);
            }}
        >
            x
        </button>
    </div> */
}
