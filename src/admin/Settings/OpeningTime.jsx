import { useState, useEffect } from "react";
import DayFomatter from "../Hooks/DayFomatter";
import { useSettings } from "./SettingsProvider";

// A component to be displayed at top of the user page if the shop is closed
const OpeningTime = () => {
    const { settings, isLoading } = useSettings();
    const [isShopOpen, setIsShopOpen] = useState(false);

    useEffect(() => {
        if (!settings) return;

        const { opening_time, closing_time, days_open, is_open } = settings;

        // Check if shop is emergency closed via is_open flag
        const isEmergencyClosed = !(Number(is_open));

        // Parse days_open to an array of days
        const allDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        let daysArray = [];

        if (days_open?.toLowerCase() === 'everyday') {
            daysArray = [...allDays];
        } else if (days_open && days_open.includes(",")) {
            const days = days_open.split(",").map(day => day.trim());
            daysArray = allDays.filter(day => days.includes(day));
        }

        // Check if the shop is currently open
        const checkIfOpen = () => {
            // If emergency closed, shop is not open regardless of time
            if (isEmergencyClosed) return false;

            const currentDate = new Date();
            const currentDay = currentDate.toLocaleString("en-US", { weekday: "long" });

            // Check if current day is in the open days
            const isCurrentDayOpen = daysArray.includes(currentDay);
            if (!isCurrentDayOpen) return false;

            // Parse opening and closing times
            const parseTime = (timeStr) => {
                if (!timeStr) return null;

                const [timePart, meridiem] = timeStr.split(" ");
                let [hours, minutes] = timePart.split(":").map(Number);

                if (meridiem === "PM" && hours !== 12) {
                    hours += 12;
                } else if (meridiem === "AM" && hours === 12) {
                    hours = 0;
                }

                return hours * 60 + minutes; // Convert to minutes for easier comparison
            };

            const openingMinutes = parseTime(opening_time);
            const closingMinutes = parseTime(closing_time);

            if (openingMinutes === null || closingMinutes === null) return false;

            // Get current time in minutes
            const currentHours = currentDate.getHours();
            const currentMinutes = currentDate.getMinutes();
            const currentTimeInMinutes = currentHours * 60 + currentMinutes;

            // Handle regular case (opening time is earlier than closing time)
            if (openingMinutes < closingMinutes) {
                return currentTimeInMinutes >= openingMinutes && currentTimeInMinutes < closingMinutes;
            }
            // Handle overnight case (e.g., 8:00 PM - 2:00 AM)
            else {
                return currentTimeInMinutes >= openingMinutes || currentTimeInMinutes < closingMinutes;
            }
        };

        setIsShopOpen(checkIfOpen());

        // Set up interval to check shop status every minute
        const interval = setInterval(() => {
            setIsShopOpen(checkIfOpen());
        }, 60000); // Check every minute

        return () => clearInterval(interval);
    }, [settings]);

    if (isLoading) return (
        <div className="d-flex justify-content-center align-items-center p-2">
            <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            <span className="text-muted small">Loading store hours...</span>
        </div>
    );

    // Return null if shop is open (won't display anything)
    if (isShopOpen) return null;

    // Determine if shop is emergency closed
    const isEmergencyClosed = settings && !(Number(settings.is_open));

    // Format days string for display
    const formattedDays = settings?.days_open ? DayFomatter(settings.days_open) : "";

    // Display closed message if shop is closed
    return (
        <div className="alert alert-danger my-0 py-2 d-flex align-items-center justify-content-center" role="alert">
            <div className="d-flex align-items-center">
                <i className="bi bi-clock me-2"></i>
                <div>
                    <span className="fw-medium">We're currently closed.</span>
                    {/* Only show opening times if not emergency closed */}
                    {settings?.opening_time && settings?.days_open && !isEmergencyClosed && (
                        <span className="ms-1">Open {formattedDays} from {settings.opening_time} to {settings.closing_time}</span>
                    )}
                </div>
            </div>
        </div>
    );
}

export default OpeningTime;