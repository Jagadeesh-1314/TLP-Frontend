export function SuppleParams() {
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
        <code>Roll Number:</code> The roll number of the student. (ex:
        19R11A05N8)
      </li>
      <span className="font-semibold text-red-600">
        The above parameter is required to perform search.
      </span>
    </ul>
  );
}
