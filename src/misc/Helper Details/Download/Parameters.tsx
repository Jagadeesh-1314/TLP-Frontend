export function DownParams() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        For <code>Download</code>
        <ul
          style={{
            listStyle: "disc",
            paddingLeft: "2.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.8rem",
            marginTop: "0.5rem",
          }}
        >
          <li>
            <code>Exam:</code> This field lets you select the type of exam for
            which you want to download detais.
          </li>
          <li>
            <code>Academic Year:</code> Academic year of the exam. (ex: 1, 2, 3,
            4 OR All). Allows you to download year specific results.
          </li>
          <li>
            <code>Semester:</code> Academic year of the exam. (ex: 1, 2 OR
            Both). Allows you to download semester specific results.
          </li>
          <li>
            <code>Type of Download:</code>
            <ol
              style={{
                listStyle: "number",
                paddingLeft: "2.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.8rem",
                marginTop: "0.5rem",
              }}
            >
              <li>
                <code>Registered:</code> This will download an excel which will
                have the data on who has registered for the selected type of
                exam.
              </li>
              <li>
                <code>Unregistered:</code> This will download an excel which
                will have the data on who has taken a print but not yet
                registered for the selected type of exam.
              </li>
              <li>
                <code>Report:</code> This will download an excel containing a
                report on how many students have registered for what subject for
                the selected type of exam.
              </li>
            </ol>
          </li>
        </ul>
      </div>
      <hr />
      <div>
        For <code>Truncate</code>
        <ul
          style={{
            listStyle: "disc",
            paddingLeft: "2.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.8rem",
            marginTop: "0.5rem",
          }}
        >
          <li>
            <code>Exam:</code> Type of exam where all the tables related to that
            exam are to be cleared..
          </li>
          <li>
            <code>Academic Year:</code> Academic year of the exam. (ex: 1, 2, 3,
            4 OR All). Allows you to clear year specific tables.
          </li>
          <li>
            <code>Semester:</code> Academic year of the exam. (ex: 1, 2 OR
            Both). Allows you to clear semester specific tables.
          </li>
        </ul>
      </div>
    </div>
  );
}
