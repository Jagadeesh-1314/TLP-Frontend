import React, { forwardRef } from "react";
import Card from "@mui/material/Card";
import ColorRadioButtons from "./ColouredButtonGroup";
import { Typography } from "@mui/material";

interface RadiobuttonsProps {
  id: string;
  itemKey: number;
  len: number;
  score: Record<string, Record<string, number>>;
  setScore: React.Dispatch<React.SetStateAction<Record<string, Record<string, number>>>>;
  onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  question: string;
  isUnfilled: boolean;
  onSelect: () => void;
}

const Radiobuttons = forwardRef<HTMLDivElement, RadiobuttonsProps>(({
  id,
  itemKey: itemKey,
  len,
  score,
  setScore,
  onClick,
  question,
  isUnfilled,
  onSelect,
}, ref) => {
  const handleSelect = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    onSelect();
    onClick(event);
  };

  return (
    <div id={`card-${id}`} key={itemKey} ref={ref} onClick={handleSelect} style={{ margin: 10, width: '95%' }}>
      <Card
        sx={{
          width: '100%',
          '@media (min-width: 600px)': {
            width: '65%',
            margin: 'auto',
          },
        }}
        style={{
          padding: 20,
          outline: isUnfilled ? '2px solid red' : 'none',
        }}
        variant="outlined"
      >
        <div>
        <Typography>{`${parseInt(id) + 1}) ${question}`}</Typography> 
        </div>
        <ColorRadioButtons labels={["1", "2", "3", "4", "5"]} id={id} score={score} setScore={setScore} len={len} />
      </Card>
    </div>
  );
});

export default Radiobuttons;
