import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const INPUT_SIZE = 70;
const RADIUS = 14;
const BORDER = 2;

interface OtpInputProps {
  length?: number;
  value: string[];
  onChange: (otp: string[]) => void;
  onComplete?: (otp: string) => void;
  error?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
}

export default function OtpInput({
  length = 6,
  value,
  onChange,
  onComplete,
  error = false,
  disabled = false,
  autoFocus = true,
}: OtpInputProps) {
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [justFilledIndex, setJustFilledIndex] = useState<number>(-1);
  const [shaking, setShaking] = useState(false);

  useEffect(() => {
    if (!autoFocus) return;
    const timer = setTimeout(() => inputRefs.current[0]?.focus(), 100);
    return () => clearTimeout(timer);
  }, [autoFocus]);

  useEffect(() => {
    if (justFilledIndex < 0) return;
    const timer = setTimeout(() => setJustFilledIndex(-1), 400);
    return () => clearTimeout(timer);
  }, [justFilledIndex]);

  useEffect(() => {
    if (!error) return;
    setShaking(true);
    const timer = setTimeout(() => setShaking(false), 500);
    return () => clearTimeout(timer);
  }, [error]);

  const focusInput = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(index, length - 1));
    inputRefs.current[clamped]?.focus();
  }, [length]);

  const handleChange = useCallback((index: number, val: string) => {
    if (disabled) return;
    const cleaned = val.replace(/\D/g, '');
    if (!cleaned) return;

    const newOtp = [...value];
    const digit = cleaned[cleaned.length - 1];
    newOtp[index] = digit;
    setJustFilledIndex(index);
    onChange(newOtp);

    if (index < length - 1) {
      focusInput(index + 1);
    }

    const complete = newOtp.join('');
    if (complete.length === length) {
      onComplete?.(complete);
    }
  }, [value, onChange, onComplete, disabled, length, focusInput]);

  const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (e.key === 'Backspace') {
      e.preventDefault();
      const newOtp = [...value];
      if (value[index]) {
        newOtp[index] = '';
        onChange(newOtp);
      } else if (index > 0) {
        newOtp[index - 1] = '';
        onChange(newOtp);
        focusInput(index - 1);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      focusInput(index - 1);
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      e.preventDefault();
      focusInput(index + 1);
    }
  }, [value, onChange, disabled, length, focusInput]);

  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (!pasted) return;

    const newOtp = [...value];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    onChange(newOtp);

    const nextFocus = Math.min(pasted.length, length - 1);
    focusInput(nextFocus);

    if (pasted.length === length) {
      onComplete?.(pasted);
    }
  }, [value, onChange, onComplete, disabled, length, focusInput]);

  const handleFocus = useCallback((index: number) => {
    setFocusedIndex(index);
    inputRefs.current[index]?.select();
  }, []);

  const handleBlur = useCallback(() => {
    setFocusedIndex(-1);
  }, []);

  const getBorderColor = (index: number) => {
    if (error) return '#f43f5e';
    if (focusedIndex === index) return '#f472b6';
    if (value[index]) return '#a855f7';
    return '#4a3058';
  };

  const getBackgroundColor = (index: number) => {
    if (error) return '#1a0a14';
    if (value[index]) return '#1f0f2a';
    return '#1a0f1e';
  };

  return (
    <div
      className="flex justify-center"
      style={{
        gap: `${INPUT_SIZE * 0.22}px`,
        animation: shaking ? 'otpShake 0.5s ease-in-out' : 'none',
      }}
    >
      <style>{`
        @keyframes otpShake {
          0%, 100% { transform: translateX(0); }
          10%, 50%, 90% { transform: translateX(-6px); }
          30%, 70% { transform: translateX(6px); }
        }
        @keyframes otpPulse {
          0% { box-shadow: 0 0 0 0 rgba(168,85,247,0.4); }
          70% { box-shadow: 0 0 0 8px rgba(168,85,247,0); }
          100% { box-shadow: 0 0 0 0 rgba(168,85,247,0); }
        }
        @keyframes otpGlow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `}</style>
      {Array.from({ length }, (_, i) => {
        const isFocused = focusedIndex === i;
        const isFilled = !!value[i];
        const wasJustFilled = justFilledIndex === i;
        const borderColor = getBorderColor(i);
        const bgColor = getBackgroundColor(i);

        return (
          <div
            key={i}
            className="relative"
            style={{ width: INPUT_SIZE, height: INPUT_SIZE }}
          >
            {/* Outer border (Skia rrect) */}
            <motion.div
              className="absolute inset-0"
              style={{
                width: INPUT_SIZE,
                height: INPUT_SIZE,
                borderRadius: RADIUS,
                backgroundColor: borderColor,
              }}
              animate={{ backgroundColor: borderColor }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            />

            {/* Inner fill */}
            <motion.div
              className="absolute"
              style={{
                top: BORDER,
                left: BORDER,
                right: BORDER,
                bottom: BORDER,
                borderRadius: RADIUS - BORDER,
                backgroundColor: bgColor,
              }}
              animate={{ backgroundColor: bgColor }}
              transition={{ duration: 0.25 }}
            />

            {/* Focus glow — pink/purple */}
            <AnimatePresence>
              {isFocused && (
                <motion.div
                  className="absolute"
                  style={{
                    top: -3,
                    left: -3,
                    right: -3,
                    bottom: -3,
                    borderRadius: RADIUS + 3,
                    background: 'linear-gradient(135deg, rgba(244,114,182,0.3) 0%, rgba(168,85,247,0.3) 100%)',
                    filter: 'blur(8px)',
                  }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{
                    opacity: [0.4, 0.8, 0.4],
                    scale: [0.97, 1.02, 0.97],
                  }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{
                    opacity: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
                    scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
                  }}
                />
              )}
            </AnimatePresence>

            {/* Filled pulse ring */}
            <AnimatePresence>
              {wasJustFilled && (
                <motion.div
                  className="absolute inset-0"
                  style={{
                    borderRadius: RADIUS,
                    border: `2px solid ${error ? '#f43f5e' : '#c084fc'}`,
                  }}
                  initial={{ scale: 1, opacity: 0.9 }}
                  animate={{ scale: 1.3, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              )}
            </AnimatePresence>

            {/* Filled inner glow */}
            <AnimatePresence>
              {isFilled && !isFocused && (
                <motion.div
                  className="absolute"
                  style={{
                    top: BORDER,
                    left: BORDER,
                    right: BORDER,
                    bottom: BORDER,
                    borderRadius: RADIUS - BORDER,
                    background: error
                      ? 'radial-gradient(circle, rgba(244,63,94,0.15) 0%, transparent 70%)'
                      : 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)',
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </AnimatePresence>

            {/* Digit text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <AnimatePresence mode="wait">
                {isFilled && (
                  <motion.span
                    key={value[i]}
                    style={{
                      fontSize: INPUT_SIZE * 0.34,
                      fontWeight: 600,
                      color: error ? '#f43f5e' : '#f5f5f5',
                      lineHeight: 1,
                    }}
                    initial={{ scale: 0.3, opacity: 0, y: -8 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.3, opacity: 0, y: 8 }}
                    transition={{
                      type: 'spring',
                      stiffness: 500,
                      damping: 15,
                      mass: 0.8,
                    }}
                  >
                    {value[i]}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            {/* Active border glow line */}
            {isFocused && (
              <motion.div
                className="absolute inset-0"
                style={{ borderRadius: RADIUS }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    borderRadius: RADIUS,
                    border: '2px solid transparent',
                    background: 'linear-gradient(135deg, #f472b6, #a855f7, #f472b6) border-box',
                    WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                  }}
                />
              </motion.div>
            )}

            {/* Hidden input */}
            <input
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={1}
              value={value[i] || ''}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={handlePaste}
              onFocus={() => handleFocus(i)}
              onBlur={handleBlur}
              disabled={disabled}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              style={{ fontSize: INPUT_SIZE * 0.34 }}
              aria-label={`OTP digit ${i + 1}`}
            />
          </div>
        );
      })}
    </div>
  );
}
