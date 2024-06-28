import React from "react";

import Card from "@mui/material/Card";
import ColorRadioButtons from "./ColouredButtonGroup";
import { Typography } from "@mui/material";

function Radiobuttons({
  question,
  score,
  setScore,
  id,
  len,
  key,
  onClick,
  reset,
}: {
  id: string;
  key: number;
  len:  number;
  score: Record<string, Record<string, number>>;
  setScore: React.Dispatch<React.SetStateAction<Record<string, Record<string, number>>>>;
  onClick: React.MouseEventHandler<HTMLDivElement>;
  question: string;
  reset: boolean;
}) {
  
  return (
    <div id={`card-${id}`} key={key} onClick={onClick} style={{ margin: 10, width:'95%' }} >
      <Card
        sx={{
          width: '100%',
          '@media (min-width: 600px)': {
            width: '65%',
            margin: 'auto',
          },
        }}
        style={{ padding: 20 }}
        variant="outlined"
      >
        <div>
          <Typography>{question}</Typography>
        </div>
        <ColorRadioButtons labels={["1", "2", "3", "4", "5"]} reset={reset} id = {id} score={score} setScore = {setScore} len = {len} />
      </Card>
    </div>
  );
}

export default Radiobuttons;
