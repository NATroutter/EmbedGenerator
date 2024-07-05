import { useState } from "react";

import type { Embed, Placeholder } from "../lib/interfaces";
import { embedToObjectCode } from "../lib/utils";
import Highlight from "./Highlight";

function s(strings: TemplateStringsArray, ...values: unknown[]) {
	let escaped = "";

	for (let i = 0; i < strings.length; i++) {
		if (i > 0) {
			escaped += JSON.stringify(`${values[i - 1]}`);
		}
		escaped += strings[i];
	}

	return escaped;
}

export default function Output({ embed, placeholders, errors }: { embed: Embed, placeholders: Placeholder[], errors: string | undefined }) {
	const [language, setLanguage] = useState<"json">("json");

	if (errors !== undefined) {
		return (
			<div className="mt-8">
			</div>
		);
	}

	let output = embedToObjectCode(embed, placeholders, false);

	return (
		<div className="mt-8">
			<h2 className="text-xl font-semibold text-white">Output</h2>

			<Highlight className="rounded text-sm">
				{output}
			</Highlight>
		</div>
	);
}
