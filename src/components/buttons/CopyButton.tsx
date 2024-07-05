import React, { useState} from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import BasicButton from './BasicButton';

interface CopyButtonProps {
	content: string
}

export default function CopyButton({ children, content } : React.PropsWithChildren<CopyButtonProps>) {
	const [copied, setCopied] = useState(false);

	const handleCopy = () => {
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<CopyToClipboard text={content} onCopy={handleCopy}>
			<BasicButton>{copied ? 'Copied!' : children}</BasicButton>
		</CopyToClipboard>
	);
};
