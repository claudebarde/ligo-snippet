export const cameligoCode = `
(*_*
name: CameLIGO Contract
language: cameligo
compile:
    entrypoint: main
dryRun:
    entrypoint: main
    parameters: Increment (1)
    storage: 0
deploy:
    entrypoint: main
    storage: 0
evaluateValue:
    entrypoint: ""
evaluateFunction:
    entrypoint: add
    parameters: (5, 6)
generateDeployScript:
    entrypoint: main
    storage: 0
*_*)
type storage = int

(* variant defining pseudo multi-entrypoint actions *)

type action =
| Increment of int
| Decrement of int

let add (a,b: int * int) : int = a + b
let sub (a,b: int * int) : int = a - b

(* real entrypoint that re-routes the flow based on the action provided *)

let main (p,s: action * storage) =
 let storage =
   match p with
   | Increment n -> add (s, n)
   | Decrement n -> sub (s, n)
 in ([] : operation list), storage`;

export const pascaligoCode = `
(*_*
name: PascaLIGO Contract
language: pascaligo
compile:
  entrypoint: main
dryRun:
  entrypoint: main
  parameters: Increment (1)
  storage: 0
deploy:
  entrypoint: main
  storage: 0
evaluateValue:
  entrypoint: ""
evaluateFunction:
  entrypoint: add
  parameters: (5, 6)
generateDeployScript:
  entrypoint: main
  storage: 0
*_*)

/ variant defining pseudo multi-entrypoint actions
  type action is
  | Increment of int
  | Decrement of int
  
  function add (const a : int ; const b : int) : int is
    block { skip } with a + b
  
  function subtract (const a : int ; const b : int) : int is
    block { skip } with a - b
  
  // real entrypoint that re-routes the flow based
  // on the action provided
  function main (const p : action ; const s : int) :
    (list(operation) * int) is
    block { skip } with ((nil : list(operation)),
    case p of
    | Increment(n) -> add(s, n)
    | Decrement(n) -> subtract(s, n)
    end)`;

export const reasonligoCode = `
(*_*
name: ReasonLIGO Contract
language: reasonligo
compile:
  entrypoint: main
dryRun:
  entrypoint: main
  parameters: Increment (1)
  storage: 0
deploy:
  entrypoint: main
  storage: 0
evaluateValue:
  entrypoint: ""
evaluateFunction:
  entrypoint: add
  parameters: (5, 6)
generateDeployScript:
  entrypoint: main
  storage: 0
*_*)

type storage = int;

/* variant defining pseudo multi-entrypoint actions */

type action =
  | Increment(int)
  | Decrement(int);

let add = ((a,b): (int, int)): int => a + b;
let sub = ((a,b): (int, int)): int => a - b;

/* real entrypoint that re-routes the flow based on the action provided */

let main = ((p,storage): (action, storage)) => {
  let storage =
    switch (p) {
    | Increment(n) => add((storage, n))
    | Decrement(n) => sub((storage, n))
    };
  ([]: list(operation), storage);
};`;
