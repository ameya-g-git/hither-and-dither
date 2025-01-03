from PIL import Image

# id: nanoid(),
# fileName: file.name,
# src: "",
# open: true,

# brightness: 100,
# contrast: 100,

# algorithm: "fs",
# palette: "bw", // TODO: figure out a better way to encode this maybe ???
# width: 480,
# scale: 1,


class UploadedImage:
    def __init__(
        self,
        image_id,
        file_name,
        src: Image,
        brightness: float,
        contrast: float,
        algorithm: str,
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
