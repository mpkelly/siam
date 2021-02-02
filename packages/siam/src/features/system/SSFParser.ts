import { parseTabbedContent, TreeNodeValue } from "../parse/TabIndentedDataParser";

export const parseSSFContent = (input:string) => {
  return parseTabbedContent(input, systemValueConverter)
}

export const systemValueConverter = (value?:string):TreeNodeValue => {
  if (isNumeric(value)) {
    return Number(value);
  } else if (
    value === "true"
  ) {
    return true
  } else if (value === "false") {
    return false;
  } else if (value?.includes(",") && !value?.startsWith('"')) {
    return value.split(",").map(systemValueConverter) as any[]
  }
  return value;
}

const isNumeric = (input:any) => {
  return !isNaN(parseFloat(input)) && isFinite(input);
}