import { ChevronDown, CircleX, Search } from "lucide-react";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import type {
  SelectContentProps,
  SelectContextType,
  SelectItemProps,
  SelectLabelProps,
  SelectProps,
  SelectTriggerProps,
  SelectValueProps,
} from "./types";
import { cn } from "../../lib/utils/cn"; 
const SelectContext = createContext<SelectContextType | null>(null);

export const Select = ({
  onValueChange,
  defaultValue,
  disabled = false,
  className,
  options,
  renderOptions,
  withSearch,
  isMultiple,
  children,
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedValue, setSelectedValue] = useState<string[]>(
    defaultValue || []
  );
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const handleValueChange = (value: string) => { 
    if (isMultiple) {
      if (selectedValue.includes(value)) {
        const newValue = selectedValue.filter((v) => v !== value);
        setSelectedValue(newValue);
        onValueChange?.(newValue.join(", "));
      } else {
        const newValue = [...selectedValue, value];
        setSelectedValue(newValue);
        onValueChange?.(newValue.join(", "));
      }
      return;
    }
    setSelectedValue([value]);
    onValueChange?.(value);
    setIsOpen(false);
  };

  const contextValue = {
    isOpen,
    setIsOpen,
    selectedValue,
    setSelectedValue,
    searchFilter,
    setSearchFilter,
    handleValueChange,
    onValueChange,
    disabled,
    triggerRef,
    labelRef,
    withSearch,
    isMultiple,
    options,
    renderOptions, 
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchFilter("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []); 
  
  return (
    <SelectContext.Provider value={contextValue}>
      <div
        ref={wrapperRef}
        className={cn(
          "relative flex flex-row gap-2 w-full items-center",
          className
        )}
      >
        {children} 
        {contextValue.isOpen &&
        contextValue.renderOptions!(
          contextValue.options
            .filter((option) =>
              option.label.toLowerCase().includes(contextValue.searchFilter?.toLowerCase() ?? "")
            )
            .map((option) => ({
              ...option,
              label: (
                <HighlightedLabel
                  label={option.label}
                  search={contextValue.searchFilter}
                />
              ),
            }))
        )}
      </div>
    </SelectContext.Provider>
  );
};

const SelectLabel = ({ label, className }: SelectLabelProps) => {
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error("SelectLabel must be used within a Select component");
  }

  const { labelRef } = context;
  return <div ref={labelRef} className={className}>{label}</div>;
};

SelectLabel.displayName = "Select.SelectLabel";
Select.SelectLabel = SelectLabel;

const SelectTrigger = ({
  children,
  className,
  onClick,
  ...rest
}: SelectTriggerProps) => {
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error("SelectTrigger must be used within a Select component");
  }

  const { isOpen, setIsOpen, disabled: isDisabled, triggerRef, setSearchFilter } = context;
  const baseClassName = `w-full border-gray-300 bg-white border  px-2  rounded flex items-center p-2`;
  const highLightedClassName =
    "border-gray-100 items-center rounded  border-2  shadow-[0px_0px_0px_2px_#45755D4D]";
  const disabledCss = "bg-gray-300 cursor-not-allowed opacity-60";
  return (
    <div
      ref={triggerRef}
      className={cn(baseClassName, className, {
        [disabledCss]: isDisabled,
        [highLightedClassName]: isOpen,
      })}
      onClick={(event) => {
        if (isDisabled) return;
        onClick?.(event); 
        setIsOpen(!isOpen);
        setSearchFilter("");
      }}
      {...rest}
    >
      {children}
      <ChevronDown
        className={cn("text-leaf-green-1 h-4 w-4 transition-transform", {
          [disabledCss]: isDisabled,
          "rotate-180": isOpen,
        })}
      />
    </div>
  );
};

SelectTrigger.displayName = "Select.SelectTrigger";
Select.SelectTrigger = SelectTrigger;
const SelectValue = ({
  placeholder,
  className,
  onFocus,
  type = "text",
  ...rest
}: SelectValueProps) => {
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error("SelectValue must be used within a Select component");
  } 
  const { selectedValue, setSelectedValue } = context;

  const removeItem = (value: string) => {
    const newValue = selectedValue.filter((v) => v !== value);
    setSelectedValue(newValue);
    context.onValueChange?.(newValue.join(", "));
  };

  return (
    <div className="w-full flex gap-2 flex-wrap">
      {placeholder && selectedValue.length === 0 && (
        <span className={cn("text-gray-500", className)}>{placeholder}</span>
      )}
      {selectedValue?.map((value: string) => (
        <div
          className="flex justify-between gap-2 items-center w-fit bg-gray-100 rounded-2xl p-1 text-gray-500 text-sm z-50 "
          data-testid={`selected-${value}`}
          key={value}
        >
          {value}
          <CircleX
            data-testid="remove-item"
            className="cursor-pointer"
            size={20}
            onClick={(e) => {
              e.stopPropagation(); // 👈 prevents parent onClick
              removeItem(value);
            }}
          />
        </div>
      ))}
    </div>
  );
};

SelectValue.displayName = "Select.SelectValue";
Select.SelectValue = SelectValue;

const SelectContent = ({
  children,
  className,
  ...rest
}: SelectContentProps) => {
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error("SelectContent must be used within a Select component");
  }

  const { isOpen, triggerRef, labelRef, withSearch } = context;
  const contentRef = useRef<HTMLDivElement>(null);
  const [openUpward, setOpenUpward] = useState(false);

  useEffect(() => {
    if (
      !isOpen ||
      !contentRef.current ||
      !triggerRef.current ||
      !labelRef.current
    )
      return;
    const contentHeight = contentRef.current.offsetHeight;
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - triggerRect.bottom;
    const spaceAbove = triggerRect.top;

    if (spaceBelow < contentHeight && spaceAbove > contentHeight) {
      setOpenUpward(true);
    } else {
      setOpenUpward(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;
  const labelWidth = labelRef?.current?.clientWidth;
  const baseClassName = cn(
    `shadow-1 absolute right-0  z-[1001] mt-1 rounded  border border-gray-300 bg-white ml-2`,
    openUpward ? "bottom-full mb-1" : "top-full mt-1"
  ); 
  const { 
    setSearchFilter,
  } = context;
  return (
    <div
      ref={contentRef}
      className={cn(baseClassName, className)}
      {...rest}
      style={{ left: labelWidth + "px" }}
    >
      <div
        className={cn(
          " relative flex items-center gap-2 border-b border-gray-300 p-2", 
        )}
      >
        <Search size={20} className="absolute" /> 
        {withSearch && (
          <input
          type={"text"} 
          onChange={(e) => {
            setSearchFilter(e.target.value); 
          }} 
          className={cn("w-full pl-6 outline-none", className)} 
          {...rest}
        />
)}
      </div>
      {children}
    </div>
  );
};

SelectContent.displayName = "Select.SelectContent";
Select.SelectContent = SelectContent;

const SelectItem = ({
  children,
  className,
  value,
  ...rest
}: SelectItemProps) => {
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error("SelectItem must be used within a Select component");
  }
  const { handleValueChange } = context;

  return (
    <div
      className={cn(
        "flex cursor-pointer gap-2 px-4 py-2 text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none",
        className
      )}
      data-testid={`option-${value.props.label.toLowerCase()}`} // Add unique test ID
      onClick={() => handleValueChange(value.props.label)}
      {...rest}
    >
      {children}
    </div>
  );
};

SelectItem.displayName = "Select.SelectItem";
Select.SelectItem = SelectItem;

const HighlightedLabel = ({
  label,
  search,
}: {
  label: string;
  search?: string;
}) => {
  if (!search) return <>{label}</>;

  const regex = new RegExp(`(${search})`, "i");
  const parts = label.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <span key={i} className="bg-yellow-200 font-medium">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
};
