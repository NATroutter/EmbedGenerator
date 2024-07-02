import { useState } from "react";

import type { Embed } from "../lib/interfaces";
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

export default function Output({ embed }: { embed: Embed }) {
	const [language, setLanguage] = useState<"json">("json");
	const [jsVersion, setJsVersion] = useState("14");
	const [jsMode, setJsMode] = useState("chained");
	const [rsMode, setRsMode] = useState("variable"); // variable or closure
	const [rsFields, setRsFields] = useState("together"); // together or separate

	let output = "";

	output = embedToObjectCode(embed, false);

	return (
		<div className="mt-8">
			<h2 className="text-xl font-semibold text-white">Output</h2>

			<Highlight
				language={language === "json" ? "js" : language}
				className="rounded text-sm"
			>
				{output}
			</Highlight>
		</div>
	);
}
