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

    fwd_arr = np.zeros((img_width, 3))
    fwd_arr2 = np.zeros((img_width, 3))

    # TODO: allocate forward arrays automatically based on size of weight matrix

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
                            elif row == 1:
                                np.add(
                                    fwd_arr[ic + col - weight_center],
                                    err * weight_matrix[row, col],
                                    out=fwd_arr[ic + col - weight_center],
                                )
                            else:
                                np.add(
                                    fwd_arr2[ic + col - weight_center],
                                    err * weight_matrix[row, col],
                                    out=fwd_arr2[ic + col - weight_center],
                                )
        if ir < (img_height - 1):
            np.add(img[ir + 1], fwd_arr, out=img[ir + 1])
        if ir < (img_height - 2):
            np.add(img[ir + 2], fwd_arr2, out=img[ir + 2])
        fwd_arr = np.zeros((img_width, 3))
        fwd_arr2 = np.zeros((img_width, 3))

    carr = np.array(img, dtype=np.uint8)
    dithered_image = Image.fromarray(carr)
    return dithered_image
