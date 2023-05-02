import { useEffect, useState } from 'react';

const usePagination = (items: any[], itemsPerPage: number) => {
  const [currentPage, setCurrentPage] = useState(1);

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const currentData = items.slice(start, end);

  useEffect(() => {
    setCurrentPage(1);
  }, [items]);

  const numberOfPages = Math.ceil(items.length / itemsPerPage);

  const setPage = (page: number) => {
    // Last or first?
    if (page > numberOfPages) {
      setCurrentPage(1);
    } else {
      setCurrentPage(page);
    }
  };

  const next = () => {
    setCurrentPage((currentPage) => Math.min(currentPage + 1, numberOfPages));
  };

  const prev = () => {
    setCurrentPage((currentPage) => Math.max(currentPage - 1, 1));
  };

  const jump = (page) => {
    const pageNumber = Math.max(1, page);
    setCurrentPage(() => Math.min(pageNumber, numberOfPages));
  };

  return {
    next,
    prev,
    jump,
    range: { start: start + 1, end: Math.min(end, items.length) },
    current: currentData,
    currentPage,
    numberOfPages,
    setPage,
  };
};

export default usePagination;
