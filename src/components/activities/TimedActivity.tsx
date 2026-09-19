"use client";

import { useEffect, useRef, useState } from "react";
import { choiceButtonClass, cardBase } from "./shared";

interface Q {
  prompt: string;
  choices: string[];
  answerIndex: number;
}

interface Props {
  seconds: number;
  questions: Q[];
  onDone: (correct: boolean) => void;
}

export default function TimedActivity({ seconds, questions, onDone }: Props) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const [step, setStep] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const finishedRef = useRef(false);

  const threshold = Math.ceil(questions.length / 2);

  function finish(finalCorrectCount: number) {
    if (finishedRef.current) return;
    finishedRef.current = true;
    onDone(finalCorrectCount >= threshold);
  }

  useEffect(() => {
    if (finishedRef.current) return;
    if (timeLeft <= 0) {
      finish(correctCount);
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  const q = questions[step];

  function handleSelect(i: number) {
    if (selected !== null || finishedRef.current) return;
    setSelected(i);
    const isCorrect = i === q.answerIndex;
    const newCount = correctCount + (isCorrect ? 1 : 0);
    setTimeout(() => {
      if (step + 1 >= questions.length) {
        finish(newCount);
      } else {
        setCorrectCount(newCount);
        setStep(step + 1);
        setSelected(null);
      }
    }, 450);
  }

  return (
    <div className={cardBase}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-slate-400">
          Pregunta {step + 1} de {questions.length}
        </span>
        <span
          className={`text-lg font-black ${timeLeft <= 10 ? "text-red-400" : "text-amber-300"}`}
        >
          ⏱️ {timeLeft}s
        </span>
      </div>
      <p className="text-xl font-bold text-white mb-6 text-center">
        {q.prompt}
      </p>
      <div className="grid grid-cols-3 gap-3">
        {q.choices.map((c, i) => {
          let state: "idle" | "correct" | "wrong" | "muted" = "idle";
          if (selected !== null) {
            if (i === q.answerIndex) state = "correct";
            else if (i === selected) state = "wrong";
            else state = "muted";
          }
          return (
            <button
              key={i}
              type="button"
              onClick={() => handleSelect(i)}
              className={choiceButtonClass(state)}
            >
              {c}
            </button>
          );
        })}
      </div>
    </div>
  );
}
