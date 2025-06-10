import { OptionGroup } from "../components/Dropdown";

export const algOptions: OptionGroup[] = [
        {
            name: "Diffusion",
            options: [
                { id: "s", val: [[0, 0, 1]], name: "Simple" },
                {
                    id: "fs",
                    val: [
                        [0, 0, 7 / 16],
                        [3 / 16, 5 / 16, 1 / 16],
                    ],
                    name: "Floyd-Steinberg",
                },
                {
                    id: "jjn",
                    val: [
                        [0, 0, 0, 7 / 48, 5 / 48],
                        [3 / 48, 5 / 48, 7 / 48, 5 / 48, 3 / 48],
                        [1 / 48, 3 / 48, 5 / 48, 3 / 48, 1 / 48],
                    ],
                    name: "JJN",
                },
                {
                    id: "stk",
                    val: [
                        [0, 0, 0, 8 / 42, 4 / 42],
                        [2 / 42, 4 / 42, 8 / 42, 4 / 42, 2 / 42],
                        [1 / 42, 2 / 42, 4 / 42, 2 / 42, 1 / 42],
                    ],
                    name: "Stucki",
                },
                {
                    id: "atk",
                    val: [
                        [0, 0, 0, 1 / 8, 1 / 8],
                        [0, 1 / 8, 1 / 8, 1 / 8, 0],
                        [0, 0, 1 / 8, 0, 0],
                    ],
                    name: "Atkinson",
                },
                {
                    id: "urk",
                    val: [
                        [0, 0, 0, 8 / 32, 4 / 32],
                        [2 / 32, 4 / 32, 8 / 32, 4 / 32, 2 / 32],
                    ],
                    name: "Burkes",
                },
                {
                    id: "2sra",
                    val: [
                        [0, 0, 0, 5 / 32, 3 / 32],
                        [2 / 32, 4 / 32, 5 / 32, 4 / 32, 2 / 32],
                        [0, 2 / 32, 3 / 32, 2 / 32, 0],
                    ],
                    name: "Two-Row Sierra",
                },
                {
                    id: "sra",
                    val: [
                        [0, 0, 0, 4 / 16, 3 / 16],
                        [1 / 16, 2 / 16, 3 / 16, 2 / 16, 1 / 16],
                    ],
                    name: "Sierra",
                },
                {
                    id: "sra_l",
                    val: [
                        [0, 0, 2 / 4],
                        [1 / 4, 1 / 4, 0],
                    ],
                    name: "Sierra Lite",
                },
            ],
        },
        {
            name: "Ordered",
            options: [
                {
                    id: "b2x2",
                    val: [
                        [0, 2 / 4],
                        [3 / 4, 1 / 4],
                    ],
                    name: "Bayer 2x2",
                },
                {
                    id: "b4x4",
                    val: [
                        [0, 8 / 16, 2 / 16, 10 / 16],
                        [12 / 16, 4 / 16, 14 / 16, 6 / 16],
                        [3 / 16, 11 / 16, 1 / 16, 9 / 16],
                        [15 / 16, 7 / 16, 13 / 16, 5 / 16],
                    ],
                    name: "Bayer 4x4",
                },
            ],
        },
    ];