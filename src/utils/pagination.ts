export function generatePagination(totalPages: number, page: number) {
  const arr = [];

  arr.push(1);

  const startDiff = page - 1;
  const endDiff = totalPages - page;

  let windowStart = 2;
  let windowEnd = totalPages - 1;

  const elipsis = "...";

  if (startDiff > 3 && totalPages > 6) {
    if (endDiff <= 3) {
      windowStart = totalPages - 5;
    } else {
      windowStart = page - 1;
    }
  }

  if (endDiff > 3 && totalPages > 6) {
    if (startDiff <= 3) {
      windowEnd = 5;
    } else {
      windowEnd = page + 1;
    }
  }

  if (windowStart !== 2) {
    arr.push(elipsis);
  }

  for (let i = windowStart; i <= windowEnd; i++) {
    arr.push(i);
  }

  if (windowEnd !== totalPages - 1) {
    arr.push(elipsis);
  }

  arr.push(totalPages);

  return arr;
}
