export interface WorkoutShort {
  _id: string;
  name: string;
  video: string;
  exercises: {
    _id: string;
    name: string;
    quantity: number;
  }[];
}

export interface Course {
  _id: string;
  nameRU: string;
  nameEN: string;
  description: string;
  directions: string[];
  fitting: string[];
  workouts: string[];
}

export interface WorkoutProgress {
  workoutId: string;
  workoutCompleted: boolean;
  progressData: number[];
}

export interface CourseDetails extends Course {
  difficulty: string;
  durationInDays: number;
  dailyDurationInMinutes: {
    from: number;
    to: number;
  };
  workoutsProgress?: WorkoutProgress[];
}

