export const addWrapsToString = (text: string, wrapLen: number) => {
  let result = "";
  let lastWrap = 0;
  let countWrap = 0;
  for (let i = 0; i < text.length; i++) {
    result += text[i];
    if (text[i] === "\n" || text[i] === "\r" || text[i] === "\r\n") {
      lastWrap = i;
      countWrap++;
    }
    if (
      [" ", ",", "?", "!", ";"].includes(text[i]) &&
      lastWrap + wrapLen <= i
    ) {
      result += "\n";
      lastWrap = i;
      countWrap++;
    }
    if (i >= 700 || countWrap >= 20) {
      result += "...";
      result += "\n\n\n";
      break;
    }
  }
  // console.log({ lastWrap, countWrap, result, text });
  return result;
};
