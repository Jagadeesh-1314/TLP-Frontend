import * as React from "react";
import Radio from "@mui/material/Radio";
import { RadioGroup, FormControlLabel } from "@mui/material";

interface ColorRadioButtonsProps {
  labels?: ("1" | "2" | "3" | "4" | "5")[];
  id: string;
  len: number;
  score: Record<string, Record<string, number>>;
  setScore: React.Dispatch<React.SetStateAction<Record<string, Record<string, number>>>>;
}

export default function ColorRadioButtons({ labels = ["1", "2", "3", "4", "5"], id, score, setScore, len }: ColorRadioButtonsProps) {

  const textLabels: Record<"1" | "2" | "3" | "4" | "5", string> = {
    "1": "Poor",
    "2": "Average",
    "3": "Good",
    "4": "Very Good",
    "5": "Excellent"
  };

  const handleScoreChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedScore = parseInt(event.target.value, 10);
    setScore((prevScore) => ({
      ...prevScore,
      [len]: { ...prevScore[len], [id]: selectedScore }
    }));
  };

  return (
    <div className="MuiFormGroup-root">
      <RadioGroup
        name="score"
        value={score[len] === undefined || score[len][id] === undefined ? "" : score[len][id] + ''}
        onChange={handleScoreChange}
        aria-required
        sx={{ display: 'flex', padding: 0 }}
      >
        {labels.map((value) => (
          <FormControlLabel
            key={value}
            value={value}
            control={<Radio />}
            label={`${textLabels[value]} - ['${value.toString()}']`} 
            labelPlacement="end"
          />
        ))}
      </RadioGroup>
    </div>
  );
}
