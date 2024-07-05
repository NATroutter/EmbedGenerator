import type { Embed, Placeholder, outputData } from "./interfaces";
import moment from 'moment';

export function embedToPartial(embed: Embed): Partial<Embed> {
	return clearEmptySlots(embed);
}

export function embedToObjectCode(em: Embed, Placeholders: Placeholder[], removeKeyQuotes = true) : string {

	var cont : outputData = {
		embed: em,
		placeholders: Placeholders
	}

	const output = JSON.stringify(clearEmptySlots(cont, true), null, 2);
	if (!removeKeyQuotes) return output;
	return output.replace(/(\n\s*)"(\w+)":/g, "$1$2:");
}

function clearEmptySlots<T extends object>(
	obj: T,
	objectCode = false
): Partial<T> {
	if (obj === null || obj === undefined) {
		return obj;
	}

	if (Array.isArray(obj)) {
		// @ts-expect-error
		return obj.map(e => clearEmptySlots(e, objectCode));
	}

	return Object.entries(obj).reduce((acc, [key, value]) => {

		if (typeof value === "boolean") {
			// @ts-expect-error
			acc[key] = value;
		}

		if (typeof value === "object") {
			const cleared = clearEmptySlots(value, objectCode);

			if (Object.keys(cleared).length === 0) return acc;

			// @ts-expect-error
			acc[key] = cleared;
		} else if (value) {
			// @ts-expect-error
			acc[key] = objectCode ? ((key === "image" || key === "thumbnail") ? { url: value } : value) : value;
		}
		return acc;
	}, {});
}
