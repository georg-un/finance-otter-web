export interface HeaderConfig {
  leftButton: HeaderButtonConfig;
  rightButton: HeaderButtonConfig;
  showLogo: boolean;
}

export interface HeaderButtonConfig {
  icon: string;
  text: string;
}

export class HeaderButtonOptions {
  public static readonly Menu: HeaderButtonConfig = { icon: 'menu', text: 'Menu' };
  public static readonly Back: HeaderButtonConfig = { icon: 'arrow_back', text: 'Back' };
  public static readonly Cancel: HeaderButtonConfig = { icon: 'clear', text: 'Cancel' };
  public static readonly Done: HeaderButtonConfig = { icon: 'done', text: 'Done' };
  public static readonly Add: HeaderButtonConfig = { icon: 'add', text: 'Add' };
  public static readonly Edit: HeaderButtonConfig = { icon: 'edit', text: 'Edit'};
}
