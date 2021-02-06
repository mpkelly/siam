export const isObject = (value?:any) => {
	return new Object(value) === value;
}