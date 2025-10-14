import {Color3} from "@dcl/schemas/dist/schemas";

export const getNameForCategory = (categoryName: string) => {
    return categoryName.split("_").map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" ")
}

export function componentToHex(c: number) {
	let hex = c.toString(16);
	return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r: number, g: number, b: number) {
	return "%23" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

export function colorToHex(color: Color3 | undefined) {
	if (!color) return;
	return rgbToHex(Math.floor(color.r * 255), Math.floor(color.g * 255), Math.floor(color.b * 255));
}