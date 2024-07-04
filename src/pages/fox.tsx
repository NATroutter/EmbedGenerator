import { useState } from "react";

import HeartParticles from "../components/HeartParticles";
import RandomAudioPlayer from "../components/RandomAudioPlayer";

export default function Cute() {
	const [isHovering, setIsHovering] = useState(false);

	return (
		<div className="screen flex relative">
			<div className="absolute inset-0 bg-[url('/assets/img/forest.png')] bg-cover bg-no-repeat brightness-50">
				<div className="absolute inset-0 backdrop-blur-sm"></div>
			</div>
			<HeartParticles/>
			<div className="relative z-10 h-screen w-screen flex justify-center items-center mx-auto p-5">
				<div className="flex flex-col justify-center items-center">
					<div className="select-none w-1/2 text-center md:text-center font-bold text-xl mb-8">
						Vulpine Charm: The Unrivaled Cuteness of Foxes
					</div>
					<div className="select-none w-1/2 text-center md:text-center font-normal text-xl mb-8">
						Russet fur and twinkling eyes, A bushy tail, such a prize. Pointy ears and button nose, The fox&apos;s charm forever grows.
					</div>
					<div className="select-none w-1/2 text-center md:text-center font-normal text-xl mb-8">
						Playful pounce and sly grin, Their cuteness makes our hearts give in. No creature matches their allure, The fox&apos;s adorable nature pure.
					</div>
					<div className="select-none w-1/2 text-center md:text-center font-normal text-xl mb-8">
						In forests, fields, or urban space, They captivate with vulpine grace. Of all Earth&apos;s creatures, great and small, The fox stands cutest of them all.
					</div>
					<div className="mx-auto shadow-[0px_0px_10px_5px_rgba(0,0,0,0.5)] rounded-full transition-transform duration-300 hover:scale-110 transform-gpu"					>
						<img
							onMouseEnter={() => setIsHovering(true)}
							onMouseLeave={() => setIsHovering(false)}
							className="select-none rounded-full animate-spin [animation-duration:20s]" draggable="false" src="/assets/img/foxes/fox1.jpg" alt="Cute fox"
						/>
					</div>
					<div className="mt-10">
						<RandomAudioPlayer defaultVolume={0.1} url={[
							{url:"/assets/audio/fox1.wav", chance: 0.2},
							{url:"/assets/audio/fox2.wav", chance: 0.2},
							{url:"/assets/audio/fox3.wav", chance: 0.2},
							{url:"/assets/audio/fox4.wav", chance: 0.2},
							{url:"/assets/audio/fox5.wav", chance: 0.19},
							{url:"/assets/audio/kettu.wav", chance: 0.01}
						]} playTrigger={isHovering} stopTrigger={!isHovering} />
					</div>
				</div>
			</div>
		</div>
	);
}
