export type NSInputType = "text" | "date" | "radio" | "checkbox" | "select" | "textarea" | "number" | "email" | "url" | "password";

export interface NSInput {
  id: string;
  label: string;
  validators: NSValidator[];
}

export interface NSInputOption {
  value: string;
  label: string;
}

export interface NSValidator {
  name: string;
  message: string;
  showErrorOnChange?: boolean;
}
