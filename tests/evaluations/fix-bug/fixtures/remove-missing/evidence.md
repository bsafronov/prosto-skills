The user asks: Repair removeLine and supply a focused regression for the established defect. Return source for review; do not edit files in this artificial task.
Contract: removeLine(lines, id) returns a new array. Remove only the first matching line. Preserve all other entries, order, and object identities. Never mutate the input array or entries. An absent ID and an empty array return a new array with the same contents.
Established cause: findIndex returns -1 for an absent ID; splice(-1, 1) then removes the last line. A real caller exercises src/cart.js directly; its empty-cart check does not prevent the absent-ID case in a nonempty cart. Fix the shared helper so all callers receive the correction. No API redesign is needed.
A supplied reproduction: removeLine([{id:"A"},{id:"B"}], "missing") returns only A. Expected: A and B.
The original implementation is src/cart.js. No checks have been run by you yet.
