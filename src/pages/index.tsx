import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

import LimitedInput from "../components/LimitedInput";
import Output from "../components/Output";
import ValueInput from "../components/ValueInput";
import { Embed, EmbedField, Placeholder } from '../lib/interfaces';
import moment from 'moment';
import { embedToObjectCode } from '../lib/utils';
import EmbedBase from "../components/EmbedBase";
import DiscordEmbed from "../components/DiscordEmbed";
import ExportButton from "../components/buttons/ExportButton";
import ImportButton, { FileTypes } from "../components/buttons/ImportButton";
import BasicButton from "../components/buttons/BasicButton";
import CopyButton from "../components/buttons/CopyButton";

function ellipses(str: string, max = 50) {
	return str.length > max ? `${str.slice(0, max - 3)}...` : str;
}

function button(type: "red" | "disabled" = "red") {
	return `font-medium py-1 px-2 rounded transition ${type === "red"
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


const defaultVariables : Placeholder[] = [
	{
		name: "ph1",
		value: "Foxes are so adorable <3"
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
	const [fieldIndex, setFieldIndex] = useState<number>(2);

	const [placeholders, setPlaceholder] = useState<Placeholder[]>([]);
	const [placeholdersLoaded, setPlaceholdersLoaded] = useState(false);
	const [placeholderFormat, setVariableFormat] = useState<string>("{@}");

	const [image, setImage] = useState("");
	const [thumbnail, setThumbnail] = useState("");

	const [footerText, setFooterText] = useState("");
	const [footerIcon, setFooterIcon] = useState("");
	const [timestamp, setTimestamp] = useState<number | undefined>(undefined);
	const [useCurrentTime, setUseCurrentTime] = useState<boolean>(false);

	const [embedLoaded, setEmbedLoaded] = useState(false);
	const [error, setError] = useState<string | undefined>(undefined);
	const router = useRouter();
	const [infoEmbed, setInfoEmbed] = useState<Embed>();

	useEffect(() => {
		const initializeEmbed = async () => {
		const protocol = window.location.protocol;
		const host = window.location.host;
		const newRootUrl = `${protocol}//${host}`;

		const embedTemplate: Embed = {
			author: {
			name: "Mr. Fox",
			url: "https://en.wikipedia.org/wiki/Fox",
			iconUrl: `${newRootUrl}/assets/img/foxes/fox1.jpg`
			},
			title: "Vulpine Charm: The Unrivaled Cuteness of Foxes",
			url: `${newRootUrl}/fox`,
			description: "Russet fur and twinkling eyes, A bushy tail, such a prize. Pointy ears and button nose, The fox's charm forever grows.\n\nPlayful pounce and sly grin, Their cuteness makes our hearts give in. No creature matches their allure, The fox's adorable nature pure.\n\nIn forests, fields, or urban space, They captivate with vulpine grace. Of all Earth's creatures, great and small, The fox stands cutest of them all.\n\n**Using placeholders:**\nPH1: {ph1}\n\n**Using mentions:**\n<@123>, <@!123>, <#123>, <@&123>, @here, @everyone \n```\npublic class Program extends FoxLib {\n    public static void main(String[] args) {\n        printLn(\"Foxes are super cute!\");\n    }\n}\n```",
			color: "#ff0000",
			fields: [
			{
				name: "Field #1",
				value: "Content of Field #1",
				inline: true,
				blank: false
			},
			{
				name: "Field #2",
				value: "Content of Field #2",
				inline: true,
				blank: false
			}
			],
			image: `${newRootUrl}/assets/img/foxes/fox2.jpg`,
			thumbnail: `${newRootUrl}/assets/img/foxes/fox.jpg`,
			footer: {
			text: "Yes, this is all about foxes!",
			iconUrl: `${newRootUrl}/assets/img/foxes/fox_emoji.png`,
			},
			timestamp: moment().unix(),
			useCurrentTime: false
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
			if (!placeholdersLoaded) {
				loadVariables(defaultVariables);
				setPlaceholdersLoaded(true);
			}
		};
		loadVaraibleData();
	}, [router, placeholders, placeholdersLoaded]);

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
			setError(undefined); // Clear the error if no issues
		}
	}, [title, description, fields, footerText, authorName]);

	useEffect(() => {
		if (!placeholderFormat.includes("@")) {
			setError("Placeholder format must contain @");
			return;
		}
		if (placeholderFormat.startsWith("@")) {
			setError("Placeholder format can't start with @");
			return;
		}
		if (placeholderFormat.endsWith("@")) {
			setError("Placeholder format can't end with' @");
			return;
		}

		let count = 0;
		for (let i = 0; i < placeholderFormat.length; i++) {
			if (placeholderFormat.charAt(i) === "@") {
				count++;
			}
		}
		if (count > 1) {
			setError("Placeholder format can only contain one @");
			return;
		}

		setError(undefined);

	}, [placeholderFormat]);

	useEffect(() => {
		const nameCount: { [key: string]: number } = {};
		let hasDuplicates = false;

		// Count occurrences of each name
		for (const entry of placeholders) {
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
		} else if (placeholders[0] != undefined && placeholders[0].name.length > 10) {
			setError("Placeholder error!");
		} else {
			setError(undefined); // Clear the error if no issues
		}
	}, [placeholders]);

	function getRandom(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

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
				value: e.value?.trim() ?? undefined,
				inline: e.inline ?? false,
				blank: e.blank ?? false
			})).filter((e:EmbedField) => e.name !== undefined && e.value !== undefined));
		} else {
			setFields([])
		}
		setFieldIndex(embed?.fields?.length)

		setImage(embed?.image?.url ?? "");
		setThumbnail(embed?.thumbnail?.url ?? "");

		if (embed?.color) setColor(embed?.color);
		setColorEnabled(embed?.color !== undefined);

		setFooterText(embed?.footer?.text ?? "");
		setFooterIcon(embed?.footer?.iconUrl ?? "");

		setTimestamp(embed?.timestamp);
		setUseCurrentTime(embed?.useCurrentTime)

		if (isValid(vars)) {
			setPlaceholder(vars
			.map((e:Placeholder) => ({
				name: e.name?.trim() ?? undefined,
				value: e.value?.trim() ?? undefined
			})).filter((e:Placeholder) => e.name !== undefined && e.value !== undefined));
		} else {
			setPlaceholder([])
		}

		setEmbedLoaded(true);
		setPlaceholdersLoaded(true);
	}

	function loadVariables(vars: Placeholder[]) {
		setPlaceholder(vars);
		setPlaceholdersLoaded(true);
	}

	function loadEmbed(embed: Embed) {
		setAuthorIcon(embed.author?.iconUrl ?? "");
		setAuthorName(embed.author?.name ?? "");
		setAuthorUrl(embed.author?.url ?? "");

		setTitle(embed.title ?? "");
		setUrl(embed.url ?? "");
		setDescription(embed.description ?? "");

		setFields(embed.fields ?? []);
		setFieldIndex(embed?.fields.length)

		setImage(embed.image ?? "");
		setThumbnail(embed.thumbnail ?? "");

		if (embed.color) setColor(embed.color);
		setColorEnabled(embed.color !== undefined);

		setFooterText(embed.footer?.text ?? "");
		setFooterIcon(embed.footer?.iconUrl ?? "");

		setTimestamp(embed.timestamp);
		setUseCurrentTime(embed.useCurrentTime)

		setEmbedLoaded(true);
	}

	function replaceVar(entry: string, variable: Placeholder) : string {
		if (placeholderFormat.includes("@")) {
			var format = placeholderFormat.replace("@",variable.name);
			return entry.replace(format, variable.value);
		}
		return entry;
	}

	function replaceVars(entry: string) : string {
		var newEntry = structuredClone(entry);
		for(const variable of placeholders) {
			newEntry = replaceVar(newEntry, variable);
		}
		return newEntry;
	}

	function repalceVars(embed: Embed) : Embed {
		const newEmbed = structuredClone(embed);

		for(const entry of placeholders) {

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
			inline: field.inline,
			blank: field.blank
		})),
		image: image.trim(),
		thumbnail: thumbnail.trim(),
		color: colorEnabled ? color : undefined,
		footer: {
			text: footerText.trim(),
			iconUrl: footerIcon.trim()
		},
		timestamp: timestamp,
		useCurrentTime: useCurrentTime
	};

	return (
		<div className="screen flex min-h-screen">
			<div className="flex-1 embed-inputs">
				<div className="flex justify-center items-baseline title-container">
					<img className="title" src="/assets/img/title.png" alt="" />
				</div>


				{error ? (
					<div className="px-4 py-2 rounded bg-[#d83c3e] font-semibold text-white">
						{error}
					</div>
				) : null}

				<details open className="variables">
					<summary>
							<h2>Placeholders &ndash; {placeholders.length}</h2>
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
							value={placeholderFormat}
							onChange={e => {
								setVariableFormat(e.target.value.toLowerCase());
							}}
						/>
					</div>
					{placeholders.map((placeholder, index) => (
						<details key={index}>
							<p>{placeholder.name.length > 0 ? "Usage: " +placeholderFormat.replace("@",placeholder.name) : ""}</p>
							<summary>
								<h3 className="text-white font-semibold mr-auto">
									Palceholder: {placeholder.name}
								</h3>
								<button
									onClick={() => {
										setPlaceholder(
											placeholders.filter((_, i) => i !== index)
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
									value={placeholder.name}
									onChange={e => {
										const newVar = [...placeholders];
										newVar[index].name = e.target.value.toLowerCase();
										setPlaceholder(newVar);
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
									value={placeholder.value}
									onChange={e => {
										const newVar = [...placeholders];
										newVar[index].value = e.target.value;
										setPlaceholder(newVar);
									}}
								/>
							</div>
						</details>
					))}
					<button
						type="button"
						onClick={() => {
							setPlaceholder([
								...placeholders,
								{
									name: "ph-" + getRandom(1000,9000),
									value: "Foxes are cute!"
								}
							]);
						}}
						className={`mt-4 ${button()}`}
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
									className={button()}
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
									className={button()}
								>
									Down
								</button>
								<button
									onClick={() => {
										setFields(
											fields.filter((_, i) => i !== index)
										);
									}}
									className={button()}
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
										newFields[index].inline = e.target.checked;
										setFields(newFields);
									}}
									className="mt-2"
								/>
								<label htmlFor={`field-inline-${index}`}>
									Blank
								</label>
								<input
									type="checkbox"
									checked={field.blank}
									onChange={e => {
										const newFields = [...fields];
										newFields[index].blank = e.target.checked;
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
										name: "Field #" + (fieldIndex +1),
										value: "Content of Field #" + (fieldIndex +1),
										inline: true,
										blank: false
									}
								]);
								setFieldIndex(fieldIndex+1)
						}}
						className={`mt-4 ${button(
							fields.length < 25 ? "red" : "disabled"
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
					<div className="flex items-center gap-2">
						<label htmlFor="color-enabled" className="text-sm text-white ml-2">
							Always Current Time?
						</label>
						<input
							type="checkbox"
							checked={useCurrentTime}
							id = "use-current-time"
							value={color}
							onChange={e => setUseCurrentTime(!useCurrentTime)}
							className="mt-2"
						/>
					</div>
				</details>
			</div>

			<div className="flex-1 bg-[#36393f] p-8">

				<EmbedBase embed={repalceVars(embed)} errors={error} />

				<Output embed={embed} placeholders={placeholders} errors={error} />
			</div>
		</div>
	);
}
