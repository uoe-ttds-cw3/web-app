export type Operator =
  | "contains"
  | "AND"
  | "OR"
  | "phrase"
  | "proximity";

export type Joiner = "AND" | "OR" | "NOT";

export interface QueryRow {
  id: string;
  operator: Operator;
  value1: string;
  value2: string;
  distance: string;
}
