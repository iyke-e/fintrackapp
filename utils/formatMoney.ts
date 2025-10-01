export const formatMoney = (amount: number): string => {
  if (amount >= 1_000_000) {
    return (amount / 1_000_000).toFixed(2).replace(/\.00$/, "") + "M";
  }
  return amount.toLocaleString();
};
