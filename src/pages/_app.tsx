import "../styles/globals.scss";

import type { AppProps } from "next/app";
import Head from "next/head";
import { useEffect, useState } from "react";

export default function EmbedGenerator({ Component, pageProps }: AppProps) {
	const title = "Discord Embed Generator";
	const description = "A tool to build Discord embeds as json to be used in different projects";

	const [win, setWindow] = useState<Window>();

	useEffect(() => {
		setWindow(window);
	}, []);

	return (
		<>
			<Head>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />

				<title>{title}</title>
				<meta property="og:title" content={title} />
				<meta property="og:description" content={description} />
				<meta property="og:image" content="/assets/img/emg.png"/>
				<meta property="og:image:secure_url" content="/assets/img/emg.png"/>
				<meta property="og:type" content="website"/>
				<meta property="og:site_name" content={win?.location.host}/>

				<meta name="description" content={description} />

				<link rel="apple-touch-icon" sizes="180x180" href="/assets/icons/apple-touch-icon.png?v=1"/>
				<link rel="icon" type="image/png" sizes="32x32" href="/assets/icons/favicon-32x32.png?v=1"/>
				<link rel="icon" type="image/png" sizes="16x16" href="/assets/icons/favicon-16x16.png?v=1"/>
				<link rel="manifest" href="/assets/icons/site.webmanifest?v=1"/>
				<link rel="mask-icon" href="/assets/icons/safari-pinned-tab.svg?v=1" color="#414141"/>
				<link rel="shortcut icon" href="/assets/icons/favicon.ico?v=1"/>
				<meta name="msapplication-TileColor" content="#414141"/>
				<meta name="msapplication-config" content="/assets/icons/browserconfig.xml?v=1"/>
				<meta name="theme-color" content="#414141"/>
			</Head>
			<Component {...pageProps} />
		</>
	);
}
