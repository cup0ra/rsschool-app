export interface Contacts {
  phone: string | null;
  email: string | null;
  skype: string | null;
  telegram: string | null;
  notes: string | null;
  linkedIn: string | null;
}

export interface ContactsCV {
  phone: string | null;
  email: string | null;
  skype: string | null;
  telegram: string | null;
  notes: string | null;
  linkedin: string | null;
  location: string | null;
  github: string | null;
  website: string | string[] | null;
}

export type FinishDate = string | null | 'currently';

export type EnglishLevel = 'a0' | 'a1' | 'a1+' | 'a2' | 'a2+' | 'b1' | 'b1+' | 'b2' | 'b2+' | 'c1' | 'c1+' | 'c2';

export interface EducationRecord {
  graduationYear: number;
  faculty: string;
  university: string;
}

export interface Location {
  cityName: string;
  countryName: string;
}

export interface EmploymentRecord {
  placeOfWork: string | null;
  position: string | null;
  startDate: string | null;
  finishDate: FinishDate;
}

export interface PublicFeedback {
  feedbackDate: string;
  badgeId: string;
  comment: string;
  heroesUri: string;
  fromUser: {
    name: string;
    githubId: string;
  };
}

export interface CoursesStats {
  courseId: number;
  courseName: string;
  locationName: string;
  courseFullName: string;
  isExpelled: boolean;
  expellingReason: string;
  certificateId: string | null;
  isCourseCompleted: boolean;
  totalScore: number;
  position: number | null;
}

export interface CoreCVInfo {
  name: string | null;
  location: Location | null;
  githubId: string | null;
  englishLevel: EnglishLevel | null;
  about: string | null;
  selfIntroLink: string | null;
  cvLink: string | null;
  militaryService: string | null;
}
