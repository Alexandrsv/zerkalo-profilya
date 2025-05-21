export const getDeclensionWord = (
  forms: [string, string, string],
  val?: number
): string => {
  const cases = [2, 0, 1, 1, 1, 2];
  if (!val && val !== 0) {
    return "";
  }
  return (
    val +
    " " +
    forms[
      val % 100 > 4 && val % 100 < 20 ? 2 : cases[val % 10 < 5 ? val % 10 : 5]
    ]
  );
};
