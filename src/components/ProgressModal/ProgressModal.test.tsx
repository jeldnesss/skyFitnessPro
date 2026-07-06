import { render, screen, fireEvent } from "@testing-library/react";
import ProgressModal from "./ProgressModal";

const exercises = [
  {
    _id: "1",
    name: "Приседания",
    quantity: 10,
  },
  {
    _id: "2",
    name: "Отжимания",
    quantity: 20,
  },
];

const onChange = jest.fn();
const onClose = jest.fn();
const onSave = jest.fn();

describe("ProgressModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("не рендерится если isOpen = false", () => {
    const { container } = render(
      <ProgressModal
        isOpen={false}
        exercises={exercises}
        values={[]}
        onChange={onChange}
        onClose={onClose}
        onSave={onSave}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  test("рендерит упражнения", () => {
    render(
      <ProgressModal
        isOpen={true}
        exercises={exercises}
        values={[0, 0]}
        onChange={onChange}
        onClose={onClose}
        onSave={onSave}
      />,
    );

    expect(screen.getByText("Приседания")).toBeInTheDocument();
    expect(screen.getByText("Отжимания")).toBeInTheDocument();
  });

  test("вызывает onChange при вводе", () => {
    render(
      <ProgressModal
        isOpen={true}
        exercises={exercises}
        values={[0, 0]}
        onChange={onChange}
        onClose={onClose}
        onSave={onSave}
      />,
    );

    const inputs = screen.getAllByRole("spinbutton");

    fireEvent.change(inputs[0], { target: { value: "5" } });

    expect(onChange).toHaveBeenCalledWith(0, 5);
  });

  test("вызывает onClose при клике на overlay", () => {
    const { container } = render(
      <ProgressModal
        isOpen={true}
        exercises={exercises}
        values={[0, 0]}
        onChange={onChange}
        onClose={onClose}
        onSave={onSave}
      />,
    );

    const overlay = container.firstChild as HTMLElement;

    fireEvent.click(overlay);

    expect(onClose).toHaveBeenCalled();
  });

  test("вызывает onSave при клике на сохранить", () => {
    render(
      <ProgressModal
        isOpen={true}
        exercises={exercises}
        values={[0, 0]}
        onChange={onChange}
        onClose={onClose}
        onSave={onSave}
      />,
    );

    fireEvent.click(screen.getByText("Сохранить"));

    expect(onSave).toHaveBeenCalled();
  });
});