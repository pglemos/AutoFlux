"use client";

import React, { useState, useEffect, useRef } from "react";
import { EyeBall } from "./eye-ball";
import { Pupil } from "./pupil";

interface AnimatedCharactersProps {
    isTyping: boolean;
    passwordLength: number;
    showPassword: boolean;
    isPurpleBlinking: boolean;
    isBlackBlinking: boolean;
    isLookingAtEachOther: boolean;
    isPurplePeeking: boolean;
    mouseX: number;
    mouseY: number;
}

export const AnimatedCharacters = ({
    isTyping,
    passwordLength,
    showPassword,
    isPurpleBlinking,
    isBlackBlinking,
    isLookingAtEachOther,
    isPurplePeeking,
    mouseX,
    mouseY,
}: AnimatedCharactersProps) => {
    const purpleRef = useRef<HTMLDivElement>(null);
    const blackRef = useRef<HTMLDivElement>(null);
    const yellowRef = useRef<HTMLDivElement>(null);
    const orangeRef = useRef<HTMLDivElement>(null);

    const calculatePosition = (ref: React.RefObject<HTMLDivElement | null>) => {
        if (!ref.current) return { faceX: 0, faceY: 0, bodySkew: 0 };

        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 3;

        const deltaX = mouseX - centerX;
        const deltaY = mouseY - centerY;

        const faceX = Math.max(-15, Math.min(15, deltaX / 20));
        const faceY = Math.max(-10, Math.min(10, deltaY / 30));
        const bodySkew = Math.max(-6, Math.min(6, -deltaX / 120));

        return { faceX, faceY, bodySkew };
    };

    const purplePos = calculatePosition(purpleRef);
    const blackPos = calculatePosition(blackRef);
    const yellowPos = calculatePosition(yellowRef);
    const orangePos = calculatePosition(orangeRef);

    return (
        <div className="relative" style={{ width: '550px', height: '400px' }}>
            {/* Purple tall rectangle character - Back layer */}
            <div
                ref={purpleRef}
                className="absolute bottom-0 transition-all duration-700 ease-in-out"
                style={{
                    left: '70px',
                    width: '180px',
                    height: (isTyping || (passwordLength > 0 && !showPassword)) ? '440px' : '400px',
                    backgroundColor: '#6C3FF5',
                    borderRadius: '10px 10px 0 0',
                    zIndex: 1,
                    transform: (passwordLength > 0 && showPassword)
                        ? `skewX(0deg)`
                        : (isTyping || (passwordLength > 0 && !showPassword))
                            ? `skewX(${(purplePos.bodySkew || 0) - 12}deg) translateX(40px)`
                            : `skewX(${purplePos.bodySkew || 0}deg)`,
                    transformOrigin: 'bottom center',
                }}
            >
                {/* Eyes */}
                <div
                    className="absolute flex gap-8 transition-all duration-700 ease-in-out"
                    style={{
                        left: (passwordLength > 0 && showPassword) ? `${20}px` : isLookingAtEachOther ? `${55}px` : `${45 + purplePos.faceX}px`,
                        top: (passwordLength > 0 && showPassword) ? `${35}px` : isLookingAtEachOther ? `${65}px` : `${40 + purplePos.faceY}px`,
                    }}
                >
                    <EyeBall
                        size={18}
                        pupilSize={7}
                        maxDistance={5}
                        eyeColor="white"
                        pupilColor="#2D2D2D"
                        isBlinking={isPurpleBlinking}
                        forceLookX={(passwordLength > 0 && showPassword) ? (isPurplePeeking ? 4 : -4) : isLookingAtEachOther ? 3 : undefined}
                        forceLookY={(passwordLength > 0 && showPassword) ? (isPurplePeeking ? 5 : -4) : isLookingAtEachOther ? 4 : undefined}
                    />
                    <EyeBall
                        size={18}
                        pupilSize={7}
                        maxDistance={5}
                        eyeColor="white"
                        pupilColor="#2D2D2D"
                        isBlinking={isPurpleBlinking}
                        forceLookX={(passwordLength > 0 && showPassword) ? (isPurplePeeking ? 4 : -4) : isLookingAtEachOther ? 3 : undefined}
                        forceLookY={(passwordLength > 0 && showPassword) ? (isPurplePeeking ? 5 : -4) : isLookingAtEachOther ? 4 : undefined}
                    />
                </div>
            </div>

            {/* Black tall rectangle character - Middle layer */}
            <div
                ref={blackRef}
                className="absolute bottom-0 transition-all duration-700 ease-in-out"
                style={{
                    left: '240px',
                    width: '120px',
                    height: '310px',
                    backgroundColor: '#2D2D2D',
                    borderRadius: '8px 8px 0 0',
                    zIndex: 2,
                    transform: (passwordLength > 0 && showPassword)
                        ? `skewX(0deg)`
                        : isLookingAtEachOther
                            ? `skewX(${(blackPos.bodySkew || 0) * 1.5 + 10}deg) translateX(20px)`
                            : (isTyping || (passwordLength > 0 && !showPassword))
                                ? `skewX(${(blackPos.bodySkew || 0) * 1.5}deg)`
                                : `skewX(${blackPos.bodySkew || 0}deg)`,
                    transformOrigin: 'bottom center',
                }}
            >
                {/* Eyes */}
                <div
                    className="absolute flex gap-6 transition-all duration-700 ease-in-out"
                    style={{
                        left: (passwordLength > 0 && showPassword) ? `${10}px` : isLookingAtEachOther ? `${32}px` : `${26 + blackPos.faceX}px`,
                        top: (passwordLength > 0 && showPassword) ? `${28}px` : isLookingAtEachOther ? `${12}px` : `${32 + blackPos.faceY}px`,
                    }}
                >
                    <EyeBall
                        size={16}
                        pupilSize={6}
                        maxDistance={4}
                        eyeColor="white"
                        pupilColor="#2D2D2D"
                        isBlinking={isBlackBlinking}
                        forceLookX={(passwordLength > 0 && showPassword) ? -4 : isLookingAtEachOther ? 0 : undefined}
                        forceLookY={(passwordLength > 0 && showPassword) ? -4 : isLookingAtEachOther ? -4 : undefined}
                    />
                    <EyeBall
                        size={16}
                        pupilSize={6}
                        maxDistance={4}
                        eyeColor="white"
                        pupilColor="#2D2D2D"
                        isBlinking={isBlackBlinking}
                        forceLookX={(passwordLength > 0 && showPassword) ? -4 : isLookingAtEachOther ? 0 : undefined}
                        forceLookY={(passwordLength > 0 && showPassword) ? -4 : isLookingAtEachOther ? -4 : undefined}
                    />
                </div>
            </div>

            {/* Orange semi-circle character - Front left */}
            <div
                ref={orangeRef}
                className="absolute bottom-0 transition-all duration-700 ease-in-out"
                style={{
                    left: '0px',
                    width: '240px',
                    height: '200px',
                    zIndex: 3,
                    backgroundColor: '#FF9B6B',
                    borderRadius: '120px 120px 0 0',
                    transform: (passwordLength > 0 && showPassword) ? `skewX(0deg)` : `skewX(${orangePos.bodySkew || 0}deg)`,
                    transformOrigin: 'bottom center',
                }}
            >
                {/* Eyes - just pupils, no white */}
                <div
                    className="absolute flex gap-8 transition-all duration-200 ease-out"
                    style={{
                        left: (passwordLength > 0 && showPassword) ? `${50}px` : `${82 + (orangePos.faceX || 0)}px`,
                        top: (passwordLength > 0 && showPassword) ? `${85}px` : `${90 + (orangePos.faceY || 0)}px`,
                    }}
                >
                    <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D" forceLookX={(passwordLength > 0 && showPassword) ? -5 : undefined} forceLookY={(passwordLength > 0 && showPassword) ? -4 : undefined} />
                    <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D" forceLookX={(passwordLength > 0 && showPassword) ? -5 : undefined} forceLookY={(passwordLength > 0 && showPassword) ? -4 : undefined} />
                </div>
            </div>

            {/* Yellow tall rectangle character - Front right */}
            <div
                ref={yellowRef}
                className="absolute bottom-0 transition-all duration-700 ease-in-out"
                style={{
                    left: '310px',
                    width: '140px',
                    height: '230px',
                    backgroundColor: '#E8D754',
                    borderRadius: '70px 70px 0 0',
                    zIndex: 4,
                    transform: (passwordLength > 0 && showPassword) ? `skewX(0deg)` : `skewX(${yellowPos.bodySkew || 0}deg)`,
                    transformOrigin: 'bottom center',
                }}
            >
                {/* Eyes - just pupils, no white */}
                <div
                    className="absolute flex gap-6 transition-all duration-200 ease-out"
                    style={{
                        left: (passwordLength > 0 && showPassword) ? `${20}px` : `${52 + (yellowPos.faceX || 0)}px`,
                        top: (passwordLength > 0 && showPassword) ? `${35}px` : `${40 + (yellowPos.faceY || 0)}px`,
                    }}
                >
                    <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D" forceLookX={(passwordLength > 0 && showPassword) ? -5 : undefined} forceLookY={(passwordLength > 0 && showPassword) ? -4 : undefined} />
                    <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D" forceLookX={(passwordLength > 0 && showPassword) ? -5 : undefined} forceLookY={(passwordLength > 0 && showPassword) ? -4 : undefined} />
                </div>
                {/* Horizontal line for mouth */}
                <div
                    className="absolute w-20 h-[4px] bg-[#2D2D2D] rounded-full transition-all duration-200 ease-out"
                    style={{
                        left: (passwordLength > 0 && showPassword) ? `${10}px` : `${40 + (yellowPos.faceX || 0)}px`,
                        top: (passwordLength > 0 && showPassword) ? `${88}px` : `${88 + (yellowPos.faceY || 0)}px`,
                    }}
                />
            </div>
        </div>
    );
};
