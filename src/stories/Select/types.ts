import type { PropsWithChildren } from "react"; 

export type BaseSelectProps = PropsWithChildren<
  Pick<React.ComponentProps<"input">, "onFocus"> & {
    className?: string;
    testId?: string;
    type?: string;
    id?: string;
  }
>;

export type SelectProps = BaseSelectProps & {
  onValueChange: (val: string) => void;
  defaultValue?: string[];
  value?: string[];
  disabled?: boolean; 
  withSearch?: boolean;
  isMultiple?: boolean; 
  options: Record<string, any>[];
  renderOptions?: (data: Record<string, any>[]) => React.ReactNode;
};

export type SelectTriggerProps = BaseSelectProps & {
  defaultValue?: string;
  onClick?: (event: Event | React.MouseEvent) => void;
};

export type SelectValueProps = BaseSelectProps & {
  placeholder: string;
};

export type SelectContextType = {
  isOpen: boolean; 
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedValue:  string[];
  setSelectedValue: React.Dispatch<React.SetStateAction<string>>;
  setSearchFilter: React.Dispatch<React.SetStateAction<string>>;
  handleValueChange: (value: string) => void;
  onValueChange: (val: string) => void;
  disabled?: boolean;
  triggerRef: React.RefObject<HTMLDivElement>;
  labelRef: React.RefObject<HTMLDivElement>;
  withSearch: boolean | undefined;
};

export type SelectContentProps = BaseSelectProps;
export type SelectItemProps = BaseSelectProps & {
  value: React.ReactNode;
};

export type SelectLabelProps = BaseSelectProps & {
  label: string;
  className?: string;
};