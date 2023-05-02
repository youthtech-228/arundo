export const COLORS = {
  yellowToPurple: [
    [255, 247, 243],
    [253, 224, 221],
    [252, 197, 192],
    [250, 159, 181],
    [247, 104, 161],
    [221, 52, 151],
    [174, 1, 126],
    [122, 1, 119],
  ],
  rainbow: [
    [213, 62, 79], // 1
    [50, 136, 189], // 2
    [253, 174, 97], // 3
    [171, 221, 164], // 4
    [255, 255, 191], // 5
    [158, 1, 66], // 6
    [94, 79, 162], // 7
    [244, 109, 67], // 8
    [102, 194, 165], // 9
    [254, 224, 139], // 10
    [230, 245, 152], // 11
  ],
  redToBlack: [
    [178, 24, 43],
    [214, 96, 77],
    [244, 165, 130],
    [253, 219, 199],
    [255, 255, 255],
    [224, 224, 224],
    [186, 186, 186],
    [135, 135, 135],
    [77, 77, 77],
  ],
  openClose: [
    [30, 96, 230],
    [180, 180, 180],
  ],
};

export const getColors =
  (palette = COLORS.yellowToPurple) =>
  (items = [], { asString }: { asString: boolean }) => {
    const doubledPalette = [...palette, ...palette.map((c) => [...c, 0.5])];
    const colors = doubledPalette.slice(0, items.length);

    return asString ? colors.map((c) => rgbToString(c)) : colors;
  };

export const rgbToString = (rgba = []) => {
  const [r, g, b, a] = rgba;

  return a !== undefined && a < 1
    ? `rgba(${r}, ${g}, ${b}, ${a})`
    : `rgb(${r}, ${g}, ${b})`;
};
