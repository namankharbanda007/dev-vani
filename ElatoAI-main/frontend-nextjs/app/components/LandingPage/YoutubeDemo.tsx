"use client";

import React from "react";

interface YoutubeDemoProps {
	caption: string;
}


export default function YoutubeDemo({ caption }: YoutubeDemoProps) {
	return <div className="w-full max-w-3xl mx-auto">
		<div className="relative" style={{ paddingBottom: '56.25%' }}>
			<iframe
				className="absolute top-0 left-0 w-full h-full rounded-xl shadow-lg"
				src="https://player.vimeo.com/video/1141098837?badge=0&autopause=0&player_id=0&app_id=58479"
				title="SMART मूर्ति Demo"
				allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
				allowFullScreen
			/>
		</div>
		<p className="text-center text-gray-600 mt-4 text-lg">{caption}</p>
	</div>
}