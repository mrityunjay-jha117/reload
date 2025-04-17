import React, { useEffect, useState } from "react";

interface AnimatedTextSequenceProps {
  texts: string[];
  typingSpeed?: number; // milliseconds per character (default 100)
  fadeDelay?: number; // delay after finishing typing (default 500)
  fadeDuration?: number; // fade/explosion duration (default 500)
}

interface Offset {
  x: number;
  y: number;
}

type Phase = "typing" | "waiting" | "exploding";

const TypingEffect: React.FC<AnimatedTextSequenceProps> = ({
  texts,
  typingSpeed = 100,
  fadeDelay = 250,
  fadeDuration = 1500,
}) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("typing");
  const [explodeOffsets, setExplodeOffsets] = useState<Offset[]>([]);

  const currentText = texts[currentTextIndex];

  // Typing effect: increase character index one-by-one.
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (phase === "typing" && currentCharIndex < currentText.length) {
      interval = setInterval(() => {
        setCurrentCharIndex((prev) => prev + 1);
      }, typingSpeed);
    }
    return () => clearInterval(interval);
  }, [phase, currentCharIndex, currentText.length, typingSpeed]);

  // When text fully typed, wait and then trigger explosion.
  useEffect(() => {
    if (
      phase === "typing" &&
      currentCharIndex === currentText.length &&
      currentText.length > 0
    ) {
      const timer = setTimeout(() => {
        setPhase("exploding");
        // For each character, compute a random offset.
        const offsets: Offset[] = Array.from({
          length: currentText.length,
        }).map(() => ({
          x: 0, // random between -50 and 50 px
          y: Math.random() * 100 - 250, // random between -50 and 50 px
        }));
        setExplodeOffsets(offsets);
      }, fadeDelay);
      return () => clearTimeout(timer);
    }
  }, [phase, currentCharIndex, currentText.length, fadeDelay, currentText]);

  // After explosion animation, move to next text.
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (phase === "exploding") {
      timer = setTimeout(() => {
        setPhase("typing");
        setCurrentCharIndex(0);
        setExplodeOffsets([]);
        // Loop over texts cyclically.
        setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
      }, fadeDuration);
    }
    return () => clearTimeout(timer);
  }, [phase, fadeDuration, texts.length]);

  return (
    <div className="flex justify-center items-center p-5 w-full">
      <div className="text-2xl break-normal whitespace-pre-wrap text-gray-500 w-full max-w-full">
        {Array.from(currentText).map((char, index) => {
          if (index >= currentCharIndex) return <span key={index}></span>;
  
          const style =
            phase === "exploding" && explodeOffsets[index]
              ? {
                  transition: `all ${fadeDuration}ms ease-in`,
                  opacity: 0,
                  transform: `translate(${explodeOffsets[index].x}px, ${explodeOffsets[index].y}px) scale(0.2)`,
                }
              : {};
  
          return (
            <span key={index} style={style} className="text-lg inline-block">
              {char === " " ? "\u00A0" : char}
            </span>
          );
        })}
      </div>
    </div>
  );
  
};

export default TypingEffect;
