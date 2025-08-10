"use client";
import React, { useState, useEffect, useRef } from "react";

const CurrentTime: React.FC = () => {
  // State to hold the current time as a Date object
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Refs to store timeout and interval IDs for cleanup
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Function to update the current time
    const updateTime = () => {
      setCurrentTime(new Date());
    };

    // Calculate the remaining time until the next minute
    const msUntilNextMinute =
      (60 - currentTime.getSeconds()) * 1000 - currentTime.getMilliseconds();

    // Set a timeout to update at the start of the next minute
    timeoutIdRef.current = setTimeout(() => {
      updateTime();

      // After the first update, set up an interval to update every minute
      intervalIdRef.current = setInterval(updateTime, 60 * 1000);
    }, msUntilNextMinute);

    // Cleanup function to clear timeout and interval on unmount
    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, [currentTime]);

  // Helper function to format time as HH:MM AM/PM
  const formatTime = (date: Date): string => {
    let hours: number = date.getHours();
    const minutes: number = date.getMinutes();
    const amPm: string = hours >= 12 ? "PM" : "AM";

    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    const formattedHours: string = hours.toString().padStart(2, "0");
    const formattedMinutes: string = minutes.toString().padStart(2, "0");

    return `${formattedHours}:${formattedMinutes} ${amPm}`;
  };

  return (
    <small className="font-[family-name:var(--font-geist-mono)] text-neutral-600 select-none">
      {formatTime(currentTime)}
    </small>
  );
};

export default CurrentTime;
