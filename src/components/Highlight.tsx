import { Light } from "react-syntax-highlighter";
import json from "react-syntax-highlighter/dist/cjs/languages/hljs/json";
import { atomOneDark } from "react-syntax-highlighter/dist/cjs/styles/hljs";

Light.registerLanguage("json", json);

export default function Highlight({ children, ...props} :
	Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLPreElement>,HTMLPreElement>, "style" | "ref"> & {children: string;}) {
	return (
		<div>
			<Light language="json" style={atomOneDark} wrapLongLines {...props}>
				{children}
			</Light>
		</div>
	);
}
