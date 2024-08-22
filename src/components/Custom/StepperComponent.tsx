import React, { useEffect } from "react";

const stepperStyles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    maxWidth: "95vw",
    margin: "0 auto",
    padding: "10px",
    boxSizing: "border-box",
  } as React.CSSProperties,
  stepper: {
    display: "flex",
    justifyContent: "space-between",
    listStyleType: "none",
    padding: "0",
    margin: "20px 0",
    width: "100%",
    maxWidth: "80vw",
    fontSize: "0.75rem",
  } as React.CSSProperties,
  step: (isActive: boolean, isCompleted: boolean) =>
    ({
      flex: "1",
      textAlign: "center" as const,
      padding: "10px",
      borderBottom: `2px solid ${isActive ? "blue" : "lightgray"}`,
      color: isActive ? "blue" : isCompleted ? "green" : "gray",
      position: "relative" as const,
      transition: "all 0.3s ease-in-out",
      listStyle: "none",
    } as React.CSSProperties),
  stepLabel: {
    position: "relative" as const,
    zIndex: 1,
    padding: "10px 0",
  } as React.CSSProperties,
  tickMark: {
    position: "absolute" as const,
    top: "-10px",
    left: "50%",
    transform: "translateX(-50%)",
    fontSize: "1.25rem",
    color: "green",
    zIndex: 0,
  } as React.CSSProperties,
  activeDot: {
    position: "absolute" as const,
    top: "-15px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    backgroundColor: "blue",
    zIndex: 0,
    animation: "blink 1s infinite",
  } as React.CSSProperties,
};

const styleSheet = document.styleSheets[0];
const keyframes = `
@keyframes blink {
  0% { opacity: 1; }
  50% { opacity: 0; }
  100% { opacity: 1; }
}
`;
styleSheet.insertRule(keyframes, styleSheet.cssRules.length);

interface StepperComponentProps {
  sub: { subCode: string; subname: string }[];
  len: number;
}

const StepperComponent: React.FC<StepperComponentProps> = ({ sub, len }) => {
  useEffect(() => {
    const activeStepElement = document.querySelector(`li[data-step="${len}"]`);
    if (activeStepElement) {
      activeStepElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [len]);

  return (
    <div style={stepperStyles.container}>
      <ul style={stepperStyles.stepper}>
        {sub.map((subject, index) => {
          const isActive = len === index;
          const isCompleted = len > index;
          return (
            <li
              key={subject.subCode}
              style={stepperStyles.step(isActive, isCompleted)}
              data-step={index}
            >
              {isCompleted && <div style={stepperStyles.tickMark}>✔</div>}
              {isActive && <div style={stepperStyles.activeDot} />}
              <div style={stepperStyles.stepLabel}>{subject.subname}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default StepperComponent;
