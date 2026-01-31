import { useRef, useEffect, useCallback } from 'react';

export const useSoundEffects = () => {
    const audioContextRef = useRef<AudioContext | null>(null);
    const forgeLoopSourceRef = useRef<OscillatorNode | null>(null);
    const forgeLoopGainRef = useRef<GainNode | null>(null);
    const lastSliderSoundTime = useRef<number>(0);

    useEffect(() => {
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

    const playHover = useCallback(() => {
        const ctx = getContext();
        if (ctx.state === 'suspended') ctx.resume();
        const t = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // High tech subtle chirp
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, t);
        osc.frequency.exponentialRampToValueAtTime(1200, t + 0.05);

        gain.gain.setValueAtTime(0.02, t); // Very quiet
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.05);
    }, []);

    const playClick = useCallback(() => {
        const ctx = getContext();
        if (ctx.state === 'suspended') ctx.resume();
        const t = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Confirm blip
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, t);
        osc.frequency.exponentialRampToValueAtTime(300, t + 0.1);

        gain.gain.setValueAtTime(0.05, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.1);
    }, []);

    const playSliderChange = useCallback(() => {
        const now = Date.now();
        // Throttle: Max one click per 30ms
        if (now - lastSliderSoundTime.current < 30) return;
        lastSliderSoundTime.current = now;

        const ctx = getContext();
        if (ctx.state === 'suspended') ctx.resume();
        const t = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Mechanical ratchet click
        osc.type = 'square';
        osc.frequency.setValueAtTime(200, t);

        // Very short decay
        gain.gain.setValueAtTime(0.03, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);

        // Highpass filter to remove mud
        const filter = ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 1000;

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t);
        osc.stop(t + 0.05);
    }, []);

    const playForgeStart = useCallback(() => {
        const ctx = getContext();
        if (ctx.state === 'suspended') ctx.resume();
        const t = ctx.currentTime;

        // "Engage" Sound - Futuristic Power Up
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(110, t);
        osc.frequency.exponentialRampToValueAtTime(880, t + 0.3); // Octave sweep up

        // Filter sweep
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.Q.value = 5;
        filter.frequency.setValueAtTime(200, t);
        filter.frequency.linearRampToValueAtTime(3000, t + 0.3);

        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.2, t + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t);
        osc.stop(t + 0.4);
    }, []);

    const startForgingLoop = useCallback(() => {
        const ctx = getContext();
        if (ctx.state === 'suspended') ctx.resume();
        if (forgeLoopSourceRef.current) return;

        const t = ctx.currentTime;

        // Detailed Cyberpunk Drone
        // Base layer: Low throbbing sine
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth'; // Richer harmonics
        osc.frequency.value = 55; // Low A

        // Filter matches "energy" feel
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 200;
        filter.Q.value = 2;

        // LFO to modulate filter cutoff -> "Breathing" effect
        const lfo = ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 0.5; // Slow Pulse
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 150; // Modulate filter by +/- 150Hz

        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        lfo.start(t);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.15, t + 2); // Slow fade in

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);

        forgeLoopSourceRef.current = osc;
        forgeLoopGainRef.current = gain;
    }, []);

    const stopForgingLoop = useCallback(() => {
        if (forgeLoopGainRef.current && audioContextRef.current) {
            const t = audioContextRef.current.currentTime;
            forgeLoopGainRef.current.gain.cancelScheduledValues(t);
            forgeLoopGainRef.current.gain.setValueAtTime(forgeLoopGainRef.current.gain.value, t);
            forgeLoopGainRef.current.gain.linearRampToValueAtTime(0, t + 0.5);
        }

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

        // Computerized Data Burst
        // Rapid arpeggio
        const notes = [880, 1108, 1318, 1760]; // A5, C#6, E6, A6

        notes.forEach((f, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.value = f;

            const startTime = t + i * 0.05;

            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.1, startTime + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(startTime);
            osc.stop(startTime + 0.2);
        });
    }, []);

    return {
        playHover,
        playClick,
        playSliderChange,
        playForgeStart,
        startForgingLoop,
        stopForgingLoop,
        playForgeSuccess
    };
};
