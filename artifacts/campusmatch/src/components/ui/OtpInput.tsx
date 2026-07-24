import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';

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

  const getBoxState = (index: number) => {
    if (error) return 'error';
    if (value[index]) return 'filled';
    if (focusedIndex === index) return 'focused';
    return 'empty';
  };

  return (
    <div className="flex justify-center gap-3">
      {Array.from({ length }, (_, i) => {
        const state = getBoxState(i);
        const isFocused = focusedIndex === i;
        const isFilled = !!value[i];
        const wasJustFilled = justFilledIndex === i;

        return (
          <div key={i} className="relative">
            <motion.div
              className={`relative w-12 h-14 rounded-xl overflow-hidden transition-colors duration-200 ${
                state === 'error'
                  ? 'bg-red-500/10 border-2 border-red-500/60'
                  : state === 'filled'
                  ? 'bg-blue-500/15 border-2 border-blue-500/60'
                  : state === 'focused'
                  ? 'bg-white/5 border-2 border-blue-500'
                  : 'bg-white/[0.03] border-2 border-white/10'
              }`}
              animate={
                wasJustFilled
                  ? {
                      scale: [1, 1.12, 0.95, 1],
                    }
                  : isFocused
                  ? { scale: 1.05 }
                  : { scale: 1 }
              }
              transition={
                wasJustFilled
                  ? { duration: 0.3, ease: 'easeOut' }
                  : { duration: 0.15 }
              }
            >
              {/* Fill animation */}
              {isFilled && (
                <motion.div
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background: error
                      ? 'linear-gradient(135deg, rgba(239,68,68,0.15) 0%, rgba(239,68,68,0.05) 100%)'
                      : 'linear-gradient(135deg, rgba(59,130,246,0.2) 0%, rgba(99,102,241,0.1) 100%)',
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}

              {/* Focus glow ring */}
              {isFocused && (
                <motion.div
                  className="absolute inset-[-1px] rounded-xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(59,130,246,0.3) 0%, rgba(139,92,246,0.3) 100%)',
                    filter: 'blur(4px)',
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.15 }}
                />
              )}

              {/* Digit text */}
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                <motion.span
                  className={`text-2xl font-bold tabular-nums ${
                    error ? 'text-red-400' : isFilled ? 'text-white' : 'text-white'
                  }`}
                  initial={wasJustFilled ? { scale: 0.5, opacity: 0 } : false}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2, ease: 'backOut' }}
                >
                  {isFilled ? '•' : ''}
                </motion.span>
              </div>

              {/* Active border glow */}
              {isFocused && (
                <motion.div
                  className="absolute inset-0 rounded-xl border-2 border-blue-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.15 }}
                />
              )}
            </motion.div>

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
              aria-label={`OTP digit ${i + 1}`}
            />
          </div>
        );
      })}
    </div>
  );
}
