import { Pagination } from "react-bootstrap";
import PropTypes from "prop-types";

const CommonPagination = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}) => {

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const pageLimit = 2;
  const startPage = Math.max(1, currentPage - pageLimit);
  const endPage = Math.min(totalPages, currentPage + pageLimit);

  let items = [];

  if (startPage > 1) {
    items.push(
      <Pagination.Item key={1} onClick={() => onPageChange(1)}>
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
        onClick={() => onPageChange(number)}
      >
        {number}
      </Pagination.Item>
    );
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      items.push(<Pagination.Ellipsis key="end-ellipsis" />);
    }

    items.push(
      <Pagination.Item
        key={totalPages}
        onClick={() => onPageChange(totalPages)}
      >
        {totalPages}
      </Pagination.Item>
    );
  }

  return (
    <>
      <style>
        {`
        .custom-pagination{
            display:flex;
            justify-content:flex-end; /* RIGHT ALIGN */
            align-items:center;
            gap:6px;
        }

        .custom-pagination .page-item .page-link{
            width:30px;
            height:30px;
            border-radius:50%;
            border:1px solid #e5e5e5;
            display:flex;
            align-items:center;
            justify-content:center;
            background:#fff;
            color:#6c757d;
            font-size:14px;
            font-weight:500;
            padding:0;
            transition:all .25s ease;
        }

        /* Hover */
        .custom-pagination .page-item .page-link:hover{
            background:#0d6efd;
            color:#fff;
            border-color:#0d6efd;
        }

        /* Active page */
        .custom-pagination .page-item.active .page-link{

            background:#0d6efd;
            color:#fff;
            border-color:#0d6efd;
        }

/* Arrow Buttons */
.custom-pagination .page-item:first-child .page-link,
.custom-pagination .page-item:last-child .page-link{

 width:30px;
 height:30px;
 border-radius:50%;
 border:1px solid #e5e5e5;
 background: #0d6efd !important;
}

        .custom-pagination .page-item:first-child .page-link:hover,
        .custom-pagination .page-item:last-child .page-link:hover{
            background:#0d6efd;
            color:#fff;
        }

        /* Disabled */
        .custom-pagination .page-item.disabled .page-link{
            opacity:0.5;
        }

        `}
      </style>

      <Pagination className="custom-pagination mt-3">

        <Pagination.Prev
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        />

        {items}

        <Pagination.Next
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        />

      </Pagination>
    </>
  );
};

CommonPagination.propTypes = {
  totalItems: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default CommonPagination;