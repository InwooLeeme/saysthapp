"use client";
import styles from "./UserInput.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import { useRef, useState, useEffect } from "react";
import { useProcess } from "../../../context/process";
import ErrorDisplay from "./ErrorDisplay";

const AudioType = "audio/wav";
const TEXTPOSTURL = "/api/execute";
const AUDIOPOSTURL = "/api/stt";

declare global {
  interface Window {
    electronAPI: {
      runPythonCode: (code: string) => Promise<string>;
    };
  }
}

export default function UserInput() {
  const [inputValue, setInputValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isProcessing, setIsProcessing } = useProcess();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  useEffect(() => {
    console.log("isRecording changed:", isRecording);
  }, [isRecording]);
  const runCode = async (code: string) => {
    try {
      await window.electronAPI.runPythonCode(code);
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const sendTextToAgent = async (text: string) => {
    try {
      setIsProcessing(true);
      setError(null);
      console.log(TEXTPOSTURL);

      const res = await fetch(TEXTPOSTURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || '요청을 처리하는 중 오류가 발생했습니다.');
      }

      const data = await res.json();
      console.log(`${data.code}`);

      // TODO: Post To MCP Server, Agent Server에서 받아온 결과를 Local MCP Server에 전달합니다
      runCode(data.code);
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
      setIsProcessing(false);
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      try {
        setIsProcessing(true);
        setError(null);
        const res = await fetch(TEXTPOSTURL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: inputValue.trim() }),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.detail || '요청을 처리하는 중 오류가 발생했습니다.');
        }

        const data = await res.json();
        setInputValue("");

        // TODO: Post To MCP Server, Agent Server에서 받아온 결과를 Local MCP Server에 전달합니다
        runCode(data.code);
      } catch (error) {
        console.error(error);
        setError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
        setIsProcessing(false);
      }
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      recorder.onstop = async () => {
        setIsProcessing(true);
        const audioBlob = new Blob(audioChunksRef.current, { type: AudioType });
        const reader = new FileReader();

        reader.onloadend = async () => {
          const base64Data = (reader.result as string).split(",")[1];
          const payload = {
            fileName: "voice_file.wav",
            mimeType: AudioType,
            data: base64Data,
          };

          try {
            const response = await fetch(AUDIOPOSTURL, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });
            if (!response.ok)
              throw new Error(`Server error: ${response.status}`);
            const result = await response.json();
            sendTextToAgent(result.text);
          } catch (err) {
            console.error(err);
            setIsProcessing(false);
          }
        };

        reader.readAsDataURL(audioBlob);
      };

      recorder.start();
    } catch (err) {
      console.error("Microphone access error:", err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  function handleMicClick() {
    const next = !isRecording;
    setIsRecording(next);
    if (next) {
      startRecording();
    } else {
      stopRecording();
    }
  }

  return (
    <>
      <ErrorDisplay 
        error={error} 
        onDismiss={() => setError(null)} 
      />
      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className={styles.userInput}
        placeholder="명령을 입력하세요"
        disabled={isRecording || isProcessing}
      />
      <div
        onClick={handleMicClick}
        className={`${styles.micIcon} ${isRecording ? styles.rainbow : ''} ${isProcessing ? styles.disabled : ''}`}
        style={isProcessing ? { pointerEvents: 'none', opacity: 0.6 } : {}}
      >
        <FontAwesomeIcon icon={faMicrophone} />
      </div>
    </>
  );
}
