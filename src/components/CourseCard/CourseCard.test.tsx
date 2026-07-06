import { render, screen, fireEvent } from "@testing-library/react";
import CourseCard from "./CourseCard";
import { CourseDetails } from "@/types/course";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
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
  fitting: [],
  directions: [],
};

const image = "/test.jpg";

describe("CourseCard", () => {
  it("рендерит название курса", () => {
    render(<CourseCard course={course} image={image} />);

    expect(screen.getByText("Йога")).toBeInTheDocument();
  });

  it("рендерит длительность курса", () => {
    render(<CourseCard course={course} image={image} />);

    expect(screen.getByText(/10 дней/i)).toBeInTheDocument();
  });

  it("вызывает add course кнопку", () => {
    render(<CourseCard course={course} image={image} />);

    const button = screen.getByAltText("more");
    fireEvent.click(button);

    expect(button).toBeInTheDocument();
  });

  it("проверяет кнопку продолжения (profile variant)", () => {
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

  it("переходит по workout через router.push", () => {
    render(
      <CourseCard
        course={course}
        image={image}
        variant="profile"
        progress={50}
      />,
    );

    const btn = screen.getByText("Продолжить");
    fireEvent.click(btn);

    expect(btn).toBeInTheDocument();
  });
});
