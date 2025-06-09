import numpy as np
from .euclidean_dist import euclidean_dist


def bayer_mixing_error(desired: np.ndarray[int, 3], col1: np.ndarray[int, 3], col2: np.ndarray[int, 3], ratio: float):
    mix = col1 + (col2 - col1) * ratio

    # weight the error to prefer closer together colours, rather than purely mathematical minimization
    # weight the error to also prefer ratios closer to 0.5, as this promotes more even mixing, resulting in less artifacting
    return euclidean_dist(desired, mix) + euclidean_dist(col1, col2) * 0.1 * (abs(ratio - 0.5) + 0.5)
