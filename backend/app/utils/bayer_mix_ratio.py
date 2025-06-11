import numpy as np


def bayer_mix_ratio(desired: np.ndarray[int, 3], col1: np.ndarray[int, 3], col2: np.ndarray[int, 3]):
    # calculates the best mixing ratio to attain a desired colour using two colours
    weights = [
        30 if col1[0] != col2[0] else 0,
        59 if col1[1] != col2[1] else 0,
        11 if col1[2] != col2[2] else 0,
    ]

    def calcRatio(d: int, c1: int, c2: int, weight: int):
        # based off the mixing equation:
        # col1 + (col2 - col1) * ratio
        return weight * (d - c1) / (c2 - c1) if (c1 != c2) else 0

    v = np.vectorize(calcRatio)

    # gamma corrected weighted average
    return sum(v(desired, col1, col2, weights)) / sum(weights)
