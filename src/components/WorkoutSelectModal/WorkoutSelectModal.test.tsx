import { render, screen, fireEvent } from "@testing-library/react";
import WorkoutSelectModal from "./WorkoutSelectModal";

type Workout = {
  _id: string;
  name: string;
};

const workouts: Workout[] = [
  { _id: "w1", name: "Тренировка 1" },
  { _id: "w2", name: "Тренировка 2" },
];

const onClose = jest.fn();
const onSelect = jest.fn();

describe("WorkoutSelectModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("не рендерится если isOpen = false", () => {
    const { container } = render(
      <WorkoutSelectModal
        isOpen={false}
        workouts={workouts}
        onClose={onClose}
        onSelect={onSelect}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  test("показывает список тренировок", () => {
    render(
      <WorkoutSelectModal
        isOpen={true}
        workouts={workouts}
        onClose={onClose}
        onSelect={onSelect}
      />,
    );

    expect(screen.getByText("Тренировка 1")).toBeInTheDocument();
    expect(screen.getByText("Тренировка 2")).toBeInTheDocument();
  });

  test("показывает текст если нет тренировок", () => {
    render(
      <WorkoutSelectModal
        isOpen={true}
        workouts={[]}
        onClose={onClose}
        onSelect={onSelect}
      />,
    );

    expect(screen.getByText("Нет тренировок")).toBeInTheDocument();
  });

  test("выбирает тренировку и вызывает onSelect", () => {
    render(
      <WorkoutSelectModal
        isOpen={true}
        workouts={workouts}
        onClose={onClose}
        onSelect={onSelect}
      />,
    );

    const radios = screen.getAllByRole("radio");

    fireEvent.click(radios[0]);

    fireEvent.click(screen.getByText("Начать"));

    expect(onSelect).toHaveBeenCalledWith("w1");
  });

  test("клик по overlay вызывает onClose", () => {
    const { container } = render(
      <WorkoutSelectModal
        isOpen={true}
        workouts={workouts}
        onClose={onClose}
        onSelect={onSelect}
      />,
    );

    fireEvent.click(container.firstChild as HTMLElement);

    expect(onClose).toHaveBeenCalled();
  });
});
