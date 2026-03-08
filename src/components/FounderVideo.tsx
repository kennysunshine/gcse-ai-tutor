'use client'

import { useState, useRef } from 'react'
import { Play } from 'lucide-react'

export function FounderVideo() {
    const [isPlaying, setIsPlaying] = useState(false)
    const videoRef = useRef<HTMLVideoElement>(null)

    const handlePlay = () => {
        if (videoRef.current) {
            videoRef.current.play()
            setIsPlaying(true)
        }
    }

    return (
        <div className="py-8 relative z-20">
            <div
                className="aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 relative group cursor-pointer"
                onClick={handlePlay}
            >
                {!isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-all group-hover:bg-black/30 z-10 transition-opacity duration-300">
                        <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                            <Play className="w-6 h-6 text-primary ml-1" />
                        </div>
                    </div>
                )}
                <video
                    ref={videoRef}
                    className="w-full h-full object-contain"
                    controls={isPlaying}
                    poster="/founder-placeholder.jpg"
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                >
                    <source src="https://www.dropbox.com/scl/fi/7s1ku2tcqfsvzk2jz4u65/founder-pitch.mp4?rlkey=ugslyfd2nfxjoxl9dqm1ih2j5&st=jmy1p72d&raw=1" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-4 font-medium italic">Hear the mission firsthand</p>
        </div>
    )
}
