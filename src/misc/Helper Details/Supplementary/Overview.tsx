import { Link } from "react-router-dom";

export function SuppleOverview() {
  return (
    <span>
      This page lets you register for Supplementary exam for students for the
      subjects that they are eligible to write. To change the costs/fines, you
      can change them in <Link to={"/manage-costs"}>Manage Costs</Link>.
    </span>
  );
}
