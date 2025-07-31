import numpy as np
from PIL import Image

from .euclidean_dist import euclidean_dist


def dither_general(img: np.ndarray[int], weight_matrix: np.ndarray, palette: np.ndarray[int, (1, 3)]):
    """
    Generalized dithering algorithm for images.
    Allows for custom dithering weights and color palette.

    Args:
        img (np.ndarray): The input image as a NumPy array.
        weights (list[list[float]]): The dithering weights.
        palette (list[list[int]]): The color palette for dithering.

    Returns:
        Image: The dithered image.
    """
    img_height, img_width, _ = img.shape

    weight_h, weight_w = weight_matrix.shape
    weight_center = weight_w // 2

    fwd_arrs = np.zeros((weight_h, img_width, 3))

    for ir in range(img_height):
        for ic in range(img_width):
            old_val = img[ir, ic].copy()
            new_val = min(palette, key=lambda c: euclidean_dist(old_val, c))

            img[ir, ic] = new_val
            err = np.clip(np.subtract(old_val, new_val), -255, 255)

            for row in range(weight_h):
                for col in range(weight_w):
                    if not (weight_matrix[row, col]):
                        continue
                    else:
                        if 0 <= ic + col - weight_center < img_width:
                            if row == 0:
                                np.add(
                                    img[ir, ic + col - weight_center],
                                    err * weight_matrix[row, col],
                                    out=img[ir, ic + col - weight_center],
                                )
                            else:
                                np.add(
                                    fwd_arrs[row - 1][ic + col - weight_center],
                                    err * weight_matrix[row, col],
                                    out=fwd_arrs[row - 1][ic + col - weight_center],
                                )

        for wr in range(weight_h):
            if ir < img_height - wr - 1:
                np.add(img[ir + wr + 1], fwd_arrs[wr], out=img[ir + wr + 1])

        fwd_arrs = np.zeros((weight_h, img_width, 3))

    carr = np.array(img, dtype=np.uint8)
    dithered_image = Image.fromarray(carr)
    return dithered_image
