export const prefixed = (
  name: string,
  prefix: string = document.currentScript?.getAttribute("prefix") || "lit"
) => (prefix ? [prefix, name].join("-") : name);
