import React, { useState } from "react";
import { useTelegram } from "../../utils/twa";

export interface RangeSliderProps {
    min: number;
    max: number;
    step: number;
}

const RangeSlider = ({
    min,
    max,
    step
}: RangeSliderProps) => {
  const [value, setValue] = useState(min);

  const { vibrate } = useTelegram();

  const handleSliderChange = (e: any) => {
    vibrate("light");
    setValue(parseFloat(e.target.value));
  };

  const handleClickValue = (newValue: any) => {
    setValue(newValue);
  };

  const stepLabels = [
    { label: "1%", value: 1 },
    { label: "2%", value: 2 },
    { label: "5%", value: 5 },
    { label: "10%", value: 10 },
    { label: "20%", value: 20 },
    { label: "30%", value: 30 },
    { label: "50%", value: 50 },
    { label: "75%", value: 75 },
    { label: "100%", value: 100 },
  ];

  return (
    <div style={{ padding: "20px", width: "300px" }}>
      <input
        type="range"
        min={1}
        max={100}
        value={value}
        onChange={handleSliderChange}
        style={{ width: "100%" }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
        {stepLabels.map((stepLabel, index) => (
          <span
            key={index}
            onClick={() => handleClickValue(stepLabel.value)}
            style={{
              cursor: "pointer",
              fontWeight: value === stepLabel.value ? "bold" : "regular",
              color: value === stepLabel.value ? "rgba(72, 23, 1, 1)" : "rgba(72, 23, 1, 0.5)",
            }}
          >
            {stepLabel.label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default RangeSlider;
