const exampleRows = [
  {id: "a", balanceCents: 120, balance: {minor: 120, currency: "USD"}},
  {id: "b", balanceCents: 0, balance: {minor: 0, currency: "USD"}, note: "keep"}
];
function currentWrite(row, minor) { row.balance.minor = minor; }
