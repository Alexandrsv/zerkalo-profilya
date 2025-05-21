export const apiUrls = {
  users: "/users",
  userLogin: "/users/login/",
  questions: "/questions/", // получить свои вопросы
  question: (questionId: string) => `/questions/${questionId}`, // изменить вопрос
  questionsFeed: "/questions/feed", // получить ленту вопросов
  abuse: "/abuse/",
  feedback: "/feedback/",
  comments: "/comments/",
};
