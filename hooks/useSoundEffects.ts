import { useRef, useEffect, useCallback } from 'react';

export const useSoundEffects = () => {
    const audioContextRef = useRef<AudioContext | null>(null);
    const forgeLoopSourceRef = useRef<OscillatorNode | null>(null);
    const forgeLoopGainRef = useRef<GainNode | null>(null);

    useEffect(() => {
        // Initialize AudioContext on first user interaction if possible, 
        // but usually browsers require a gesture. 
        // We'll lazily init in the play functions.
        return () => {
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, []);

    const getContext = () => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        return audioContextRef.current;
    };

    const playForgeStart = useCallback(() => {
        const ctx = getContext();
        if (ctx.state === 'suspended') {
            ctx.resume();
        }

        const t = ctx.currentTime;

        // 1. Metallic Impact (high frequency noise/clang)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(150, t);
        osc.frequency.exponentialRampToValueAtTime(40, t + 0.5); // Drop in pitch

        gain.gain.setValueAtTime(0.5, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 1);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t);
        osc.stop(t + 1);

        // 2. White Noise Burst (Simulate steam/fire)
        const bufferSize = ctx.sampleRate * 0.5; // 0.5 sec
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const noiseGain = ctx.createGain();

        // Bandpass filter to make it sound like a heavy "thud"
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 1000;

        noiseGain.gain.setValueAtTime(0.8, t);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.5);

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(ctx.destination);

        noise.start(t);
    }, []);

    const startForgingLoop = useCallback(() => {
        const ctx = getContext();
        if (ctx.state === 'suspended') {
            ctx.resume();
        }

        if (forgeLoopSourceRef.current) return; // Already playing

        const t = ctx.currentTime;

        // Low rumble (Deep drone)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(50, t);

        // Modulation to make it feel "alive"
        const lfo = ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 8; // 8Hz flutter
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 10; // Modulate frequency by +/- 10Hz

        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start(t);

        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.2, t + 1); // Fade in

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);

        forgeLoopSourceRef.current = osc;
        forgeLoopGainRef.current = gain;
    }, []);

    const stopForgingLoop = useCallback(() => {
        // Ramp down gain
        if (forgeLoopGainRef.current && audioContextRef.current) {
            const t = audioContextRef.current.currentTime;
            forgeLoopGainRef.current.gain.cancelScheduledValues(t);
            forgeLoopGainRef.current.gain.setValueAtTime(forgeLoopGainRef.current.gain.value, t);
            forgeLoopGainRef.current.gain.linearRampToValueAtTime(0, t + 0.5);
        }

        // Stop oscillator after fade out
        setTimeout(() => {
            if (forgeLoopSourceRef.current) {
                forgeLoopSourceRef.current.stop();
                forgeLoopSourceRef.current.disconnect();
                forgeLoopSourceRef.current = null;
            }
            if (forgeLoopGainRef.current) {
                forgeLoopGainRef.current.disconnect();
                forgeLoopGainRef.current = null;
            }
        }, 500);
    }, []);

    const playForgeSuccess = useCallback(() => {
        const ctx = getContext();
        const t = ctx.currentTime;

        // Harmonic Chord (Progressive futuristic feel)
        const freqs = [440, 554.37, 659.25]; // A major

        freqs.forEach((f, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.value = f;

            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(0.1, t + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 2 + i * 0.5);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(t);
            osc.stop(t + 3);
        });
    }, []);

    return {
        playForgeStart,
        startForgingLoop,
        stopForgingLoop,
        playForgeSuccess
    };
};
