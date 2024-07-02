import type { Embed, Variable, outputData } from "./interfaces";
import moment from 'moment';

export function embedToPartial(embed: Embed): Partial<Embed> {
	return clearEmptySlots(embed);
}

export function toEmbed(json:any) {
	const embed: Embed = {
		author: {
			name: json.embed.author.name,
			url: "https://en.wikipedia.org/wiki/Fox",
			iconUrl: `X/img/fox1.jpg`
		},
		title: "Foxes are cool!",
		url: "https://en.wikipedia.org/wiki/Fox",
		description: "Foxes are small-to-medium-sized omnivorous mammals belonging to several genera of the family Canidae. They have a flattened skull; upright, triangular ears; a pointed, slightly upturned snout; and a long, bushy tail (\"brush\").\n[Read more about foxes](https://en.wikipedia.org/wiki/Fox)\n\n**Using mentions:**\n<@123>, <@!123>, <#123>, <@&123>, @here, @everyone \n```\nSimple Code Block\n```",
		color: "#ff0000",
		fields: [
			{
				name: "Field #1",
				value: "Content of Field #1",
				inline: true
			},
			{
				name: "Field #2",
				value: "Content of Field #2",
				inline: true
			}
		],
		image: `X/img/fox2.jpg`,
		thumbnail: `X/img/fox.jpg`,
		footer: {
			text: "Yes, this is all about foxes!",
			iconUrl: `X/img/fox_emoji.png`,
		},
		timestamp: moment().unix()
	};
	return embed;
}

export function embedToObjectCode(em: Embed, varData: Variable[], removeKeyQuotes = true) : string {

	var cont : outputData = {
		embed: em,
		variables: varData
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
		if (objectCode)
			key = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
		if (typeof value === "object") {
			const cleared = clearEmptySlots(value, objectCode);

			if (Object.keys(cleared).length === 0) return acc;

			// @ts-expect-error
			acc[key] = cleared;
		} else if (value) {
			// @ts-expect-error
			acc[key] = objectCode
				? key === "image" || key === "thumbnail"
					? { url: value }
					: value
				: value;
		}
		return acc;
	}, {});
}
