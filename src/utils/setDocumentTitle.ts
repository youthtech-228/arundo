import { APP_TITLE } from '~/constants';

let prevTitle = undefined;

export const setDocumentTitle = (...titles: string[]) => {
  const newTitle = [...titles, APP_TITLE].filter(Boolean).join(' - ');

  if (newTitle !== prevTitle) {
    prevTitle = newTitle;
    document.title = newTitle;
  }
};
