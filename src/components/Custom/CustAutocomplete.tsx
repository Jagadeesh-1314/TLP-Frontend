import { Autocomplete, TextField } from "@mui/material";

export function CustAutocomplete({
  options,
  label,
  selectedBranches,
  setSelectedBranches,
}: {
  options: string[];
  label: string;
  selectedBranches: string[];
  setSelectedBranches: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  return (
    <Autocomplete
      multiple
      disableCloseOnSelect
      filterSelectedOptions
      options={options}
      value={selectedBranches}
      onChange={(_event, newValue) => setSelectedBranches(newValue)}
      renderInput={(params) => (
        <TextField {...params} label={label} variant="outlined" />
      )}
      fullWidth
      sx={{ bgcolor: "white" }}
      className="col-span-5 rounded-md"
    />
  );
}
