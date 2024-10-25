import React, { useState } from "react";

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

  const handleSliderChange = (e: any) => {
    setValue(parseFloat(e.target.value));
  };

  const handleClickValue = (newValue: any) => {
    setValue(newValue);
  };

  const stepLabels = [
    { label: "1.1x", value: 1.1 },
    { label: "20x", value: 20 },
    { label: "40x", value: 40 },
    { label: "60x", value: 60 },
    { label: "80x", value: 80 },
    { label: "100x", value: 100 },
  ];

  return (
    <div style={{ padding: "20px", width: "300px" }}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
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
              color: value === stepLabel.value ? "green" : "white",
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
