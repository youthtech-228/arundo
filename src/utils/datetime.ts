import moment from 'moment';

export const formatISO = (s) => {
  const transformed = moment(s).format('YYYY-MM-DDTHH:mm:ss');
  return transformed;
};

export const datify = (date) =>
  date ? (date === 'latest' ? new Date() : new Date(date)) : undefined;

export const convertToLocalTime = (date, time = true) => {
  return (
    new Date(date).toLocaleDateString() +
    (time
      ? (
          ' ' +
          new Date(date).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })
        ).toLowerCase()
      : '')
  );
};

export const formatDateString = (d) => {
  const formattedDate = moment(d);
  return formattedDate.format('M/D/YYYY');
}
export const getDiffDays = (date) => {
  var passedDate = new Date(date);
  var today = new Date();
  var difference = passedDate.getTime() - today.getTime();
  var days = Math.ceil(difference / (1000 * 3600 * 24)) + 1;

  return Math.abs(days);
};
