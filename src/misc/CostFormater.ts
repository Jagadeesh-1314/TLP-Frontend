export const formatCost = (cost: number | null) => {
  if (typeof cost === "number")
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(cost);

  return null;
};
