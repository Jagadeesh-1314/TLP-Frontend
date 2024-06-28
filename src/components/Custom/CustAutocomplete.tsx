import { Autocomplete, TextField } from "@mui/material";
import { ExamSearchSubjectsProps } from "../../Types/responseTypes";

export function CustAutocomplete({
  options,
  label,
  sem,
  revalSubs,
  setSelectedSubjects,
  studentCopyGenerated,
  printTable,
}: {
  options: string[];
  label: string;
  sem: "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H";
  revalSubs: ExamSearchSubjectsProps;
  setSelectedSubjects: React.Dispatch<
    React.SetStateAction<ExamSearchSubjectsProps>
  >;
  studentCopyGenerated: boolean;
  printTable: boolean;
}) {
  return (
    <Autocomplete
      multiple
      disableCloseOnSelect
      filterSelectedOptions
      options={options}
      defaultValue={options}
      renderInput={(params) => (
        <TextField {...params} label={label} variant="outlined" />
      )}
      fullWidth
      sx={{ bgcolor: "white" }}
      className="col-span-5 rounded-md"
      disabled={options.length === 0}
      readOnly={studentCopyGenerated || printTable}
      onChange={(_, newValue) => {
        const selectedCodes = newValue.map((selectedSubject) => {
          const indx = revalSubs[sem].subNames.findIndex(
            (value) => value === selectedSubject
          );
          return revalSubs[sem].subCodes[indx];
        });
        setSelectedSubjects((prevState) => ({
          ...prevState,
          [sem]: {
            subNames: newValue,
            subCodes: selectedCodes,
          },
        }));
      }}
    />
  );
}
