import React, { useRef, useState, useEffect } from "react";

export default function OtpInput({ length = 6, value = "", onChange, disabled = false }) {
    const defaultOtp = Array(length).fill("");
    const [otp, setOtp] = useState(defaultOtp);
    const inputRefs = useRef([]);

    useEffect(() => {
        if (value === "") {
            setOtp(defaultOtp);
        } else if (value.length <= length) {
            const newOtp = value.split("").map((char) => char || "");
            while (newOtp.length < length) newOtp.push("");
            setOtp(newOtp);
        }
    }, [value, length]);

    const handleChange = (e, index) => {
        const val = e.target.value;
        if (isNaN(val)) return;

        const newOtp = [...otp];
        // Only take the last character typed
        newOtp[index] = val.substring(val.length - 1);
        setOtp(newOtp);
        
        onChange(newOtp.join(""));

        // Move focus forward
        if (val && index < length - 1 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace") {
            if (!otp[index] && index > 0 && inputRefs.current[index - 1]) {
                inputRefs.current[index - 1].focus();
            }
        }
        if (e.key === "ArrowLeft" && index > 0 && inputRefs.current[index - 1]) {
            inputRefs.current[index - 1].focus();
        }
        if (e.key === "ArrowRight" && index < length - 1 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text/plain").trim();
        if (!pastedData || isNaN(pastedData)) return;

        const charArray = pastedData.slice(0, length).split("");
        const newOtp = [...otp];
        charArray.forEach((char, idx) => {
            newOtp[idx] = char;
        });
        
        setOtp(newOtp);
        onChange(newOtp.join(""));
        
        // Focus the appropriate element based on what was pasted
        const focusIdx = Math.min(charArray.length, length - 1);
        if (inputRefs.current[focusIdx]) {
            inputRefs.current[focusIdx].focus();
        }
    };

    return (
        <div className="flex gap-2 justify-between w-full">
            {otp.map((digit, index) => (
                <input
                    key={index}
                    ref={(ref) => (inputRefs.current[index] = ref)}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={1}
                    value={digit}
                    disabled={disabled}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                    className="w-10 h-12 lg:w-12 lg:h-14 lg:text-xl text-lg font-bold text-center bg-gray-50 border border-gray-300 rounded-lg lg:rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all disabled:opacity-50 disabled:bg-gray-100 disabled:cursor-not-allowed selection:bg-emerald-200"
                />
            ))}
        </div>
    );
}
