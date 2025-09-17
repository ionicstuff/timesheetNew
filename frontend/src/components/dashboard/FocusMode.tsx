"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Play, 
  Pause, 
  RotateCcw,
  Coffee,
  Zap
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

const FocusMode = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<"work" | "break">("work");
  const [completedSessions, setCompletedSessions] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (mode === "work") {
        setMode("break");
        setTimeLeft(5 * 60); // 5 minutes break
        setCompletedSessions(prev => prev + 1);
      } else {
        setMode("work");
        setTimeLeft(25 * 60); // 25 minutes work
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, mode]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === "work" ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getModeText = () => {
    return mode === "work" ? "Focus Time" : "Break Time";
  };

  const getModeColor = () => {
    return mode === "work" ? "bg-red-500" : "bg-green-500";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Focus Mode
        </CardTitle>
        <CardDescription>Boost your productivity with the Pomodoro technique</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className={`w-48 h-48 rounded-full flex items-center justify-center ${getModeColor()} mb-6`}>
            <div className="bg-background rounded-full w-44 h-44 flex flex-col items-center justify-center">
              <div className="text-4xl font-bold">{formatTime(timeLeft)}</div>
              <div className="text-sm text-muted-foreground mt-2">{getModeText()}</div>
            </div>
          </div>
          
          <div className="flex gap-4 mb-6">
            <Button onClick={toggleTimer} size="lg">
              {isActive ? (
                <>
                  <Pause className="h-5 w-5 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 mr-2" />
                  Start
                </>
              )}
            </Button>
            <Button onClick={resetTimer} variant="outline" size="lg">
              <RotateCcw className="h-5 w-5 mr-2" />
              Reset
            </Button>
          </div>
          
          <div className="w-full mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Completed Sessions</span>
              <span>{completedSessions}</span>
            </div>
            <Progress value={(completedSessions % 4) * 25} />
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Coffee className="h-4 w-4" />
            <span>Take a break after 4 focus sessions</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FocusMode;