import type { Meta, StoryObj } from "@storybook/react";
import { Select } from "../../components/Select"; 
const data = [
  {
    label: "Option 1", 
   },
   {
    label: "Option with Icon",
    icon: "🍎",
   },
  {
    label: "Long Option 3",
   },
   {
    label: "Long Long Option 4",
   },
   {
    label: "Long Long Long 5",
   },
   {
    label: "Long Long Long Long Option 6",
   },
];
const meta = {
  title: "Tech Exam/Select",
  tags: ["autodocs"],
  component: Select, 
  argTypes: {
    id: { control: "text" },
    withSearch: { control: "boolean" },
    isMultiple: { control: "boolean" },
    onValueChange: { action: "valueChanged" }, 
    disabled: { control: "boolean" }, 
  },
  args: {
    onValueChange: (value: string) => {
      alert(`Selected value: ${value}`);
    },
  },
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { 
    id : "select-1",
    withSearch: true,
    isMultiple: false,
    defaultValue: ["Option 1"],
    disabled: false,
    options: data, 
    renderOptions: (data) => {  
      return <Select.SelectContent>
      {data.map(item => (
        <Select.SelectItem key={item.label} value={item.label}>
          <div className="flex flex-row gap-2">
            <div>{item.icon}</div>
            <div>{item.label}</div>
          </div>
        </Select.SelectItem>
      ))}
    </Select.SelectContent>
  }, 
    children: (
      <>
       <Select.SelectLabel label="Label" className="w-[200px]"/> 
        <Select.SelectTrigger>
          <Select.SelectValue placeholder="Select an option..." />
        </Select.SelectTrigger>
        {/* <Select.SelectContent> 
          {data.map(item => (
            <Select.SelectItem key={item.label} value={item.label}>
              <div className="flex flex-row gap-2">
              <div>
                  {item.icon}
                </div> 
               <div>
                  {item.label}
                </div> 
              </div>
            </Select.SelectItem>
          ))}
        </Select.SelectContent> */}

      </>
    ),
  },
};
