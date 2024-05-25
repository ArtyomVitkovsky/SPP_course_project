import { useState, useEffect } from "react";
import Icon from './Icon'
import ResponsivePagination from 'react-responsive-pagination';

const Pagination = ({ totalCount = 0, pageSize = 0, onPageClick = () => { } }) => {
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
    onPageClick(pageNumber);
  };

  useEffect(() => {
    const totalPages = Math.ceil(totalCount / pageSize);
    setTotalPages(totalPages);
  }, [totalCount]);

  return (
    <ResponsivePagination
      total={totalPages}
      current={currentPage}
      className="flex border border-zinc-200 rounded-lg divide-x cursor-pointer overflow-hidden"
      pageItemClassName="select-none text-center text-zinc-700 hover:bg-zinc-50 transition-all duration-300"
      pageLinkClassName="block w-10 p-2 font-semibold"
      activeItemClassName="bg-zinc-50"
      nextLabel={<Icon iconName="ChevronRightIcon" iconClassName="text-zinc-500 w-6 " />}
      previousLabel={<Icon iconName="ChevronLeftIcon" iconClassName="text-zinc-500 w-6" />}
      onPageChange={(e) => handlePageClick(e)}
    />
  )
}

export default Pagination;