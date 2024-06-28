export function DownProcedure() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <span>
          For <code>Download</code>
        </span>
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
            Select the type of exam whose details you want to download. Then
            select the <code>Academic Year</code> and the <code>Semester</code>{" "}
            for downloading specific details. Select <code>All</code> for year
            and <code>Both</code> to download the entire table.
          </li>
          <li>
            Now select the type of download and click on download button to
            download an excel file with the related data.
          </li>
        </ol>
      </div>
      <hr />
      <div>
        <span>
          For <code>Truncate</code>
        </span>
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
          <li>Select the type of exam whose table values you want to clear.</li>
          <li>
            Select a specific year and semester for clearing year and sem
            specific results. If you select <code>All</code> for year and{" "}
            <code>Both</code> for semester, the entire table will be cleared .
          </li>
          <li>
            Now click on <code>Truncate</code> to clear the desired values from
            selected table.
          </li>
        </ol>
        <div className="font-semibold text-red-600 m-4">
          For either download or truncate, if you have <code>All</code> for year
          or <code>Both</code> for semester selected, you can only have{" "}
          <code>Both</code> for semester and <code>All</code> for year selected
          respectively.{" "}
        </div>
      </div>
    </div>
  );
}
