import { useState } from "react";
import { Pagination } from "react-bootstrap";

const PaginationComponent = ({ currentPage, isFirstPage, isLastPage, nextPage, pageCount, previousPage, onPageChange }) => {

    const handlePageChange = (pageNumber) => {
    onPageChange(pageNumber);
    };

    const getPageItems = () => {
    const items = [];
    const pageRangeDisplayed = 5;
    const halfPageRangeDisplayed = Math.floor(pageRangeDisplayed / 2);

    let startPage = Math.max(1, currentPage - halfPageRangeDisplayed);
    let endPage = Math.min(pageCount, currentPage + halfPageRangeDisplayed);

    if (startPage > 1) {
        items.push(
        <Pagination.Item key={1} active={1 === currentPage} onClick={() => handlePageChange(1)}>
            1
        </Pagination.Item>
        );
        if (startPage > 2) {
        items.push(<Pagination.Ellipsis key="start-ellipsis" />);
        }
    }

    for (let number = startPage; number <= endPage; number++) {
        items.push(
        <Pagination.Item
            key={number}
            active={number === currentPage}
            onClick={() => handlePageChange(number)}
        >
            {number}
        </Pagination.Item>
        );
    }

    if (endPage < pageCount) {
        if (endPage < pageCount - 1) {
        items.push(<Pagination.Ellipsis key="end-ellipsis" />);
        }
        items.push(
        <Pagination.Item
            key={pageCount}
            active={pageCount === currentPage}
            onClick={() => handlePageChange(pageCount)}
        >
            {pageCount}
        </Pagination.Item>
        );
    }

    return items;
    };
    
    return (
    <Pagination>
        <Pagination.First disabled={isFirstPage} onClick={() => handlePageChange(1)} />
        <Pagination.Prev disabled={isFirstPage} onClick={() => handlePageChange(previousPage)} />
        {getPageItems()}
        <Pagination.Next disabled={isLastPage} onClick={() => handlePageChange(nextPage)} />
        <Pagination.Last disabled={isLastPage} onClick={() => handlePageChange(pageCount)} />
    </Pagination>
    );

};


export default PaginationComponent;