export class DynamicDialogData {
  bodyHTML: string;
  buttons: DynamicDialogButton[];
}

export class DynamicDialogButton {
  index: number;
  label: string;
  result: any;
}
