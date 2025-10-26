"use client";

import React from "react";

interface YoutubeDemoProps {
    caption: string;
}


export default function YoutubeDemo({ caption }: YoutubeDemoProps) {
    return <div className="w-full max-w-3xl mx-auto">
	<div className="relative" style={{ paddingBottom: '16.25%' }}>
	  <img
        className="w-full h-auto rounded-xl shadow-lg"
        src="https://trustpilotreview.shop/wp-content/uploads/2025/10/Screenshot-2025-10-26-143940.png"
        alt="SMART मूर्ति YouTube Demo"
      />
	</div>
	<p className="text-center text-gray-600 mt-4 text-lg">{caption}</p>
  </div>
}