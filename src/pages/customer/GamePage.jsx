import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, Trophy, Flame, RotateCcw, Utensils, CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateMathProblem, getPersonalBest, savePersonalBest } from '../../utils/mathGameEngine';

export const GamePage = () => {
  const navigate = useNavigate();

  // Game states: 'idle' | 'playing' | 'gameover'
  const [gameState, setGameState] = useState('idle');
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [personalBest, setPersonalBest] = useState(getPersonalBest());
  const [isNewRecord, setIsNewRecord] = useState(false);

  // Stats
  const [correctCount, setCorrectCount] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);

  // Current problem
  const [problem, setProblem] = useState(null);
  const [feedback, setFeedback] = useState(null); // { selectedAnswer, isCorrect }

  const timerRef = useRef(null);

  // Initialize first problem on start
  const startGame = () => {
    setTimeLeft(60);
    setScore(0);
    setStreak(0);
    setCorrectCount(0);
    setTotalAttempts(0);
    setIsNewRecord(false);
    setFeedback(null);
    setPersonalBest(getPersonalBest());
    setProblem(generateMathProblem(0));
    setGameState('playing');
  };

  // Timer loop
  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);

  const endGame = () => {
    setGameState('gameover');
    if (timerRef.current) clearInterval(timerRef.current);
  };

  // Check personal best when game ends
  useEffect(() => {
    if (gameState === 'gameover') {
      const recordBroken = savePersonalBest(score);
      if (recordBroken) {
        setIsNewRecord(true);
        setPersonalBest(score);
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch {}
      }
    }
  }, [gameState, score]);

  const handleSelectAnswer = (selected) => {
    if (gameState !== 'playing' || feedback) return;

    setTotalAttempts(prev => prev + 1);
    const isCorrect = selected === problem.answer;

    if (isCorrect) {
      const newStreak = streak + 1;
      const streakBonus = Math.min(newStreak * 2, 20);
      const pointsAdded = 10 + streakBonus;

      setScore(prev => prev + pointsAdded);
      setStreak(newStreak);
      setCorrectCount(prev => prev + 1);
      setFeedback({ selected, isCorrect: true });
    } else {
      setStreak(0);
      setFeedback({ selected, isCorrect: false });
    }

    // Advance to next problem after quick feedback
    setTimeout(() => {
      setFeedback(null);
      setProblem(generateMathProblem(isCorrect ? streak + 1 : 0));
    }, 280);
  };

  return (
    <div className="space-y-4 pb-12 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-1.5 text-xs font-semibold text-[#67523C] hover:text-[#312219] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Game</span>
        </button>

        {/* High score pill */}
        <div className="flex items-center space-x-1.5 bg-[#D2C6A6]/40 px-3 py-1 rounded-full text-xs font-semibold text-[#312219] border border-[#67523C]/15">
          <Trophy className="w-3.5 h-3.5 text-[#A86C3E]" />
          <span>Best: {personalBest} pts</span>
        </div>
      </div>

      {/* IDLE STATE: Intro Screen */}
      {gameState === 'idle' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-6 border border-[#67523C]/15 shadow-cafe text-center space-y-4 my-4"
        >
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#67523C] text-[#F5EFE4] flex items-center justify-center shadow-cafe-sm">
            <Flame className="w-8 h-8 text-[#D4A373]" />
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#A86C3E] block">
              Brain Refresh
            </span>
            <h1 className="font-serif font-bold text-2xl text-[#312219] mt-0.5">
              Café Mental Math Rush
            </h1>
            <p className="text-xs text-[#5B5146] mt-2 max-w-xs mx-auto leading-relaxed">
              Solve rapid-fire addition, subtraction, and multiplication challenges in 60 seconds. Build streaks for multiplier bonus points!
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 py-2">
            <div className="bg-[#FAF7F0] p-3 rounded-xl border border-[#67523C]/10 text-center">
              <Clock className="w-4 h-4 mx-auto text-[#67523C] mb-1" />
              <span className="text-[11px] font-bold text-[#312219] block">60 Secs</span>
              <span className="text-[10px] text-[#5B5146]">Countdown</span>
            </div>
            <div className="bg-[#FAF7F0] p-3 rounded-xl border border-[#67523C]/10 text-center">
              <Sparkles className="w-4 h-4 mx-auto text-[#A86C3E] mb-1" />
              <span className="text-[11px] font-bold text-[#312219] block">Streak Boost</span>
              <span className="text-[10px] text-[#5B5146]">Bonus Pts</span>
            </div>
            <div className="bg-[#FAF7F0] p-3 rounded-xl border border-[#67523C]/10 text-center">
              <Trophy className="w-4 h-4 mx-auto text-[#D4A373] mb-1" />
              <span className="text-[11px] font-bold text-[#312219] block">{personalBest} pts</span>
              <span className="text-[10px] text-[#5B5146]">High Score</span>
            </div>
          </div>

          <button
            onClick={startGame}
            className="w-full py-4 rounded-2xl bg-[#67523C] hover:bg-[#493725] text-[#F5EFE4] font-bold text-base shadow-cafe-lg transition active:scale-98"
          >
            Start 60s Challenge
          </button>
        </motion.div>
      )}

      {/* PLAYING STATE */}
      {gameState === 'playing' && problem && (
        <div className="space-y-4">
          {/* Top Game Bar: Timer & Score */}
          <div className="grid grid-cols-3 gap-3 items-center">
            {/* Timer */}
            <div className="bg-white rounded-2xl p-2.5 border border-[#67523C]/15 text-center shadow-xs">
              <span className="text-[10px] uppercase font-bold text-[#5B5146] block">Timer</span>
              <span className={`font-mono font-bold text-lg ${timeLeft <= 10 ? 'text-[#98382B] animate-pulse' : 'text-[#312219]'}`}>
                {timeLeft}s
              </span>
            </div>

            {/* Streak */}
            <div className="bg-white rounded-2xl p-2.5 border border-[#67523C]/15 text-center shadow-xs">
              <span className="text-[10px] uppercase font-bold text-[#A86C3E] block">Streak</span>
              <span className="font-bold text-lg text-[#312219] flex items-center justify-center space-x-1">
                {streak > 1 && <Flame className="w-4 h-4 text-[#A86C3E] fill-current" />}
                <span>{streak}🔥</span>
              </span>
            </div>

            {/* Score */}
            <div className="bg-white rounded-2xl p-2.5 border border-[#67523C]/15 text-center shadow-xs">
              <span className="text-[10px] uppercase font-bold text-[#3F6E4D] block">Score</span>
              <span className="font-mono font-bold text-lg text-[#3F6E4D]">
                {score}
              </span>
            </div>
          </div>

          {/* Time Progress Bar */}
          <div className="w-full h-2 rounded-full bg-[#D2C6A6]/40 overflow-hidden">
            <motion.div
              className={`h-full ${timeLeft <= 10 ? 'bg-[#98382B]' : 'bg-[#67523C]'}`}
              style={{ width: `${(timeLeft / 60) * 100}%` }}
              transition={{ ease: 'linear', duration: 1 }}
            />
          </div>

          {/* Math Problem Card */}
          <motion.div
            key={`${problem.num1}-${problem.operator}-${problem.num2}`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`rounded-3xl p-8 border shadow-cafe text-center transition-colors duration-200 ${
              feedback?.isCorrect
                ? 'bg-[#3F6E4D]/10 border-[#3F6E4D]'
                : feedback && !feedback.isCorrect
                ? 'bg-[#98382B]/10 border-[#98382B]'
                : 'bg-white border-[#67523C]/15'
            }`}
          >
            <span className="text-xs uppercase font-bold text-[#A86C3E] tracking-widest block mb-2">
              Calculate Rapidly
            </span>
            <div className="font-serif font-extrabold text-4xl sm:text-5xl text-[#312219] tracking-tight py-2">
              {problem.num1} {problem.operator} {problem.num2} = ?
            </div>
          </motion.div>

          {/* 4 Multiple Choice Options */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {problem.options.map((opt, i) => {
              const isSelected = feedback?.selected === opt;
              const isCorrectAnswer = opt === problem.answer;

              let btnStyle = 'bg-white hover:bg-[#FAF7F0] border-[#67523C]/20 text-[#312219]';

              if (feedback) {
                if (isSelected && feedback.isCorrect) {
                  btnStyle = 'bg-[#3F6E4D] border-[#3F6E4D] text-white';
                } else if (isSelected && !feedback.isCorrect) {
                  btnStyle = 'bg-[#98382B] border-[#98382B] text-white';
                } else if (isCorrectAnswer) {
                  btnStyle = 'bg-[#3F6E4D]/30 border-[#3F6E4D] text-[#312219]';
                }
              }

              return (
                <button
                  key={i}
                  disabled={Boolean(feedback)}
                  onClick={() => handleSelectAnswer(opt)}
                  className={`py-5 px-4 rounded-2xl text-2xl font-bold font-mono border-2 shadow-cafe-sm transition-all active:scale-95 ${btnStyle}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* GAMEOVER STATE */}
      {gameState === 'gameover' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-6 border border-[#67523C]/15 shadow-cafe text-center space-y-4 my-2"
        >
          {isNewRecord ? (
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#D4A373]/20 text-[#A86C3E] font-bold text-xs uppercase tracking-wider">
              <Trophy className="w-4 h-4 text-[#A86C3E]" />
              <span>New Personal Record!</span>
            </div>
          ) : (
            <span className="text-xs font-bold uppercase tracking-wider text-[#5B5146] block">
              Time Expired!
            </span>
          )}

          <h2 className="font-serif font-bold text-3xl text-[#312219]">
            Challenge Complete
          </h2>

          {/* Final Score Hero */}
          <div className="bg-[#FAF7F0] rounded-2xl p-4 border border-[#67523C]/15 max-w-xs mx-auto">
            <span className="text-[10px] uppercase font-bold text-[#A86C3E] block">
              Final Score
            </span>
            <div className="font-mono font-extrabold text-4xl text-[#67523C] my-1">
              {score} <span className="text-sm font-sans font-medium text-[#5B5146]">pts</span>
            </div>
            <span className="text-xs text-[#5B5146]">
              Personal Best: <strong>{personalBest} pts</strong>
            </span>
          </div>

          {/* Performance Breakdown */}
          <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto text-xs">
            <div className="bg-white p-3 rounded-xl border border-[#67523C]/10">
              <span className="text-[#5B5146] block">Problems Solved</span>
              <span className="font-bold text-base text-[#312219]">
                {correctCount} / {totalAttempts}
              </span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-[#67523C]/10">
              <span className="text-[#5B5146] block">Accuracy</span>
              <span className="font-bold text-base text-[#312219]">
                {totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 0}%
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              onClick={startGame}
              className="w-full py-3.5 rounded-xl bg-[#67523C] hover:bg-[#493725] text-[#F5EFE4] font-bold text-sm flex items-center justify-center space-x-2 transition shadow-cafe-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Play Again</span>
            </button>
            <button
              onClick={() => navigate('/menu')}
              className="w-full py-3 rounded-xl border border-[#67523C]/30 text-[#67523C] font-semibold text-xs hover:bg-[#D2C6A6]/20 transition flex items-center justify-center space-x-2"
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>Back to Menu</span>
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

