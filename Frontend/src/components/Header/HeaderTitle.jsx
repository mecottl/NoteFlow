// components/Header/HeaderTitle.jsx
import React, { useEffect, useState } from "react";

const words = ["Flow", "AI", localStorage.getItem("username") || "User"];

export default function HeaderTitle() {
  const [wordIdx, setWordIdx] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    let typingTimeout;
    let eraseTimeout;

    if (typing) {
      if (displayText.length < words[wordIdx].length) {
        typingTimeout = setTimeout(() => {
          setDisplayText(words[wordIdx].slice(0, displayText.length + 1));
        }, 90);
      } else {
        eraseTimeout = setTimeout(() => setTyping(false), 1500);
      }
    } else {
      if (displayText.length > 0) {
        typingTimeout = setTimeout(() => {
          setDisplayText(words[wordIdx].slice(0, displayText.length - 1));
        }, 35);
      } else {
        setTyping(true);
        setWordIdx((idx) => (idx + 1) % words.length);
      }
    }

    return () => {
      clearTimeout(typingTimeout);
      clearTimeout(eraseTimeout);
    };
  }, [displayText, typing, wordIdx]);

  // Calcula la palabra más larga para mantener centrado
  const maxLen = Math.max(...words.map((w) => w.length));

  return (
    <div className="header-title-stack">
      <div className="header-title-row header-title-row-top">
        <span className="header-title-main">Note</span>
      </div>
      <div className="header-title-row header-title-row-bottom">
        <span
          className="header-title-typewriter"
          style={{
            minWidth: `${maxLen}ch`,
            display: "inline-block",
            textAlign: "center"
          }}
        >
          {displayText}
          <span className="typewriter-cursor">|</span>
        </span>
      </div>
    </div>
  );
}
