import { ChangeEvent, ReactNode } from 'react';

export interface inputText {
  type: 'text';
  id: string;
  name: string;
  placeholder: string;
  required: boolean;
}

export interface inputNumber {
  type: 'number';
  id: string;
  name?: string;
  min?: number;
  max?: number;
  placeholder: string;
  required: boolean;
}

export interface inputFile {
  type: 'file';
  id: string;
  accept: string;
  required: boolean;
}

export interface inputSelect {
  type: 'select';
  id: string;
  name?: string;
  placeholder: string;
  required: boolean;
  children: ReactNode;
}

export interface inputTextArea {
  type: 'textarea';
  id: string;
  name?: string;
  rows: number;
  cols: number;
  placeholder: string;
  required: boolean;
}

export interface inputCheckbox {
  type: 'checkbox';
  id: string;
  name?: string;
  placeholder?: string;
  required: boolean;
}

export interface inputSelectResponse {
  type: 'selectResponse';
  id: string;
  name?: string;
  required: boolean;
}

export interface inputDate {
  type: 'date';
  id: string;
  name?: string;
  required: boolean;
}

export type TypeInput =
  | inputFile
  | inputNumber
  | inputSelect
  | inputText
  | inputTextArea
  | inputCheckbox
  | inputSelectResponse
  | inputDate;
