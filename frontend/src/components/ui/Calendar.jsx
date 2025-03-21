import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const Calendar = ({ className }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
<div className={`w-full p-4 ${className}`}>
<DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        inline
        className="w-full"
      />
    </div>
  );
};
