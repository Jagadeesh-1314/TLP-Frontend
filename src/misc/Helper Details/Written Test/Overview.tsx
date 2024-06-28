import { Link } from "react-router-dom";

export function CbtOverview() {
  return (
    <span>
      This page lets you register for Written Test exam for students for the
      subjects that they are willing to write. To change the costs, you can
      change them in <Link to={"/manage-costs"}>Manage Costs</Link>.
    </span>
  );
}
