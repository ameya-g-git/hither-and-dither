import numpy as np
from PIL import Image
from .euclidean_dist import euclidean_dist
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

    # TODO: just like   check over and test this algorithm to make sure it's working as expected
    # TODO: maybe try the exact images and use the same palette
    # also i want to try out the cool cluster halftonining matrices i saw a bit ago

    # thank you my goat joel yliluoma
    # adapted from https://bisqwit.iki.fi/story/howto/dither/jy/

    """
    okay so    reading this article
    a "planning" procedure is needed. it should determine what combination of colours results in the least visual error
    
    okay i think i finally get it
    we operate under the assumption that ordered dithering mixes two colours together based on some factor (this is thresh_old_val basically)
    
    using this assumption, we develop an algorithm that determines the best 
    two colours to mix together (to best approximate a pixel's colour), and the ratio by which to mix them together
    
    we then use the bayer matrix and compare the pixel's bayer threshold with the mixing ratio we calculated before.
    if the ratio exceeds the threshold, set the current pixel to the second colour. otherwise, set it to the first colour
    """

    img_height, img_width, _ = img.shape
    weight_h, _ = weight_matrix.shape

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
            threshold = weight_matrix[ir % weight_h, ic % weight_h]

            # "The mix ratio determines how much of color2 is needed,
            # and the Bayer matrix distributes that amount spatially."

            # so, if the mix ratio is 0.75, we want to distribute the
            # colours such that 75% of the pixels in the bayer tile are col2
            new_val = mix_col2 if threshold < mix_ratio else mix_col1

            img[ir, ic] = new_val

    carr = np.array(img, dtype=np.uint8)
    dithered_image = Image.fromarray(carr)
    return dithered_image
