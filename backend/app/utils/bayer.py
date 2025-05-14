import numpy as np
from PIL import Image
from .euclidean_dist import euclidean_dist


def dither_bayer(img: np.ndarray, weights: list[list[float]], palette: list[list[int]]):
    """
    Apply Bayer dithering algorithm to an image.

    Args:
        img (np.ndarray): The input image as a NumPy array.
        weights (list[list[float]]): The Bayer matrix weights.
        palette (list[list[int]]): The color palette for dithering.

    Returns:
        Image: The dithered image.
    """
    weight_matrix = np.array(weights)
    print(weight_matrix)

    img_height, img_width, _ = img.shape
    weight_h, _ = weight_matrix.shape
    weight_matrix -= 0.5 * weight_matrix.max()
    weight_matrix *= 255

    for ir in range(img_height):
        for ic in range(img_width):
            old_val = img[ir, ic].copy()
            thresh_old_val = old_val + weight_matrix[ir % weight_h, ic % weight_h]
            print(thresh_old_val)
            new_val = min(palette, key=lambda c: euclidean_dist(thresh_old_val, c))

            img[ir, ic] = new_val

    carr = np.array(img, dtype=np.uint8)
    dithered_image = Image.fromarray(carr)
    return dithered_image
