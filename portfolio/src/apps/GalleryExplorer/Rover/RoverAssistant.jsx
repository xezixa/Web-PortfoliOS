import React, { useState, useEffect, useRef } from 'react';
import './RoverAssistant.css';

const BASE_PATH = '/rover';

const ANIMATIONS = {
    blink: { folder: '_1Idle', frameCount: 5 },
    bone: { folder: '_2Idle', frameCount: 17 },
    look: { folder: '_3Idle', frameCount: 31 },
    tap: { folder: '_4Idle', frameCount: 13 },
    pose: { folder: '_5Idle', frameCount: 18 },
    rub: { folder: '_6Idle', frameCount: 10 },
    hmm: { folder: '_7Idle', frameCount: 25 },
    hyped: { folder: '_8Idle', frameCount: 12 },
    cook: { folder: '_9Idle', frameCount: 36 },
    draw: { folder: '_10Idle', frameCount: 36 },
    ashamed: { folder: 'Ashamed', frameCount: 27 },
    come: { folder: 'Come', frameCount: 20 },
    eat: { folder: 'Eat', frameCount: 77 },
    exit: { folder: 'Exit', frameCount: 29 },
    attention: { folder: 'GetAttention', frameCount: 11 },
    haf: { folder: 'Haf', frameCount: 8 },
    lick: { folder: 'Lick', frameCount: 19 },
    read: { folder: 'Reading', frameCount: 25 },
    slap: { folder: 'Slap', frameCount: 6 },
    sleep: { folder: 'Sleep', frameCount: 8 },
    tired: { folder: 'Tired', frameCount: 13 },
    speak: { folder: 'Speak', frameCount: 15 }
};

const SEQUENCES = {
    blink: [
        { type: 'play', anim: 'blink', start: 0, end: 'max', speed: 100, loop: 1 },
        { type: 'delay', ms: 3000 }
    ],
    bone: [
        { type: 'play', anim: 'bone', start: 0, end: 13, speed: 100, loop: 1 },
        { type: 'play', anim: 'bone', start: 13, end: 14, speed: 300, loop: 10 },
        { type: 'play', anim: 'bone', start: 12, end: 0, speed: 100, loop: 1 }
    ],
    snif: [
        { type: 'play', anim: 'look', start: 0, end: 'max', speed: 100, loop: 1 }
    ],
    tap: [
        { type: 'play', anim: 'tap', start: 0, end: 5, speed: 100, loop: 1 },
        { type: 'delay', ms: 400 },
        { type: 'play', anim: 'tap', start: 6, end: 12, speed: 100, loop: 1 }
    ],
    pose: [{ type: 'play', anim: 'pose', start: 0, end: 'max', speed: 100, loop: 1 }],
    rub: [{ type: 'play', anim: 'rub', start: 0, end: 'max', speed: 100, loop: 1 }],
    look: [{ type: 'play', anim: 'hmm', start: 0, end: 'max', speed: 100, loop: 1 }],
    hyped: [
        { type: 'play', anim: 'hyped', start: 0, end: 1, speed: 100, loop: 1 },
        { type: 'play', anim: 'hyped', start: 2, end: 10, speed: 100, loop: 5 },
        { type: 'play', anim: 'hyped', start: 1, end: 0, speed: 50, loop: 1 }
    ],
    cook: [
        { type: 'play', anim: 'cook', start: 0, end: 14, speed: 100, loop: 1 },
        { type: 'play', anim: 'cook', start: 15, end: 20, speed: 100, loop: 6 },
        { type: 'play', anim: 'cook', start: 20, end: 35, speed: 100, loop: 1 }
    ],
    draw: [
        { type: 'play', anim: 'draw', start: 0, end: 20, speed: 100, loop: 1 },
        { type: 'play', anim: 'draw', start: 21, end: 25, speed: 100, loop: 11 },
        { type: 'play', anim: 'draw', start: 26, end: 35, speed: 100, loop: 1 }
    ],
    ashamed: [{ type: 'play', anim: 'ashamed', start: 0, end: 'max', speed: 100, loop: 1 }],
    come: [{ type: 'play', anim: 'come', start: 0, end: 'max', speed: 100, loop: 1 }],
    eat: [{ type: 'play', anim: 'eat', start: 0, end: 'max', speed: 100, loop: 1 }],
    exit: [{ type: 'play', anim: 'exit', start: 0, end: 'max', speed: 100, loop: 1 }],
    attention: [{ type: 'play', anim: 'attention', start: 0, end: 'max', speed: 100, loop: 1 }],
    haf: [{ type: 'play', anim: 'haf', start: 0, end: 'max', speed: 100, loop: 1 }],
    lick: [{ type: 'play', anim: 'lick', start: 0, end: 'max', speed: 100, loop: 1 }],
    read: [
        { type: 'play', anim: 'read', start: 0, end: 6, speed: 100, loop: 1 },
        { type: 'play', anim: 'read', start: 7, end: 17, speed: 100, loop: 5 },
        { type: 'play', anim: 'read', start: 18, end: 24, speed: 100, loop: 1 }
    ],
    slap: [
        { type: 'play', anim: 'slap', start: 5, end: 0, speed: 10, loop: 1 },
        { type: 'play', anim: 'slap', start: 0, end: 'max', speed: 100, loop: 1 }
    ],
    sleep: [{ type: 'play', anim: 'sleep', start: 0, end: 'max', speed: 300, loop: 5 }],
    speak: [
        { type: 'play', anim: 'speak', start: 0, end: 2, speed: 100, loop: 1 },
        { type: 'play', anim: 'speak', start: 3, end: 8, speed: 100, loop: 3 },
        { type: 'play', anim: 'speak', start: 9, end: 14, speed: 100, loop: 1 }
    ],
    tired: [{ type: 'play', anim: 'tired', start: 0, end: 'max', speed: 100, loop: 1 }],
    wake: [{ type: 'play', anim: 'tired', start: 12, end: 0, speed: 100, loop: 1 }]
};

function RoverAssistant({ currentState = 'blink' }) {
    const [currentFramePath, setCurrentFramePath] = useState('');
    const queueRef = useRef([]);
    const isPlayingRef = useRef(false);
    const timeoutRef = useRef(null);
    
    const processQueue = () => {
        if (queueRef.current.length === 0) {
            isPlayingRef.current = false;

            loadSequence('blink');
            return;
        }

        isPlayingRef.current = true;
        const currentCommand = queueRef.current[0];

        if (currentCommand.type === 'delay') {
            timeoutRef.current = setTimeout(() => {
                queueRef.current.shift();
                processQueue();
            }, currentCommand.ms);
            return;
        }

        if (currentCommand.type === 'play') {
            const { anim, start, end, speed, loop } = currentCommand;
            const animData = ANIMATIONS[anim];

            const actualStart = start === 'max' ? animData.frameCount - 1 : start;
            const actualEnd = end === 'max' ? animData.frameCount - 1 : end;

            if (currentCommand.currentLoop === undefined) currentCommand.currentLoop = 0;
            if (currentCommand.currentStep === undefined) currentCommand.currentStep = actualStart;

            const { currentLoop, currentStep } = currentCommand;
            const direction = actualStart <= actualEnd ? 1 : -1;


            const paddedStep = String(currentStep + 1).padStart(3, '0');
            const frameName = `${paddedStep}.png`;

            setCurrentFramePath(`${BASE_PATH}/${animData.folder}/${frameName}`);

            timeoutRef.current = setTimeout(() => {
                if (currentStep === actualEnd) {
                    if (currentLoop < loop - 1) {
                        currentCommand.currentLoop++;
                        currentCommand.currentStep = actualStart;
                        processQueue();
                    } else {
                        queueRef.current.shift();
                        processQueue();
                    }
                } else {
                    currentCommand.currentStep += direction;
                    processQueue();
                }
            }, speed);
        }
    };

    const loadSequence = (sequenceKey) => {
        clearTimeout(timeoutRef.current);

        const sequenceToPlay = SEQUENCES[sequenceKey] || SEQUENCES.blink;
        queueRef.current = JSON.parse(JSON.stringify(sequenceToPlay));

        processQueue();
    };

    useEffect(() => {
        loadSequence(currentState);

        return () => clearTimeout(timeoutRef.current);
    }, [currentState]);


    return (
        <div className="rover-assistant-container">
            {currentFramePath ? (
                <img
                    src={currentFramePath}
                    alt="Rover Assistant"
                    className="rover-character"
                />
            ) : null}
        </div>
    );
}

export default RoverAssistant;