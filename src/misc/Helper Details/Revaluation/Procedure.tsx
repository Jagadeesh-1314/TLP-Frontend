export function RevalProcedure() {
  return (
    <div>
      <span>These are the steps to followed to register for revaluation:</span>
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
          Provide the right details for the parameters in their respective
          fields.
        </li>
        <li>
          Click the <code>Search</code> button. If there is any valid data
          available in the database based on the given parameter values, you
          will be able to see all the subjects grouped by by semester.
        </li>
        <li>
          Since all the subjects are selected initially, you need to unselect
          the subject that the student does't want to apply.
        </li>
        <li>
          Once all the selected subjects match with the student's preffered
          subjects, click on <code>Generate Form</code>. This will generate a
          page with three forms; one for Exam Branch, one for Accounts Section
          and last one for Student.
        </li>
        <li>
          Now click on <code>Print</code>. This will open a pop-up, make sure
          all the points are being covered before taking a print and hand it
          over to the student.
        </li>
        <li>
          Once the student comes back from accounts section after completing the
          payment, search for the same number. This time you can find that the
          subjects that the student took print for are fetched. Now you can
          directly click <code>Register</code> button to complete registration.
        </li>
        <li className="font-semibold text-red-600">
          Before registering, select the regular semester first.
        </li>
        <li>
          Refer the <i className="font-semibold">Exceptions</i> section to know
          more about handling data related to registring for revaluation.
        </li>
      </ol>
    </div>
  );
}
