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

  useEffect(() => {
    if (!autoFocus) return;
    const timer = setTimeout(() => inputRefs.current[0]?.focus(), 100);
    return () => clearTimeout(timer);
  }, [autoFocus]);

  useEffect(() => {
    if (justFilledIndex < 0) return;
    const timer = setTimeout(() => setJustFilledIndex(-1), 300);
    return () => clearTimeout(timer);
  }, [justFilledIndex]);

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
    if (error) return '#ef4444';
    if (focusedIndex === index) return '#3b82f6';
    if (value[index]) return '#6366f1';
    return '#404040';
  };

  const getBackgroundColor = (index: number) => {
    if (error) return '#262626';
    if (value[index]) return '#1e1e2e';
    return '#262626';
  };

  return (
    <div className="flex justify-center" style={{ gap: `${(INPUT_SIZE * 0.25)}px` }}>
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
            {/* Skia-style rounded rect border */}
            <motion.div
              className="absolute inset-0"
              style={{
                width: INPUT_SIZE,
                height: INPUT_SIZE,
                borderRadius: RADIUS,
                backgroundColor: borderColor,
              }}
              animate={{
                backgroundColor: borderColor,
              }}
              transition={{ duration: 0.2 }}
            />

            {/* Inner fill (creates the border effect — matches Skia rrect path) */}
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
              animate={{
                backgroundColor: bgColor,
              }}
              transition={{ duration: 0.2 }}
            />

            {/* Focus glow */}
            <AnimatePresence>
              {isFocused && (
                <motion.div
                  className="absolute inset-[-2px]"
                  style={{
                    borderRadius: RADIUS + 2,
                    background: 'linear-gradient(135deg, rgba(59,130,246,0.25) 0%, rgba(99,102,241,0.25) 100%)',
                    filter: 'blur(6px)',
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                />
              )}
            </AnimatePresence>

            {/* Filled pulse */}
            <AnimatePresence>
              {wasJustFilled && (
                <motion.div
                  className="absolute inset-0"
                  style={{
                    borderRadius: RADIUS,
                    border: `2px solid ${error ? '#ef4444' : '#6366f1'}`,
                  }}
                  initial={{ scale: 1.15, opacity: 0.8 }}
                  animate={{ scale: 1, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                />
              )}
            </AnimatePresence>

            {/* Digit text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.span
                style={{
                  fontSize: INPUT_SIZE * 0.34,
                  fontWeight: 600,
                  color: error ? '#ef4444' : isFocused ? '#ffffff' : isFilled ? '#e5e5e5' : '#737373',
                  lineHeight: 1,
                }}
                animate={
                  wasJustFilled
                    ? { scale: [0.5, 1.1, 1] }
                    : { scale: 1 }
                }
                transition={
                  wasJustFilled
                    ? { duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }
                    : { duration: 0.15 }
                }
              >
                {value[i] || ''}
              </motion.span>
            </div>

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
