export type NSInputType = "text" | "date" | "radio" | "checkbox" | "select" | "textarea" | "number" | "email" | "url" | "password";

export interface NSInput {
  id: string;
  label: string;
  validators: NSErrorMessage[];
}

export interface NSInputOption {
  value: string;
  label: string;
}

export interface NSErrorMessage {
  name: string;
  text: string;
  showErrorOnChange?: boolean;
}
