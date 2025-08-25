import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Select } from "./Select";

const options = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Cherry", value: "cherry" },
];

const renderSelect = (props: any = {}) =>
  render(
    <Select
      options={options}
      renderOptions={(opts) => (
        <div data-testid="options">{opts.map((opt) => opt.label)}</div>
      )}
      {...props}
    >
      <Select.SelectTrigger>
        <Select.SelectValue placeholder="Select fruit" />
      </Select.SelectTrigger>
      <Select.SelectContent>
        {options.map((opt) => (
          <Select.SelectItem key={opt.value} value={{ props: opt }}>
            {opt.label}
          </Select.SelectItem>
        ))}
      </Select.SelectContent>
    </Select>
  );

describe("Select", () => {
  it("renders with placeholder", () => {
    renderSelect();
    expect(screen.getByText("Select fruit")).toBeInTheDocument();
  });

  it("opens and closes dropdown on trigger click", async () => {
    renderSelect();
    const trigger = screen.getByText("Select fruit");
    await userEvent.click(trigger);
    expect(screen.getByTestId("options")).toBeInTheDocument();

    await userEvent.click(trigger);
    expect(screen.queryByTestId("options")).not.toBeInTheDocument();
  });

  it("selects a single option", async () => {
    const handleChange = vi.fn();
    renderSelect({ onValueChange: handleChange });

    const trigger = screen.getByText("Select fruit");
    await userEvent.click(trigger);

    await userEvent.click(screen.getByText("Apple"));
    expect(handleChange).toHaveBeenCalledWith("Apple");
    expect(screen.getByText("Apple")).toBeInTheDocument();
  });

  it("supports multiple selection", async () => {
    const handleChange = vi.fn();
    renderSelect({ onValueChange: handleChange, isMultiple: true });

    const trigger = screen.getByText("Select fruit");
    await userEvent.click(trigger);

    await userEvent.click(screen.getByText("Apple"));
    await userEvent.click(screen.getByText("Banana"));

    expect(handleChange).toHaveBeenLastCalledWith("Apple, Banana");
    expect(screen.getByTestId("selected-Apple")).toBeInTheDocument();
    expect(screen.getByTestId("selected-Banana")).toBeInTheDocument();
  });

  it("removes selected item via CircleX", async () => {
    const handleChange = vi.fn();
    renderSelect({
      onValueChange: handleChange,
      isMultiple: true,
      defaultValue: ["Apple"],
    });

    expect(screen.getByText("Apple")).toBeInTheDocument();

    const removeBtn = screen.getByTestId("remove-item", { hidden: true });
    await userEvent.click(removeBtn);

    expect(handleChange).toHaveBeenCalledWith("");
    expect(screen.queryByText("Apple")).not.toBeInTheDocument();
  });

//   it("filters options with search", async () => {
//     renderSelect({ withSearch: true });
  
//     const trigger = screen.getByText("Select fruit");
//     await userEvent.click(trigger);
  
//     const input = screen.getByRole("textbox");
//     await userEvent.type(input, "ban");
//     screen.debug()
//     // Check that "Banana" is visible and "Apple" is not
//     expect(screen.getByTestId("option-banana")).toBeInTheDocument();
//     expect(screen.queryByTestId("option-apple")).not.toBeInTheDocument();
//   });

  it("highlights matched text", async () => {
    renderSelect({ withSearch: true });

    const trigger = screen.getByText("Select fruit");
    await userEvent.click(trigger);

    const input = screen.getByRole("textbox");
    await userEvent.type(input, "che");

    // Highlighted part inside span
    expect(screen.getByText("Che")).toHaveClass("bg-yellow-200");
  });
});
