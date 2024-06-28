import dayjs from "dayjs";

export function CbtParams() {
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
        <code>Exam Year:</code> The year of the exam. (ex: {dayjs().year()})
      </li>
      <li>
        <code>Branch:</code> Branch of the student (ex: CSE, EEE, IT, etc.)
      </li>
      <li>
        <code>Year:</code> Academic year of the student (ex: 1, 2, 3, 4)
      </li>
      <li>
        <code>Semester:</code> Semester of the student (ex: 1, 2)
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
