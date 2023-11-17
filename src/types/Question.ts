export type QuestionOptionsType = {
  a: string;
  b: string;
  c: string;
  d: string;
};

export type QuestionType = {
  question: string;
  options: QuestionOptionsType;
  answer: string;
};
