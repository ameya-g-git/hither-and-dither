import numpy as np
from PIL import Image
from .bayer_mixing_error import bayer_mixing_error
from .bayer_mix_ratio import bayer_mix_ratio


def dither_bayer(img: np.ndarray, weight_matrix: list[list[float]], palette: list[list[int]]):
    """
    Apply Bayer dithering algorithm to an image.

    Args:
        img (np.ndarray): The input image as a NumPy array.
        weights (list[list[float]]): The Bayer matrix weights.
        palette (list[list[int]]): The color palette for dithering.

    Returns:
        Image: The dithered image.
    """

    # okay you know what     this guy's a little strange with the islamophobia nonsense on his blog
    # cool dithering algorithm but the guy's weird
    # adapted from https://bisqwit.iki.fi/story/howto/dither/jy/

    img_height, img_width, _ = img.shape
    weight_h, weight_w = weight_matrix.shape

    for ir in range(img_height):
        for ic in range(img_width):
            old_val = img[ir, ic].copy()

            min_cost = 1e10
            plan = [[], [], 0]  # will hold the two colours for mixing, as well as their mix ratio

            for i in range(len(palette)):
                for j in range(i + 1, len(palette)):
                    col1 = palette[i]
                    col2 = palette[j]

                    ratio = bayer_mix_ratio(old_val, col1, col2)
                    cost = bayer_mixing_error(old_val, col1, col2, ratio)

                    if cost < min_cost:
                        plan = [col1, col2, ratio]
                        min_cost = cost

            mix_col1, mix_col2, mix_ratio = plan
            threshold = weight_matrix[ir % weight_h, ic % weight_w]

            # "The mix ratio determines how much of color2 is needed,
            # and the Bayer matrix distributes that amount spatially."

            # so, if the mix ratio is 0.75, we want to distribute the
            # colours such that 75% of the pixels in the bayer tile are col2
            new_val = mix_col2 if threshold < mix_ratio else mix_col1

            img[ir, ic] = new_val

    carr = np.array(img, dtype=np.uint8)
    dithered_image = Image.fromarray(carr)
    return dithered_image
