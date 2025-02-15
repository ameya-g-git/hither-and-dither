import { DitheredImage } from "./DitherForm";

interface DitheredImagesProps {
	ditheredImages: DitheredImage[];
	loading: boolean;
}

export default function DitheredImages({ ditheredImages, loading }: DitheredImagesProps) {
	return loading ? (
		<img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fc.tenor.com%2FGw-jI11oSC8AAAAC%2Floading-now-loading.gif&f=1&nofb=1&ipt=5c3d4012a11463564c7534d1376fd80bfddd20ce2ba945615b8e35f04264226a&ipo=images"></img>
	) : (
		<div id="dithered-images">
			{ditheredImages.map((dImg) => (
				<img src={dImg.data} alt={dImg.name} />
			))}
		</div>
	);
}
