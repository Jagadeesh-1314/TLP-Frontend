import { Grid } from "@mui/material";
import { formatCost } from "../misc/CostFormater";
import { CustTextField } from "./Custom/CustTextField";

function CostField({ cost, label }: { cost: number, label: string }) {
    return <Grid item className="Costs">
        <CustTextField
            disabled
            fullWidth
            value={formatCost(cost)}
            label={label}
            style={{
                backgroundColor: "white",
            }}
            inputProps={{ style: { textAlign: "right" } }}
        />
    </Grid>
}

interface props {
    data: {
        baseCost: number;
        additionalCost: number;
        maxCost: number;
    }
}

const DefaultCosts: React.FC<props> = (props) => {
    const {baseCost, additionalCost, maxCost} = props.data ;
    const costField = [
        {
            "cost": baseCost,
            "label": "Base Cost"
        },
        {
            "cost": additionalCost,
            "label": "Additional Cost"
        },
        {
            "cost": maxCost,
            "label": "Max Cost"
        }
    ]

    return (
        <Grid container spacing={2} className="no-print">
            {
                costField.map((param) => (
                    <CostField cost={param.cost} label={param.label}/>
                ))
            }
        </Grid>
    )
}

export default DefaultCosts;