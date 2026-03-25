/**
 * Shared audio utilities for Smart Murti live sessions.
 */

/**
 * Resample 16-bit PCM audio from one sample rate to another using linear interpolation.
 */
export function downsamplePcm16(
  inputBytes: Uint8Array,
  inputRate: number,
  outputRate: number
): Uint8Array {
  if (inputRate === outputRate) {
    return inputBytes;
  }

  const inputSamples = new Int16Array(
    inputBytes.buffer,
    inputBytes.byteOffset,
    Math.floor(inputBytes.byteLength / 2)
  );
  const outputLength = Math.max(
    1,
    Math.round((inputSamples.length * outputRate) / inputRate)
  );
  const outputSamples = new Int16Array(outputLength);

  for (let index = 0; index < outputLength; index += 1) {
    const sourcePosition = (index * inputRate) / outputRate;
    const leftIndex = Math.floor(sourcePosition);
    const rightIndex = Math.min(leftIndex + 1, inputSamples.length - 1);
    const blend = sourcePosition - leftIndex;
    const left = inputSamples[leftIndex] || 0;
    const right = inputSamples[rightIndex] || left;
    outputSamples[index] = Math.round(left + (right - left) * blend);
  }

  return new Uint8Array(outputSamples.buffer);
}

/**
 * Clamp an audio level value between a floor and 1.
 */
export function clampAudioLevel(level: number, floor = 0.04): number {
  return Math.max(floor, Math.min(1, level));
}
