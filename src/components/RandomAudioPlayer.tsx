import React, { useState, useEffect, useRef } from "react";

const useAudio = (urls: AudioUrls[], playTrigger: boolean, stopTrigger: boolean, defaultVolume: number) => {
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const [playing, setPlaying] = useState(false);
	const [volume, setVolume] = useState(defaultVolume);
	const [userInteracted, setUserInteracted] = useState(false);

	useEffect(() => {
		const handleUserInteraction = () => {
			setUserInteracted(true);
			window.removeEventListener('click', handleUserInteraction);
		};

		window.addEventListener('click', handleUserInteraction);

		return () => {
			window.removeEventListener('click', handleUserInteraction);
		};
	}, []);


	useEffect(() => {
		const selectRandomUrl = () => {
			const totalChance = urls.reduce((sum, audio) => sum + audio.chance, 0);
			let random = Math.random() * totalChance;

			for (const audio of urls) {
				if (random < audio.chance) {
					return audio.url;
				}
				random -= audio.chance;
			}
			return urls[0].url;
		};

		audioRef.current = new Audio(selectRandomUrl());
		if (audioRef.current) {
			audioRef.current.volume = defaultVolume;
		}
		return () => {
			if (audioRef.current) {
				audioRef.current.pause();
				audioRef.current = null;
			}
		};
	}, [defaultVolume, urls]);

	useEffect(() => {
		if (audioRef.current && userInteracted) {
			if (playTrigger && !playing) {
				audioRef.current.play();
				setPlaying(true);
			} else if (stopTrigger && playing) {
				audioRef.current.pause();
				audioRef.current.currentTime = 0;
				setPlaying(false);
			}
		}
	}, [playTrigger, stopTrigger, playing, userInteracted]);

	useEffect(() => {
		if (audioRef.current) {
			audioRef.current.volume = volume;
		}
	}, [volume]);

	return { playing, volume, setVolume };
};

interface AudioUrls {
	url: string,
	chance: number;
}

interface AudioPlayerProps {
  url: AudioUrls[];
  playTrigger: boolean;
  stopTrigger: boolean;
  defaultVolume?: number;
}

export default function RandomAudioPlayer({ url, playTrigger, stopTrigger, defaultVolume = 1 }: AudioPlayerProps) {
	const { playing, volume, setVolume } = useAudio(url, playTrigger, stopTrigger, defaultVolume);

	const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setVolume(parseFloat(event.target.value));
	};

	return (
		<div>
		<input
			type="range"
			min="0"
			max="1"
			step="0.1"
			value={volume}
			onChange={handleVolumeChange}
		/>
		</div>
	);
}