import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

import ProgressModal from "./ProgressModal";


type Exercise = {
  _id: string;
  name: string;
  quantity: number;
};


const exercises: Exercise[] = [
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



  test("не рендерится если isOpen=false", () => {


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


    expect(
      container.firstChild,
    ).toBeNull();


  });




  test("отображает заголовок и упражнения", () => {


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


    expect(
      screen.getByText("Мой прогресс"),
    ).toBeInTheDocument();


    expect(
      screen.getByText("Приседания"),
    ).toBeInTheDocument();


    expect(
      screen.getByText("Отжимания"),
    ).toBeInTheDocument();


  });




  test("отображает значения прогресса", () => {


    render(
      <ProgressModal
        isOpen={true}
        exercises={exercises}
        values={[5, 10]}
        onChange={onChange}
        onClose={onClose}
        onSave={onSave}
      />,
    );


    const inputs =
      screen.getAllByRole("spinbutton");


    expect(inputs[0])
      .toHaveValue(5);


    expect(inputs[1])
      .toHaveValue(10);


  });




  test("вызывает onChange при изменении значения", () => {


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


    const inputs =
      screen.getAllByRole("spinbutton");


    fireEvent.change(
      inputs[0],
      {
        target:{
          value:"5",
        },
      },
    );


    expect(onChange)
      .toHaveBeenCalledWith(
        0,
        5,
      );


  });




  test("передает 0 если поле очищено", () => {


    render(
      <ProgressModal
        isOpen={true}
        exercises={exercises}
        values={[5,5]}
        onChange={onChange}
        onClose={onClose}
        onSave={onSave}
      />,
    );


    const inputs =
      screen.getAllByRole("spinbutton");


    fireEvent.change(
      inputs[0],
      {
        target:{
          value:"",
        },
      },
    );


    expect(onChange)
      .toHaveBeenCalledWith(
        0,
        0,
      );


  });




  test("передает введенное значение больше максимального", () => {


    render(
      <ProgressModal
        isOpen={true}
        exercises={exercises}
        values={[0,0]}
        onChange={onChange}
        onClose={onClose}
        onSave={onSave}
      />,
    );


    const inputs =
      screen.getAllByRole("spinbutton");


    fireEvent.change(
      inputs[0],
      {
        target:{
          value:"50",
        },
      },
    );


    expect(onChange)
      .toHaveBeenCalledWith(
        0,
        50,
      );


  });




  test("передает отрицательное значение", () => {


    render(
      <ProgressModal
        isOpen={true}
        exercises={exercises}
        values={[0,0]}
        onChange={onChange}
        onClose={onClose}
        onSave={onSave}
      />,
    );


    const inputs =
      screen.getAllByRole("spinbutton");


    fireEvent.change(
      inputs[0],
      {
        target:{
          value:"-5",
        },
      },
    );


    expect(onChange)
      .toHaveBeenCalledWith(
        0,
        -5,
      );


  });




  test("вызывает onClose при клике по overlay", () => {


    const { container } = render(
      <ProgressModal
        isOpen={true}
        exercises={exercises}
        values={[0,0]}
        onChange={onChange}
        onClose={onClose}
        onSave={onSave}
      />,
    );


    fireEvent.click(
      container.firstChild as HTMLElement,
    );


    expect(onClose)
      .toHaveBeenCalledTimes(1);


  });




  test("вызывает onClose при клике Отмена", () => {


    render(
      <ProgressModal
        isOpen={true}
        exercises={exercises}
        values={[0,0]}
        onChange={onChange}
        onClose={onClose}
        onSave={onSave}
      />,
    );


    fireEvent.click(
      screen.getByText("Отмена"),
    );


    expect(onClose)
      .toHaveBeenCalledTimes(1);


  });




  test("вызывает onSave при сохранении", () => {


    render(
      <ProgressModal
        isOpen={true}
        exercises={exercises}
        values={[0,0]}
        onChange={onChange}
        onClose={onClose}
        onSave={onSave}
      />,
    );


    fireEvent.click(
      screen.getByText("Сохранить"),
    );


    expect(onSave)
      .toHaveBeenCalledTimes(1);


  });


});