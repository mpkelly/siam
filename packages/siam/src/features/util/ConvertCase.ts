export const camelToHyphen = (camel: string) => {
	return camel.replace(/([a-z][A-Z])/g, function (g) {
		return g[0] + "-" + g[1].toLowerCase();
	});
};