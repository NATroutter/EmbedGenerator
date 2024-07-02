import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

import DiscordEmbed from "../components/DiscordEmbed";
import LimitedInput from "../components/LimitedInput";
import Output from "../components/Output";
import ValueInput from "../components/ValueInput";
import { Embed, EmbedField, Variable } from '../lib/interfaces';
import moment from 'moment';

function ellipses(str: string, max = 50) {
	return str.length > max ? `${str.slice(0, max - 3)}...` : str;
}

function button(type: "blue" | "red" | "disabled" = "blue") {
	return `font-medium py-1 px-2 rounded transition ${
		type === "blue"
			? "bg-[#5865f2] hover:bg-[#4752c4] text-white"
			: type === "red"
			? "bg-[#d83c3e] hover:bg-[#a12d2f] text-white"
			: "bg-[#4f545c] cursor-not-allowed"
	}`;
}

function setAllDetails(open: boolean) {
	for (const details of Array.from(
		document.getElementsByTagName("details")
	)) {
		details.open = open;
	}
}

const defaultVariables : Variable[] = [
	{
		name: "var1",
		value: "Foxes are cute!"
	}
]

export default function Home() {
	const [authorIcon, setAuthorIcon] = useState("");
	const [authorName, setAuthorName] = useState("");
	const [authorUrl, setAuthorUrl] = useState("");

	const [title, setTitle] = useState("");
	const [url, setUrl] = useState("");
	const [description, setDescription] = useState("");
	const [color, setColor] = useState("#202225");
	const [colorEnabled, setColorEnabled] = useState(true);

	const [fields, setFields] = useState<EmbedField[]>([]);
	const [variables, setVariables] = useState<Variable[]>([]);

	const [image, setImage] = useState("");
	const [thumbnail, setThumbnail] = useState("");

	const [footerText, setFooterText] = useState("");
	const [footerIcon, setFooterIcon] = useState("");
	const [timestamp, setTimestamp] = useState<number | undefined>(undefined);

	const [embedLoaded, setEmbedLoaded] = useState(false);
	const [variablesLoaded, setVariablesLoaded] = useState(false);
	const [variableFormat, setVariableFormat] = useState<string>("{@}");
	const [error, setError] = useState<string | undefined>(undefined);
	const router = useRouter();
	const [rootUrl, setRootUrl] = useState('');
	const [infoEmbed, setInfoEmbed] = useState<Embed>();

	const fileInput = useRef<HTMLInputElement>(null);


	useEffect(() => {
		const initializeEmbed = async () => {
			const protocol = window.location.protocol;
			const host = window.location.host;
			const newRootUrl = `${protocol}//${host}`;
			setRootUrl(newRootUrl);

			const embedTemplate: Embed = {
				author: {
				name: "Mr. Fox",
				url: "https://en.wikipedia.org/wiki/Fox",
				iconUrl: `${newRootUrl}/img/fox1.jpg`
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
				image: `${newRootUrl}/img/fox2.jpg`,
				thumbnail: `${newRootUrl}/img/fox.jpg`,
				footer: {
				text: "Yes, this is all about foxes!",
				iconUrl: `${newRootUrl}/img/fox_emoji.png`,
				},
				timestamp: moment().unix()
			};
			setInfoEmbed(embedTemplate);
		};
		initializeEmbed();
	}, []);

	useEffect(() => {
		const initializeEmbed = async () => {
		const protocol = window.location.protocol;
		const host = window.location.host;
		const newRootUrl = `${protocol}//${host}`;
		setRootUrl(newRootUrl);

		const embedTemplate: Embed = {
			author: {
			name: "Mr. Fox",
			url: "https://en.wikipedia.org/wiki/Fox",
			iconUrl: `${newRootUrl}/img/fox1.jpg`
			},
			title: "Foxes are cool!",
			url: "https://en.wikipedia.org/wiki/Fox",
			description: "Foxes are small-to-medium-sized omnivorous mammals belonging to several genera of the family Canidae. They have a flattened skull; upright, triangular ears; a pointed, slightly upturned snout; and a long, bushy tail (\"brush\").\n[Read more about foxes](https://en.wikipedia.org/wiki/Fox)\n\n**Using placeholders:**\nVar1: {var1}\n\n**Using mentions:**\n<@123>, <@!123>, <#123>, <@&123>, @here, @everyone \n```\nSimple Code Block\n```",
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
			image: `${newRootUrl}/img/fox2.jpg`,
			thumbnail: `${newRootUrl}/img/fox.jpg`,
			footer: {
			text: "Yes, this is all about foxes!",
			iconUrl: `${newRootUrl}/img/fox_emoji.png`,
			},
			timestamp: moment().unix()
		};
		setInfoEmbed(embedTemplate);
		};

		initializeEmbed();
	}, []);

	useEffect(() => {
		const loadEmbedData = async () => {
			if (!infoEmbed) return;
			if (!embedLoaded) {
				loadEmbed(infoEmbed);
				setEmbedLoaded(true);
			}
		};
		loadEmbedData();
	}, [router.isReady, infoEmbed, router, embedLoaded]);

	useEffect(() => {
		const loadVaraibleData = async () => {
			if (!defaultVariables) return;
			if (!variablesLoaded) {
				loadVariables(defaultVariables);
				setVariablesLoaded(true);
			}
		};
		loadVaraibleData();
	}, [router, variables, variablesLoaded]);

	useEffect(() => {
		const totalCharacters =
			title.length +
			description.length +
			fields.reduce((acc, cur) => acc + cur.name.length + cur.value.length, 0) +
			footerText.length +
			authorName.length;

		if (totalCharacters > 6000) {
			setError("The total number of characters in the embed content must not exceed 6000!");
		} else {
			setError(""); // Clear the error if no issues
		}
	}, [title, description, fields, footerText, authorName]);

	useEffect(() => {
		if (!variableFormat.includes("@")) {
			setError("Placeholder format must contain @");
			return;
		}
		if (variableFormat.startsWith("@")) {
			setError("Placeholder format can't start with @");
			return;
		}
		if (variableFormat.endsWith("@")) {
			setError("Placeholder format can't end with' @");
			return;
		}

		let count = 0;
		for (let i = 0; i < variableFormat.length; i++) {
			if (variableFormat.charAt(i) === "@") {
				count++;
			}
		}
		if (count > 1) {
			setError("Placeholder format can only contain one @");
			return;
		}

		setError("");

	}, [variableFormat]);

	useEffect(() => {
		const nameCount: { [key: string]: number } = {};
		let hasDuplicates = false;

		// Count occurrences of each name
		for (const entry of variables) {
			if (nameCount[entry.name]) {
				nameCount[entry.name]++;
			} else {
				nameCount[entry.name] = 1;
			}
		}

		// Check for duplicates
		for (const name in nameCount) {
			if (nameCount[name] > 1) {
				hasDuplicates = true;
				break;
			}
		}

		// Set error if duplicates are found
		if (hasDuplicates) {
			setError("Duplicate placeholder names found!");
		} else if (variables[0] != undefined && variables[0].name.length > 10) {
			setError("Placeholder error!");
		} else {
			setError(""); // Clear the error if no issues
		}
	}, [variables]);

	function getRandom(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

		const handleFileChange = () => {
		const file = fileInput.current?.files?.[0];
		if (file && file.type === "application/json") {
			const reader = new FileReader();
			reader.onload = () => {
				var data : string | undefined = reader.result?.toString();
				if (data === undefined) {
					setError("Invalid file content!")
					return;
				}
				try {
					var json = JSON.parse(data)
					loadJson(json);
				} catch(err) {
					setError("Invalid Json!")
				}


			};
			reader.readAsText(file);
		}
	};
	function isValid(value : any) : boolean {
		return (value !== undefined && value !== null && String(value).length > 0)
	}
	function loadJson(data : any) {
		var embed = data.embed;
		var vars = data.variables

		setAuthorIcon(embed?.author?.iconUrl ?? "");
		setAuthorName(embed?.author?.name ?? "");
		setAuthorUrl(embed?.author?.url ?? "");

		setTitle(embed?.title ?? "");
		setUrl(embed?.url ?? "");
		setDescription(embed?.description ?? "");

		if (isValid(embed?.fields)) {
			setFields(embed.fields
			.map((e:EmbedField) => ({
				name: e.name?.trim() ?? undefined,
				value: e.value?.trim() ?? undefined
			})).filter((e:EmbedField) => e.name !== undefined && e.value !== undefined));
		} else {
			setFields([])
		}

		setImage(embed?.image?.url ?? "");
		setThumbnail(embed?.thumbnail?.url ?? "");

		if (embed?.color) setColor(embed?.color);
		setColorEnabled(embed?.color !== undefined);

		setFooterText(embed?.footer?.text ?? "");
		setFooterIcon(embed?.footer?.iconUrl ?? "");

		setTimestamp(embed?.timestamp);

		if (isValid(vars)) {
			setVariables(vars
			.map((e:Variable) => ({
				name: e.name?.trim() ?? undefined,
				value: e.value?.trim() ?? undefined
			})).filter((e:Variable) => e.name !== undefined && e.value !== undefined));
		} else {
			setVariables([])
		}

		setEmbedLoaded(true);
		setVariablesLoaded(true);
	}

	function loadVariables(vars: Variable[]) {
		setVariables(vars);
		setVariablesLoaded(true);
	}

	function loadEmbed(embed: Embed) {
		setAuthorIcon(embed.author?.iconUrl ?? "");
		setAuthorName(embed.author?.name ?? "");
		setAuthorUrl(embed.author?.url ?? "");

		setTitle(embed.title ?? "");
		setUrl(embed.url ?? "");
		setDescription(embed.description ?? "");

		setFields(embed.fields ?? []);

		setImage(embed.image ?? "");
		setThumbnail(embed.thumbnail ?? "");

		if (embed.color) setColor(embed.color);
		setColorEnabled(embed.color !== undefined);

		setFooterText(embed.footer?.text ?? "");
		setFooterIcon(embed.footer?.iconUrl ?? "");

		setTimestamp(embed.timestamp);

		setEmbedLoaded(true);
	}

	function replaceVar(entry: string, variable: Variable) : string {
		var format = variableFormat.replace("@",variable.name);
		return entry.replace(format, variable.value);
	}

	function replaceVars(entry: string) : string {
		var newEntry = structuredClone(entry);
		for(const variable of variables) {
			newEntry = replaceVar(newEntry, variable);
		}
		return newEntry;
	}

	function repalceVars(embed: Embed) : Embed {
		const newEmbed = structuredClone(embed);

		for(const entry of variables) {

			newEmbed.author.name = replaceVar(newEmbed.author.name, entry);
			newEmbed.author.iconUrl = replaceVar(newEmbed.author.iconUrl, entry);
			newEmbed.author.url = replaceVar(newEmbed.author.url, entry);

			newEmbed.title = replaceVar(newEmbed.title, entry);
			newEmbed.url = replaceVar(newEmbed.url, entry);
			newEmbed.description = replaceVar(newEmbed.description, entry);

			for (var field of newEmbed.fields) {
				field.name = replaceVar(field.name, entry);
				field.value = replaceVar(field.value, entry);
			}

			newEmbed.image = replaceVar(newEmbed.image, entry);
			newEmbed.thumbnail = replaceVar(newEmbed.thumbnail, entry);

			newEmbed.footer.text = replaceVar(newEmbed.footer.text, entry);
			newEmbed.footer.iconUrl = replaceVar(newEmbed.footer.iconUrl, entry);

		}
		return newEmbed;
	}

	function formatTimestamp() : string { // value="2024-07-02T10:00"
		var time : number = timestamp !== undefined ? timestamp : moment().unix();

        return moment.unix(time).format("YYYY-MM-DDTHH:mm");
    }

	const embed: Embed = {
		author: {
			name: authorName.trim(),
			iconUrl: authorIcon.trim(),
			url: authorUrl.trim()
		},
		title: title.trim(),
		url: url.trim(),
		description: description.trim(),
		fields: fields.map(field => ({
			name: field.name.trim(),
			value: field.value.trim(),
			inline: field.inline
		})),
		image: image.trim(),
		thumbnail: thumbnail.trim(),
		color: colorEnabled ? color : undefined,
		footer: {
			text: footerText.trim(),
			iconUrl: footerIcon.trim()
		},
		timestamp
	};

	return (
		<div className="screen flex min-h-screen">
			<div className="flex-1 embed-inputs">
				<div>
					<div className="flex justify-between items-baseline">
						<h1 className="text-white font-semibold text-2xl">
							Discord Embed Generator
						</h1>
					</div>

					<div className="flex mt-2 gap-2">
						<button
							type="button"
							onClick={() => {
								setAllDetails(false);
								setAuthorName("");
								setAuthorIcon("");
								setAuthorUrl("");
								setTitle("");
								setUrl("");
								setDescription("");
								setFields([]);
								setVariables([]);
								setImage("");
								setThumbnail("");
								setColorEnabled(false);
								setFooterText("");
								setFooterIcon("");
								setTimestamp(undefined);
								setError(undefined);
							}}
							className={button("red")}
						>
							Clear All
						</button>

						<button
							type="button"
							onClick={() => setAllDetails(true)}
							className={button()}
						>
							Expand All
						</button>
						<button
							type="button"
							onClick={() => setAllDetails(false)}
							className={button()}
						>
							Collapse All
						</button>

						<input type="file" hidden accept="application/json" ref={fileInput} onChange={handleFileChange} />
						<button
							type="button"
							onClick={() => fileInput.current?.click()}
							className={button()}
						>
							Import
						</button>

					</div>
				</div>

				{error ? (
					<div className="px-4 py-2 rounded bg-[#d83c3e] font-semibold text-white">
						{error}
					</div>
				) : null}

				<details open className="variables">
					<summary>
							<h2>Placeholders &ndash; {variables.length}</h2>
					</summary>
					<div className="variable-info">
						<h2 className="variable-info-title">What are placeholders?</h2>
						<p className="variable-info-text">Placeholders are meant to be used as the name suggests, as a placeholder for different things. For example, you can have a placeholder &#123;name&#125; that has the value &#34;fox&#34;. Then you can use the placeholder &#123;name&#125; in descriptions, etc. You will see how it looks in the embed, but the final embed code has the placeholder, and then you can parse it in the final program where this JSON is being used.</p>
					</div>
					<div className="variable-info">
						<h2 className="variable-info-title">Placeholder Format:</h2>
						<p className="variable-info-text">This is the format how variables are formated in code and how they should be used</p>
						<p className="variable-info-text">@ = Varaible name, will be repalced in final formating</p>
						<LimitedInput
							limit={10}
							required={true}
							type="text"
							id={`variable-format`}
							value={variableFormat}
							onChange={e => {
								setVariableFormat(e.target.value.toLowerCase());
							}}
						/>
					</div>
					{variables.map((varaible, index) => (
						<details key={index}>
							<p>{varaible.name.length > 0 ? "Usage: " +variableFormat.replace("@",varaible.name) : ""}</p>
							<summary>
								<h3 className="text-white font-semibold mr-auto">
									Palceholder: {varaible.name}
								</h3>
								<button
									onClick={() => {
										setVariables(
											variables.filter((_, i) => i !== index)
										);
									}}
									className={button("red")}
								>
									Delete
								</button>
							</summary>
							<div>
								<label htmlFor={`variable-name-${index}`}>
									Name
								</label>
								<LimitedInput
									limit={10}
									required={true}
									type="text"
									id={`variable-name-${index}`}
									value={varaible.name}
									onChange={e => {
										const newVar = [...variables];
										newVar[index].name = e.target.value.toLowerCase();
										setVariables(newVar);
									}}
								/>
							</div>
							<div>
								<label htmlFor={`variable-value-${index}`}>
									Value
								</label>
								<LimitedInput
									limit={1024}
									required={true}
									type="text"
									id={`variable-value-${index}`}
									value={varaible.value}
									onChange={e => {
										const newVar = [...variables];
										newVar[index].value = e.target.value;
										setVariables(newVar);
									}}
								/>
							</div>
						</details>
					))}
					<button
						type="button"
						onClick={() => {
							if (variables.length < 25)
								setVariables([
									...variables,
									{
										name: "ph-" + getRandom(1000,9000),
										value: "Foxes are cute!"
									}
								]);
						}}
						className={`mt-4 ${button(
							variables.length < 25 ? "blue" : "disabled"
						)}`}
					>
						Add Palceholder
					</button>
				</details>
				<details open>
					<summary>
						<h2>
							Author
						</h2>
					</summary>
					<ValueInput
						label="Author Name"
						value={[authorName, setAuthorName]}
						limit={256}
					/>
					<ValueInput
						label="Author URL"
						value={[authorUrl, setAuthorUrl]}
					/>
					<ValueInput
						label="Author Icon URL"
						value={[authorIcon, setAuthorIcon]}
					/>
				</details>
				<details open>
					<summary>
						<h2>
							Body
						</h2>
					</summary>
					<ValueInput
						label="Title"
						value={[title, setTitle]}
						limit={256}
					/>
					<ValueInput label="Title URL" value={[url, setUrl]} />
					<ValueInput
						label="Description"
						value={[description, setDescription]}
						limit={4096}
						textarea={true}
					/>
					<div className="flex items-center gap-2">
						<label htmlFor="color">Color</label>
						<input
							type="color"
							id="color"
							value={color}
							onChange={e => setColor(e.target.value)}
							disabled={!colorEnabled}
							className="mt-2"
						/>
						<label
							htmlFor="color-enabled"
							className="text-sm text-white ml-2"
						>
							Enabled?
						</label>
						<input
							type="checkbox"
							checked={colorEnabled}
							id="color-enabled"
							value={color}
							onChange={e => setColorEnabled(!colorEnabled)}
							className="mt-2"
						/>
					</div>
				</details>
				<details open className="fields">
					<summary>
						<h2>Fields &ndash; {fields.length}</h2>
					</summary>
					{fields.map((field, index) => (
						<details key={index}>
							<summary>
								<h3 className="text-white font-semibold mr-auto">
									{ellipses(replaceVars(field.name))}
								</h3>
								<button
									onClick={() => {
										if (index === 0) return;
										const newFields = [...fields];
										[
											newFields[index - 1],
											newFields[index]
										] = [
											newFields[index],
											newFields[index - 1]
										];
										setFields(newFields);
									}}
									className={button(
										"blue"
									)}
								>
									UP
								</button>
								<button
									onClick={() => {
										if (index === fields.length - 1) return;
										const newFields = [...fields];
										[
											newFields[index + 1],
											newFields[index]
										] = [
											newFields[index],
											newFields[index + 1]
										];
										setFields(newFields);
									}}
									className={button(
										"blue"
									)}
								>
									Down
								</button>
								<button
									onClick={() => {
										setFields(
											fields.filter((_, i) => i !== index)
										);
									}}
									className={button("red")}
								>
									Delete
								</button>
							</summary>
							<div>
								<label htmlFor={`field-name-${index}`}>
									Name
								</label>
								<LimitedInput
									limit={256}
									required={true}
									type="text"
									id={`field-name-${index}`}
									value={field.name}
									onChange={e => {
										const newFields = [...fields];
										newFields[index].name = e.target.value;
										setFields(newFields);
									}}
								/>
							</div>
							<div>
								<label htmlFor={`field-value-${index}`}>
									Value
								</label>
								<LimitedInput
									limit={1024}
									required={true}
									textarea={true}
									id={`field-value-${index}`}
									value={field.value}
									onChange={e => {
										const newFields = [...fields];
										newFields[index].value = e.target.value;
										setFields(newFields);
									}}
								/>
							</div>
							<div className="flex items-center justify-start gap-2">
								<label htmlFor={`field-inline-${index}`}>
									Inline
								</label>
								<input
									type="checkbox"
									id={`field-inline-${index}`}
									checked={field.inline}
									onChange={e => {
										const newFields = [...fields];
										newFields[index].inline =
											e.target.checked;
										setFields(newFields);
									}}
									className="mt-2"
								/>
							</div>
						</details>
					))}
					<button
						type="button"
						onClick={() => {
							if (fields.length < 25)
								setFields([
									...fields,
									{
										name: "A New Field",
										value: "",
										inline: false
									}
								]);
						}}
						className={`mt-4 ${button(
							fields.length < 25 ? "blue" : "disabled"
						)}`}
					>
						Add Field
					</button>
				</details>
				<details open>
					<summary>
						<h2>Images</h2>
					</summary>
					<ValueInput label="Image URL" value={[image, setImage]} />
					<ValueInput
						label="Thumbnail URL"
						value={[thumbnail, setThumbnail]}
					/>
				</details>
				<details open>
					<summary>
						<h2>
							Footer
						</h2>
					</summary>
					<ValueInput
						label="Footer Text"
						value={[footerText, setFooterText]}
						limit={2048}
					/>
					<ValueInput
						label="Footer Icon URL"
						value={[footerIcon, setFooterIcon]}
					/>
					<label>
						Timestamp
					</label>
					<LimitedInput
						limit={100}
						required={true}
						type="datetime-local"
						min="1971-01-01"
						max="2100-01-01"
						value={formatTimestamp()}
						onChange={e => {
							setTimestamp(moment(e.target.value).unix());
						}}
					/>
				</details>
			</div>

			<div className="flex-1 bg-[#36393f] p-8">

				<DiscordEmbed embed={repalceVars(embed)} />

				<Output embed={embed} variables={variables} />
			</div>
		</div>
	);
}
