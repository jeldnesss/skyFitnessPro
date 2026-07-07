import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

import WorkoutSelectModal from "./WorkoutSelectModal";


type Workout = {
  _id: string;
  name: string;
};


type CompletedWorkout = {
  workoutId: string;
  workoutCompleted: boolean;
};



const workouts: Workout[] = [
  {
    _id: "w1",
    name: "Тренировка 1",
  },
  {
    _id: "w2",
    name: "Тренировка 2",
  },
];


const emptyCompletedWorkouts: CompletedWorkout[] = [];


const onClose = jest.fn();
const onSelect = jest.fn();



describe("WorkoutSelectModal", () => {


  beforeEach(() => {
    jest.clearAllMocks();
  });



  test("не рендерится если isOpen=false", () => {


    const { container } = render(
      <WorkoutSelectModal
        isOpen={false}
        workouts={workouts}
        completedWorkouts={emptyCompletedWorkouts}
        onClose={onClose}
        onSelect={onSelect}
      />,
    );


    expect(
      container.firstChild,
    ).toBeNull();


  });



  test("отображает список тренировок", () => {


    render(
      <WorkoutSelectModal
        isOpen={true}
        workouts={workouts}
        completedWorkouts={emptyCompletedWorkouts}
        onClose={onClose}
        onSelect={onSelect}
      />,
    );


    expect(
      screen.getByText("Тренировка 1"),
    ).toBeInTheDocument();


    expect(
      screen.getByText("Тренировка 2"),
    ).toBeInTheDocument();


  });



  test("показывает сообщение если тренировок нет", () => {


    render(
      <WorkoutSelectModal
        isOpen={true}
        workouts={[]}
        completedWorkouts={emptyCompletedWorkouts}
        onClose={onClose}
        onSelect={onSelect}
      />,
    );


    expect(
      screen.getByText("Нет тренировок"),
    ).toBeInTheDocument();


  });



  test("выбирает тренировку и вызывает onSelect", () => {


    render(
      <WorkoutSelectModal
        isOpen={true}
        workouts={workouts}
        completedWorkouts={emptyCompletedWorkouts}
        onClose={onClose}
        onSelect={onSelect}
      />,
    );


    fireEvent.click(
      screen.getByText(
        "Тренировка 2",
      ),
    );


    fireEvent.click(
      screen.getByText(
        "Начать",
      ),
    );


    expect(onSelect)
      .toHaveBeenCalledWith(
        "w2",
      );


  });



  test("закрывает модальное окно при клике на overlay", () => {


    const { container } = render(
      <WorkoutSelectModal
        isOpen={true}
        workouts={workouts}
        completedWorkouts={emptyCompletedWorkouts}
        onClose={onClose}
        onSelect={onSelect}
      />,
    );


    fireEvent.click(
      container.firstChild as HTMLElement,
    );


    expect(onClose)
      .toHaveBeenCalledTimes(1);


  });



  test("кнопка Начать запускает выбранную тренировку", () => {


    render(
      <WorkoutSelectModal
        isOpen={true}
        workouts={workouts}
        completedWorkouts={emptyCompletedWorkouts}
        onClose={onClose}
        onSelect={onSelect}
      />,
    );


    fireEvent.click(
      screen.getByText(
        "Тренировка 1",
      ),
    );


    fireEvent.click(
      screen.getByText(
        "Начать",
      ),
    );


    expect(onSelect)
      .toHaveBeenCalledWith(
        "w1",
      );


  });


});