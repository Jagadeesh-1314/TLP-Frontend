import { Link } from "react-router-dom";

export function SuppleExceptions() {
  return (
    <div>
      Here are some solutions for handling possible exceptions in supplementary:
      <ol
        style={{
          listStyle: "number",
          paddingLeft: "2.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.8rem",
          marginTop: "1rem",
        }}
      >
        <li>
          If there is a need to change the subjects for the student after taking
          a print,
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
              Go to <Link to={"/manage-database"}>Manage Database</Link>
            </li>
            <li>
              Now, select the table as <code>Print Supplementary</code>, then
              enter the roll number and search.
            </li>
            <li>
              Select all the records and then click on{" "}
              <code>Delete Selected</code>. This will delete all the records for
              that roll number from print table. Now you need to re-select the
              subjects.
            </li>
          </ul>
        </li>
        <li>
          If there is a need to change the values from the database after
          registration,
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
              Go to <Link to={"/manage-database"}>Manage Database</Link>
            </li>
            <li>
              Now, select the table as <code>Paid Supplementary</code>, then
              enter the roll number and search.
            </li>
            <li>
              Here you can edit, delete records from the registered table of
              supplementary. You can find the related actions at the end of each
              row.
            </li>
            <li>
              If you want to delete multiple values at once, you can select the
              rows using check boxes and the click <code>Delete Selected</code>.
              This will delete all the selected rows.
            </li>
          </ul>
        </li>
        <li className="font-semibold text-red-600">
          If there is any issue while using the application that you are not
          able to understand, contact the developer for resolving the issue.
        </li>
      </ol>
    </div>
  );
}
