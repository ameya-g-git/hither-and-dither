# iterative bayer matrix generation
# not perfectly accurate but it'll make do

for i in range(3):
    for j in range(3):
        xdim = 1 << i
        ydim = 1 << j

        num = xdim * ydim

        print("{")
        print(f'id: "ob{ydim}x{xdim}",')
        print(f"val: [")

        for y in range(ydim):
            print("[", end="")
            for x in range(xdim):
                bin_xor_xy = format(x ^ y, f"0{i+j}b")
                bin_y = format(y, f"0{i+j}b")

                entry = int("".join("".join(i) for i in zip(bin_y, bin_xor_xy)), 2)  # bit interleaving
                entry = int(format(entry, f"0{i+j}b")[::-1][: max(1, i + j)], 2)

                print(f"{entry}/{num}", end=", ")
                # print(entry, end=", ")

            print("],")

        print("],")
        print(f'name: "Bayer {ydim}x{xdim}"')
        print("},")
        print()
        print()

# TODO: write code to get blue noise from texture
# simple PIL code   just read luminance and put it into a 2d matrix to print out
