import dayjs from "dayjs";

export function RevalParams() {
  return (
    <ul
      style={{
        listStyle: "disc",
        paddingLeft: "2.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.8rem",
      }}
    >
      <li>
        <code>Exam Year:</code> The year of the most recent regular exam. (ex:{" "}
        {dayjs().year()})
      </li>
      <li>
        <code>Exam Month:</code> The month of the most recent regular exam. (ex:{" "}
        {dayjs().month() + 1})
      </li>
      <li>
        <code>Roll Number:</code> The roll number of the student. (ex:
        19R11A05N8)
      </li>
      <span className="font-semibold text-red-600">
        All the above parameters are required to perform search.
      </span>
    </ul>
  );
}
