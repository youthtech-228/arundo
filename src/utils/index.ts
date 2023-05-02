import numeral from 'numeral';

export * from './setDocumentTitle';
export * from './filterBy';
export * from './generateHash';
export * from './colors';
export * from './datetime';
export * from './lightOrDark';

export const asc = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

/*
  PATTERN: when grouping state setter calls into a single call, you should create state objects

  // define all of state as one object
  const [ state, setState ] = useState({
    name: 'mittens',
    age: 7,
  })

  // destructure simple values from state for convenient usage inside component
  const { name, age } = state


  // if needed individually, create state setters
  const stateSetter = createStateSetter(setState)
  const setName = stateSetter('name')
  const setAge = stateSetter('age')

  setName('fluffy') -> sets the name within state object to fluffy
*/
export const createStateSetter = (setter) => (what) => (value) =>
  setter((state) => ({ ...state, [what]: value }));

// takes an array and one or multiple sort function arguments, returns sorted array
export const sortBy = <T>(
  array: T[],
  ...sorts: Array<(...params: T[]) => 0 | 1 | -1>
) => {
  return array.sort((a, b) => {
    let sortIndex = 0;
    let sortValue = 0;

    while (!sortValue && sortIndex < sorts.length) {
      sortValue = sorts[sortIndex](a, b);
      sortIndex++;
    }

    return sortValue;
  });
};

export const sortByName = function (a1, a2) {
  const a = a1.name ? a1.name.toLowerCase() : '';
  const b = a2.name ? a2.name.toLowerCase() : '';
  if (a > b) {
    return 1;
  }
  if (b > a) {
    return -1;
  }
  return 0;
};

export const directionalSort = (direction = 'asc') => {
  const lessThanValue = direction === 'asc' ? -1 : 1;
  const greaterThanValue = direction === 'asc' ? 1 : -1;

  return <T>(what: ((val: T) => unknown) | keyof T) =>
    (a: T, b: T) => {
      const aValue = typeof what === 'function' ? what(a) : a[what];
      const bValue = typeof what === 'function' ? what(b) : b[what];

      return aValue < bValue
        ? lessThanValue
        : aValue > bValue
        ? greaterThanValue
        : 0;
    };
};

export const ascBy = directionalSort('asc');
export const descBy = directionalSort('desc');

export const isValidDate = (d) => d instanceof Date && !isNaN(+d);

export const required = (requirer) => (requires) => {
  throw new Error(`${requirer} expects ${requires}.`);
};

export const getInitials = (fullName) => {
  if (typeof fullName !== 'string') return '';
  const names = fullName.split(' ');
  let initials = names[0].substring(0, 1).toUpperCase();
  if (names.length > 0) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
};

export const shortNumbers = (v) => {
  const formatted = numeral(v).format('0.[000]a');
  if (isNaN(formatted)) return `${v}`;
  return formatted;
};

export const capitalize = (s) => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const camelToDisplayName = (s) =>
  capitalize(s.replace(/[A-Z]/g, (letter) => ` ${capitalize(letter)}`));

export const truncateStr = (str, n) =>
  str.length > n ? str.substr(0, n) + ' ...' : str;
