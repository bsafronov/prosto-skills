// Current records and legacy consumer operations; this representation remains
// authoritative until legacy writers are retired.
const exampleRows = [
  {id: "a", balanceCents: 120, note: "keep"},
  {id: "b", balanceCents: 0},
  {id: "c", balanceCents: -25}
];
function legacyRead(row) { return row.balanceCents; }
function legacyWrite(row, minor) { row.balanceCents = minor; }
