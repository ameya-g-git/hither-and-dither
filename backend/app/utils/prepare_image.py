from PIL import Image
import numpy as np


def prepare_image(img: Image, img_size: int) -> np.ndarray:
    """
    Prepares an image for processing by resizing it to a specified size.
    Args:
        img (Image): The input image as a PIL Image object.
        img_size (int): The target size for the image.
    Returns:
        np.ndarray: The resized image as a NumPy array.
    """
    width, height = img.size

    if width > height:
        img_width = img_size
        img_height = round((img_size / width) * height)
    else:
        img_width = round((img_size / height) * width)
        img_height = img_size

    img_resize = img.resize((img_width, img_height), Image.Resampling.LANCZOS)
    img_arr = np.array(img_resize, dtype=float)

    return img_arr
