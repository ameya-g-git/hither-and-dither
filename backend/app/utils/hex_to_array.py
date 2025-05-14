def hex_to_dec(hex_char: str):
    if hex_char.isdigit():
        return int(hex_char)
    return ord(hex_char) - ord("a") + 10


def hex_to_array(hex: str):
    R = hex[1:3]
    G = hex[3:5]
    B = hex[5:7]

    R_val = hex_to_dec(R[1]) + (hex_to_dec(R[0]) * 16)
    G_val = hex_to_dec(G[1]) + (hex_to_dec(G[0]) * 16)
    B_val = hex_to_dec(B[1]) + (hex_to_dec(B[0]) * 16)

    return [R_val, G_val, B_val]
