from flask import Blueprint, jsonify, request
from io import BytesIO
from json import loads
from base64 import b64decode, b64encode
from PIL import Image, ImageEnhance
from math import prod
import numpy as np

from .models import UploadedImage, UploadedImageList
from .utils.dither import dither_general
from .utils.bayer import dither_bayer
from .utils.hex_to_array import hex_to_array
from .utils.prepare_image import prepare_image

uploaded_images = UploadedImageList([])

main = Blueprint("main", __name__)

"""Uploading images TODO
 - Accepts 
"""


@main.route("/", methods=["POST"])
def upload_images():
    try:
        form_data = request.form.get("images")

        data = []

        if not form_data:
            return jsonify({"error": "Invalid upload."}), 400
        else:
            data: list[dict] = loads(form_data)

        if len(data) > 5:
            return jsonify({"error": "Too many images uploaded in a request."}), 415

        for image in data:
            header_length = len("data:image/***;base64,")
            image_data = b64decode(image.get("src")[header_length:])
            decoded_image = Image.open(BytesIO(image_data))
            decoded_image = decoded_image.convert("RGB")

            if prod(decoded_image.size) > 25e6:
                return jsonify({"error": "Image too big, try downscaling before uploading."}), 415

            image_brightness = image.get("brightness")
            image_contrast = image.get("contrast")

            brightness = ImageEnhance.Brightness(decoded_image)
            brightened = brightness.enhance(image_brightness / 100)

            contrast = ImageEnhance.Contrast(brightened)
            edited_image = contrast.enhance(image_contrast / 100)

            palette_list = np.array([hex_to_array(x) for x in image.get("colours")])  # [R,G,B] encoding
            weight_matrix = np.array(image.get("weights"))

            uploaded_image = UploadedImage(
                image_id=image.get("id"),
                file_name=image.get("fileName"),
                src=edited_image,
                algorithm=image.get("algorithm"),
                weights=weight_matrix,
                palette=palette_list,
                width=image.get("width"),
                scale=image.get("scale"),
            )

            if uploaded_image.width not in [360, 480, 720]:
                return (
                    jsonify({"error": "Export resolution not in allowed range.", "filename": uploaded_image.file_name}),
                    415,
                )

            if uploaded_image.scale not in [1, 2, 4]:
                return jsonify({"error": "Scale not in allowed range.", "filename": uploaded_image.file_name}), 415

            uploaded_images.push(uploaded_image)
        return jsonify({"upload": "Succesful"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@main.route("/", methods=["GET"])
def get_images():
    return jsonify(uploaded_images.to_dict_list()), 200


@main.route("/delete", methods=["POST"])
def delete_uploaded_images():
    uploaded_images.clear()
    return {}, 201


@main.route("/images", methods=["GET"])
def dither_images():
    try:
        dithered_images = []

        if len(uploaded_images.images) == 0:
            return jsonify({"error": "No images to dither"}), 500

        for image in uploaded_images.images:
            prepared_image = prepare_image(img=image.src, img_size=image.width)
            # apply dithering algorithm
            if image.algorithm[0] == "o":
                dithered_image = dither_bayer(
                    img=prepared_image,
                    weight_matrix=image.weights,
                    palette=image.palette,
                )
            else:
                dithered_image = dither_general(
                    img=prepared_image,
                    weight_matrix=image.weights,
                    palette=image.palette,
                )

            print(f"Image {image.file_name} dithered with {image.algorithm}")
            d_width, d_height = dithered_image.size
            dithered_image_resize = dithered_image.resize(
                (d_width * image.scale, d_height * image.scale), Image.Resampling.NEAREST
            )

            # save image to in-memory file and encode it into a base-64 string
            mem_file = BytesIO()
            dithered_image_resize.save(mem_file, format="PNG")
            data_url_bytes = b64encode(mem_file.getvalue())
            data_url_str = data_url_bytes.decode("utf-8")
            data_url = f"data:image/png;base64,{data_url_str}"

            dithered_image_json = {
                "name": f"{image.file_name.split('.')[0]}_dither_{image.algorithm}",
                "data": data_url,
            }

            dithered_images.append(dithered_image_json)

        uploaded_images.clear()

        return jsonify(dithered_images), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@main.route("/teapot", methods=["GET"])
def im_a_teapot():
    return jsonify({"teapot": "Cannot brew coffee with a teapot."}), 418
