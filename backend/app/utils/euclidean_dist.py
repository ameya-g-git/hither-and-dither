# gamma corrected euclidean distance yay!
import numpy as np


def euclidean_dist(col1: np.ndarray[int, 3], col2: np.ndarray[int, 3]):
    dR = col1[0] - col2[0]
    dG = col1[1] - col2[1]
    dB = col1[2] - col2[2]

    return (0.3 * dR**2) + (0.59 * dG**2) + (0.11 * dB**2)
