import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import CourseCard from "./CourseCard";
import { CourseDetails } from "@/types/course";
import { useRouter } from "next/navigation";

import { getCourseWorkouts } from "@/services/workouts.service";
import { addCourseToUser } from "@/services/courses.service";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/services/courses.service", () => ({
  addCourseToUser: jest.fn(),
}));

jest.mock("@/services/workouts.service", () => ({
  getCourseWorkouts: jest.fn(),
}));

const mockPush = jest.fn();

Object.defineProperty(window, "alert", {
  writable: true,
  value: jest.fn(),
});

const course: CourseDetails = {
  _id: "1",
  nameRU: "Йога",
  durationInDays: 10,
  dailyDurationInMinutes: {
    from: 20,
    to: 40,
  },
  difficulty: "easy",
  fitting: ["Для новичков"],
  directions: ["Растяжка"],
};

const image = "/test.jpg";

describe("CourseCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    (getCourseWorkouts as jest.Mock).mockResolvedValue([
      {
        _id: "workout1",
        name: "Тренировка 1",
      },
    ]);
  });

  test("отображает название курса", () => {
    render(<CourseCard course={course} image={image} />);

    expect(screen.getByText("Йога")).toBeInTheDocument();
  });

  test("отображает длительность курса", () => {
    render(<CourseCard course={course} image={image} />);

    expect(screen.getByText(/10 дней/i)).toBeInTheDocument();
  });

  test("отображает изображение курса", () => {
    render(<CourseCard course={course} image={image} />);

    const images = screen.getAllByRole("img");

    expect(images[0]).toHaveAttribute(
      "src",
      expect.stringContaining("test.jpg"),
    );
  });

  test("показывает кнопку добавления курса", () => {
    render(<CourseCard course={course} image={image} />);

    expect(screen.getByAltText("more")).toBeInTheDocument();
  });

  test("добавляет курс успешно", async () => {
    (addCourseToUser as jest.Mock).mockResolvedValueOnce({});

    render(<CourseCard course={course} image={image} />);

    fireEvent.click(screen.getByAltText("more"));

    await waitFor(() => {
      expect(addCourseToUser).toHaveBeenCalledWith("1");
    });

    expect(window.alert).toHaveBeenCalledWith("Курс добавлен!");
  });

  test("показывает ошибку при добавлении курса", async () => {
    (addCourseToUser as jest.Mock).mockRejectedValueOnce(new Error());

    render(<CourseCard course={course} image={image} />);

    fireEvent.click(screen.getByAltText("more"));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Ошибка добавления курса");
    });
  });

  test("показывает Продолжить при прогрессе 50%", () => {
    render(
      <CourseCard
        course={course}
        image={image}
        variant="profile"
        progress={50}
      />,
    );

    expect(screen.getByText("Продолжить")).toBeInTheDocument();
  });

  test("показывает Начать тренировки при прогрессе 0", () => {
    render(
      <CourseCard
        course={course}
        image={image}
        variant="profile"
        progress={0}
      />,
    );

    expect(screen.getByText("Начать тренировки")).toBeInTheDocument();
  });

  test("показывает Начать заново при прогрессе 100", () => {
    render(
      <CourseCard
        course={course}
        image={image}
        variant="profile"
        progress={100}
      />,
    );

    expect(screen.getByText("Начать заново")).toBeInTheDocument();
  });

  test("открывает окно выбора тренировки", async () => {
    render(
      <CourseCard
        course={course}
        image={image}
        variant="profile"
        progress={50}
      />,
    );

    fireEvent.click(screen.getByText("Продолжить"));

    await waitFor(() => {
      expect(screen.getByText("Выберите тренировку")).toBeInTheDocument();
    });
  });

 

  test("переходит на выбранную тренировку", async () => {
    render(
      <CourseCard
        course={course}
        image={image}
        variant="profile"
        progress={50}
      />,
    );

    fireEvent.click(screen.getByText("Продолжить"));

    await waitFor(() => {
      expect(screen.getByText("Тренировка 1")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Тренировка 1"));

    expect(mockPush).toHaveBeenCalledWith("/course/1/workout/workout1");
  });
});
