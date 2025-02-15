from PIL import Image


# export interface UploadedImage {
# 	id: string;
# 	fileName: string;
# 	src: string;

# 	brightness: number;
# 	contrast: number;

# 	algorithm: string;
# 	weights: number[][];
# 	palette: string;
# 	width: number;
# 	scale: number;
# }


class UploadedImage:
    def __init__(
        self,
        image_id,
        file_name,
        src: Image,
        brightness: float,
        contrast: float,
        algorithm: str,
        weights: list[list[int]],
        palette: str,
        width: int,
        scale: float,
    ) -> None:
        self.image_id: str = image_id
        self.file_name: str = file_name
        self.src: Image = src
        self.brightness: float = brightness
        self.contrast: float = contrast
        self.algorithm: str = algorithm
        self.weights: list[list[float]] = weights
        self.palette: str = palette
        self.width: int = width
        self.scale: float = scale

    def to_dict(self):
        return {
            "image_id": self.image_id,
            "file_name": self.file_name,
            "src": [self.src.format, self.src.size],
            "brightness": self.brightness,
            "contrast": self.contrast,
            "algorithm": self.algorithm,
            "weights": self.weights,
            "palette": self.palette,
            "width": self.width,
            "scale": self.scale,
        }


class UploadedImageList:
    def __init__(self, images: list[UploadedImage]) -> None:
        self.images = images

    def push(self, image: UploadedImage):
        self.images.append(image)
        return self.images

    def to_dict_list(self):
        image_list = []

        for image in self.images:
            image_list.append(image.to_dict())

        return image_list
