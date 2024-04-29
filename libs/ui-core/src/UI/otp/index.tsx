import React, {
  useRef,
  useState,
  useEffect,
  KeyboardEvent,
  ClipboardEvent,
} from "react";

import { Box, TextField } from "@mui/material";

interface OtpInputProps {
  onChange?: (value: string) => void;
}
export const OtpInput: React.FC<OtpInputProps> = ({ onChange }) => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const otpRefs = Array.from({ length: 6 }).map(() =>
    useRef<HTMLInputElement>(null)
  );

  useEffect(() => {
    otp.forEach((o, idx) => {
      if (o.length === 1) {
        if (otpRefs[idx + 1]) {
          otpRefs[idx + 1].current?.focus();
        }
      }
    });
  }, [otp]);

  useEffect(() => {
    if (onChange) {
      onChange(otp.join(""));
    }
  }, [otp, onChange]);

  const handleOtpChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    idx: number
  ) => {
    const val = (e.target as HTMLInputElement).value.toUpperCase();
    if (val === "" || /^[A-Z0-9]+$/.test(val)) {
      setOtp((prevOtp) => {
        const newOtp = [...prevOtp];
        newOtp[idx] = val;
        return newOtp;
      });
    }
  };

  const handleKeyDown = (e: KeyboardEvent, idx: number) => {
    if (e.key === "Backspace" && otp[idx] === "" && idx > 0) {
      otpRefs[idx - 1].current?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const paste = e.clipboardData.getData("Text").toUpperCase().trim();

    if (/^[A-Z0-9]+$/.test(paste)) {
      const pasteArr = paste.split("");
      if (pasteArr.length <= 6) {
        setOtp((prevOtp) => {
          const newOtp = [...prevOtp];
          for (let i = 0; i < 6; i++) {
            newOtp[i] = pasteArr[i] || "";
          }
          return newOtp;
        });
        e.preventDefault();
      }
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      {Array.from({ length: 6 }).map((_, idx) => (
        <TextField
          data-cy={`otp-input-${idx}`}
          autoComplete="off"
          key={idx}
          type="text"
          value={otp[idx]}
          placeholder="-"
          onChange={(e) => handleOtpChange(e, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          onPaste={handlePaste}
          inputRef={otpRefs[idx]}
          inputProps={{
            maxLength: 1,
            style: {
              textAlign: "center",
              fontSize: "1em",
            },
          }}
          variant="outlined"
          sx={{
            margin: "0 7px",
            width: ["40px", "50px"],

            fontSize: ["0.8em", "0.9em", "1em"],

            "& input": {
              padding: ["7px", "12px"],
            },
          }}
        />
      ))}
    </Box>
  );
};
