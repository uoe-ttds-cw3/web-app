export type Operator =
  | "contains"
  | "AND"
  | "OR"
  | "NOT"
  | "phrase"
  | "proximity";

export type Joiner = "AND" | "OR";

export interface QueryRow {
  id: string;
  operator: Operator;
  value1: string;
  value2: string;
  distance: string;
}
