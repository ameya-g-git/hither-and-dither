import numpy as np
from PIL import Image

# For RGB images, the following might give better colour-matching.
# p = np.linspace(0, 1, nc)
# p = np.array(list(product(p,p,p)))
# def get_new_val(old_val):
#    idx = np.argmin(np.sum((old_val[None,:] - p)**2, axis=1))
#    return p[idx]


# do some more reading on how to do FS dithering with RGB just so i can adjust this implementation appropriately
# i mean i figure its just   find the closest colour based on euclidean distance. the most effective means of that is unknown but ! we shall see
# TODO: also  fetching b64 encoded images from the server  decoding them   and zipping them with JSZip or whatever
def euclidean_dist(col1: list[int], col2: list[int]):
    dR = col1[0] - col2[0]
    dG = col1[1] - col2[1]
    dB = col1[2] - col2[2]

    return (0.3 * dR**2) + (0.59 * dG**2) + (0.11 * dB**2)


def dither_general(img: Image, img_size: int, scale: int, weights: list[list[float]], palette: list[str]):
    width, height = img.size
    weight_matrix = np.array(weights)

    # img = img.convert("L")

    weight_h, weight_w = weight_matrix.shape
    weight_center = weight_w // 2

    if width > height:
        img_width = img_size
        img_height = round((img_size / width) * height)
    else:
        img_width = round((img_size / height) * width)
        img_height = img_size

    fwd_arr = np.zeros((img_width, 3))
    fwd_arr2 = np.zeros((img_width, 3))

    img_resize = img.resize((img_width, img_height), Image.Resampling.LANCZOS)
    img_arr = np.array(img_resize, dtype=float)
    print(palette)

    for ir in range(img_height):
        for ic in range(img_width):
            old_val = img_arr[ir, ic].copy()
            new_val = min(palette, key=lambda c: euclidean_dist(old_val, c))

            img_arr[ir, ic] = new_val
            err = np.clip(np.subtract(old_val, new_val), -255, 255)

            for row in range(weight_h):
                for col in range(weight_w):
                    if not (weight_matrix[row, col]):
                        continue
                    else:
                        if ic + col - weight_center < img_width:
                            if row == 0:
                                np.add(
                                    img_arr[ir, ic + col - weight_center],
                                    err * weight_matrix[row, col],
                                    out=img_arr[ir, ic + col - weight_center],
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
            np.add(img_arr[ir + 1], fwd_arr, out=img_arr[ir + 1])
        if ir < (img_height - 2):
            np.add(img_arr[ir + 2], fwd_arr2, out=img_arr[ir + 2])
        fwd_arr = np.zeros((img_width, 3))
        fwd_arr2 = np.zeros((img_width, 3))

    carr = np.array(img_arr, dtype=np.uint8)
    dithered_image = Image.fromarray(carr)
    dithered_image_resize = dithered_image.resize((img_width * scale, img_height * scale), Image.Resampling.NEAREST)
    return dithered_image_resize


# def palette_reduce(img, nc):
#     """Simple palette reduction without dithering."""
#     arr = np.array(img, dtype=float) / 255
#     arr = round_val(arr, nc)

#     carr = np.array(arr/np.max(arr) * 255, dtype=np.uint8)
#     return Image.fromarray(carr)

# for nc in (2, 3, 4, 8, 16):
#     print('nc =', nc)
#     dim = fs_dither(img, nc)
#     dim.save('dimg-{}.jpg'.format(nc))
#     rim = palette_reduce(img, nc)
#     rim.save('rimg-{}.jpg'.format(nc))
