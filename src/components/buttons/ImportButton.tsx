import React, { useEffect, useRef } from 'react';
import BasicButton from './BasicButton';

interface ImportButtonProps {
	text: string
    allowedTypes: FileTypes[]
	onError: (msg:string)=> void
	onLoad: (msg:string)=> void
}

export enum FileTypes {
	JSON = "application/json",
	TXT = "text/plain"
}

export default function ImportButton({ text,allowedTypes,onError,onLoad } :ImportButtonProps) {

  	const fileInput = useRef<HTMLInputElement>(null);

	const allowed: String[] = Object.values(allowedTypes);

	const handleFileChange = () => {
	const file = fileInput.current?.files?.[0];
	console.log("type: " + (file !== undefined ? file.type : "null"))
	if (file && allowed.includes(file.type)) {
			const reader = new FileReader();
			reader.onload = () => {
				var data : string | undefined = reader.result?.toString();
				if (data === undefined) {
					onError("Invalid file content!")
					return;
				}
				onLoad(data)
			};
			reader.readAsText(file);
		}
	};

  return (
    <div>
      <input type="file" hidden accept={allowed.join(",")} ref={fileInput} onChange={handleFileChange} />
      <BasicButton onClick={() => fileInput.current?.click()} >{text}</BasicButton>
    </div>
  );
};
