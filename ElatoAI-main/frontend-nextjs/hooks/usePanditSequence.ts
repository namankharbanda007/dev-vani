import { useEffect, useRef, useState } from "react";

interface UsePanditSequenceProps {
    canvasRef: React.RefObject<HTMLCanvasElement>;
    frameCount: number;
    path: string; // e.g., "/pandit-sequence/"
    triggerRef: React.RefObject<HTMLDivElement>;
}

export function usePanditSequence({
    canvasRef,
    frameCount,
    path,
    triggerRef,
}: UsePanditSequenceProps) {
    const [progress, setProgress] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const requestRef = useRef<number>();

    useEffect(() => {
        let loadedCount = 0;
        const images: HTMLImageElement[] = [];

        const preloadImages = async () => {
            const promises = [];

            for (let i = 1; i <= frameCount; i++) {
                const promise = new Promise<void>((resolve, reject) => {
                    const img = new Image();
                    // Format: ezgif-frame-001.jpg etc.
                    const fileName = `ezgif-frame-${i.toString().padStart(3, "0")}.jpg`;
                    img.src = `${path}${fileName}`;

                    img.onload = () => {
                        loadedCount++;
                        setProgress((loadedCount / frameCount) * 100);
                        resolve();
                    };
                    img.onerror = () => {
                        console.error(`Failed to load image: ${fileName}`);
                        // Still resolve to not block the whole app, but might show glitch
                        loadedCount++;
                        setProgress((loadedCount / frameCount) * 100);
                        resolve();
                    };
                    images[i - 1] = img;
                });
                promises.push(promise);
            }

            await Promise.all(promises);
            imagesRef.current = images;
            setIsLoaded(true);

            // Draw first frame immediately after loading
            drawFrame(0);
        };

        preloadImages();

        return () => {
            // Cleanup if needed
        };
    }, [frameCount, path]);

    const drawFrame = (index: number) => {
        const canvas = canvasRef.current;
        if (!canvas || !imagesRef.current[index]) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const img = imagesRef.current[index];

        // Maintain Aspect Ratio "Contain" Logic
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const imgWidth = img.width;
        const imgHeight = img.height;

        const ratio = Math.min(canvasWidth / imgWidth, canvasHeight / imgHeight);
        const newWidth = imgWidth * ratio;
        const newHeight = imgHeight * ratio;

        // Center the image
        const offsetX = (canvasWidth - newWidth) / 2;
        const offsetY = (canvasHeight - newHeight) / 2;

        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.drawImage(img, offsetX, offsetY, newWidth, newHeight);
    };

    return { progress, isLoaded, drawFrame };
}
