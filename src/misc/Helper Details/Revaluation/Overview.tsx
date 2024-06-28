import { Link } from "react-router-dom";

export function RevalOverview() {
  return (
    <span>
      This page lets you register Revaluation for students for the subjects that
      they want to apply for. To change the cost, you can change it in{" "}
      <Link to={"/manage-costs"}>Manage Costs</Link>.
    </span>
  );
}
