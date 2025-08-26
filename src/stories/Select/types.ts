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
  setSelectedValue: (val: string[]) => void;
  searchFilter: string;
  setSearchFilter: (val: string) => void;
  handleValueChange: (value: string) => void;
  onValueChange: (val: string) => void;
  disabled?: boolean;
  triggerRef: React.RefObject<HTMLDivElement>;
  labelRef: React.RefObject<HTMLDivElement>;
  withSearch: boolean | undefined;
  isMultiple: boolean | undefined;
  options?: Record<string, any>[];
  renderOptions?: (data: Record<string, any>[]) => React.ReactNode;
};

export type SelectContentProps = BaseSelectProps;
export type SelectItemProps = BaseSelectProps & {
  value: PropsWithChildren<{ props: Record<string, any> }>;
};

export type SelectLabelProps = BaseSelectProps & {
  label: string;
  className?: string;
};