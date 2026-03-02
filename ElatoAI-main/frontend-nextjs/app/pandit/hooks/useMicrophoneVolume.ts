import { useEffect, useRef } from 'react';

export function useMicrophoneVolume(stream: MediaStream | null, onSpeakingChange: (isSpeaking: boolean) => void) {
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyzerRef = useRef<AnalyserNode | null>(null);
    const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const isSpeakingRef = useRef(false);

    useEffect(() => {
        if (!stream) return;

        // Check if stream has audio tracks
        const audioTracks = stream.getAudioTracks();
        if (audioTracks.length === 0) return;

        const checkVolume = () => {
            try {
                const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
                audioContextRef.current = audioCtx;

                const analyzer = audioCtx.createAnalyser();
                analyzer.fftSize = 512;
                analyzer.minDecibels = -60;
                analyzer.maxDecibels = -10;
                analyzer.smoothingTimeConstant = 0.8;
                analyzerRef.current = analyzer;

                // We need a pristine MediaStream with ONLY the audio track for the analyzer
                const audioStream = new MediaStream([audioTracks[0]]);
                const microphone = audioCtx.createMediaStreamSource(audioStream);
                microphone.connect(analyzer);
                microphoneRef.current = microphone;

                const dataArray = new Uint8Array(analyzer.frequencyBinCount);
                let consecutiveSilence = 0;
                let consecutiveSpeech = 0;

                const update = () => {
                    if (!analyzerRef.current) return;
                    analyzerRef.current.getByteFrequencyData(dataArray);

                    let sum = 0;
                    for (let i = 0; i < dataArray.length; i++) {
                        sum += dataArray[i];
                    }
                    const average = sum / dataArray.length;

                    // Simple threshold
                    const threshold = 15; // out of 255

                    if (average > threshold) {
                        consecutiveSpeech++;
                        consecutiveSilence = 0;
                    } else {
                        consecutiveSilence++;
                        consecutiveSpeech = 0;
                    }

                    if (consecutiveSpeech > 5 && !isSpeakingRef.current) {
                        isSpeakingRef.current = true;
                        onSpeakingChange(true);
                    } else if (consecutiveSilence > 30 && isSpeakingRef.current) {
                        isSpeakingRef.current = false;
                        onSpeakingChange(false);
                    }

                    animationFrameRef.current = requestAnimationFrame(update);
                };

                update();
            } catch (err) {
                console.error("VAD Setup Error:", err);
            }
        };

        checkVolume();

        return () => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
            if (microphoneRef.current) microphoneRef.current.disconnect();
            if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
                audioContextRef.current.close().catch(console.error);
            }
            isSpeakingRef.current = false;
        };
    }, [stream, onSpeakingChange]);
}
