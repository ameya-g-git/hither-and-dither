import numpy as np
from PIL import Image

# For RGB images, the following might give better colour-matching.
# p = np.linspace(0, 1, nc)
# p = np.array(list(product(p,p,p)))
# def get_new_val(old_val):
#    idx = np.argmin(np.sum((old_val[None,:] - p)**2, axis=1))
#    return p[idx]

# do some more reading on how to do FS dithering with RGB just so i can adjust this implementation appropriately
# TODO: also  fetching b64 encoded images from the server  decoding them   and zipping them with JSZip or whatever


def dither_general(img: Image, img_width: int, scale: int, algo: list, palette: str):
    width, height = img.size
    weight_matrix, factor = algo

    img = img.convert("L")
    fwd_arr = np.zeros(width)
    fwd_arr2 = np.zeros(width)
    weight_h, weight_w = weight_matrix.shape
    weight_center = weight_w // 2

    # TODO: also  make sure the largest dimension is set to the value defined by img_width

    if width > height:
        img_height = round((img_width / width) * height)
    else:
        img_width = round((img_height / height) * width)

    print(img_width, img_height, width, height)

    img_resize = img.resize((img_width, img_height), Image.Resampling.LANCZOS)
    img_arr = np.array(img_resize, dtype=float) / 255

    # TODO: figure out palette implementation, figuring just euclidean distance is good enough, but need to figure out how
    # for now, im just doing black and white schtuff

    for ir in range(img_height):
        for ic in range(img_width):
            for row in range(weight_h):
                for col in range(weight_w):
                    if not (weight_matrix[row, col]):
                        continue
                    else:
                        old_val = img_arr[ir, ic].copy()
                        new_val = round(old_val)  # TODO: this is where the replacement for the palette thing comes in

                        img_arr[ir, ic] = new_val
                        err = old_val - new_val  # TODO: and as such, the error format will change

                        if ic + col - weight_center < img_width:
                            if row == 0:
                                img_arr[ir, ic + col - weight_center] += err * weight_matrix[row, col] / factor
                            if row == 1:
                                fwd_arr[ic + col - weight_center] += err * weight_matrix[row, col] / factor
                            if row == 2:
                                fwd_arr2[ic + col - weight_center] += err * weight_matrix[row, col] / factor

    img_arr = np.clip(img_arr, 0, 1)
    carr = np.array(img_arr / np.max(img_arr, axis=(0, 1)) * 255, dtype=np.uint8)
    return Image.fromarray(carr)

    # TODO: okay im done for today Ough   i guess i should test this out next   receive the image from this function and display it in a modal maybe


def floyd_steinberg(img: Image):
    """
    Floyd-Steinberg dither the image img into a palette with nc colours per
    channel.

    """

    width, height = img.size
    img = img.convert("L")
    fwd_arr = np.zeros(width)

    img_arr = np.array(img, dtype=float) / 255

    for ir in range(height):
        for ic in range(width):
            # NB need to copy here for RGB arrays otherwise err will be (0,0,0)!
            old_val = img_arr[ir, ic].copy()
            new_val = round(img_arr[ir, ic])

            img_arr[ir, ic] = new_val

            err = old_val - new_val

            if ic < width - 1:
                img_arr[ir, ic + 1] += (err / 16) * 7
            if ir < height - 1:
                if ic > 0:
                    fwd_arr[ic - 1] += (err / 16) * 3
                fwd_arr[ic] += (err / 16) * 5
                if ic < width - 1:
                    fwd_arr[ic + 1] += err / 16
        if ir < height - 1:
            img_arr[ir + 1] += fwd_arr

        fwd_arr = np.zeros(width)

    img_arr = np.clip(img_arr, 0, 1)
    carr = np.array(img_arr / np.max(img_arr, axis=(0, 1)) * 255, dtype=np.uint8)
    return Image.fromarray(carr)


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
