

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import './SearchPage.css';

import Loader from '../loader/Loader';
import axios from 'axios';
import { toast } from 'react-toastify';
import { TablePagination } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';



const mockData = Array.from({ length: 10 }, (_, index) => ({
  id: index + 1,
  title: `Sample Title ${index + 1}`,
  subtitle: `Subtitle ${index + 1}`,
  timestamp: '2023-01-01',
  author: `Author ${index + 1}`,
}));

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  const navigate = useNavigate();

  const handleSearch = async () => {
    setIsLoading(true);
    // Simulate API call or search logic
    await axios({
      url: `http://localhost:5000/v1/searchDocuments?query=${searchTerm}&from=${rowsPerPage * page}&size=${rowsPerPage}`,
      method: "GET",
    }).then(res => {
      console.log(res);
      if (res.status == 200) {
        setSearchResults(res.data.hits.hits)
        setTotalRecords(res.data.hits.total.value)
      }
    }).catch(e => {
      toast.error(`following error occured ${e}`, {
        position: toast.POSITION.BOTTOM_LEFT
      })
    })
    setIsLoading(false);
  };

  useEffect(() => {
    (async () => {
      await handleSearch()
    })()
  }, [page, rowsPerPage]);

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch()
    }
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  console.log(searchResults, totalRecords)

  const renderCards = () => {
    if (isLoading) {
      return <Loader />; // Show loader when loading
    }

    if (searchResults.length === 0) {
      return <div className="no-results"><h2>No Results Found</h2></div>;
    }

    const handleCardClick = (item) => {
      localStorage.setItem("CARD_ITEM", JSON.stringify(item))
      navigate("/pdf-viewer")
    }

    return (
      <div className="card-grid">
        {searchResults?.map(item => (
          <div key={item?._id} className="card">
            <h4>{item?._source.program}</h4>
            <p dangerouslySetInnerHTML={{ __html: item?.highlight?.text[0] }}></p>
            <p>Author: {item?._source.author}</p>
            <button className="download-button" onClick={() => handleCardClick(item)}>More..</button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="search-page">
      <h2>Search Here</h2>
      <div className="search-bar-container">
        <div className="search-bar-inner">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            onKeyPress={handleKeyPress}
          />
        </div>
        {
          totalRecords ? (
            <h4>Showing 10 / {totalRecords}</h4>
          ) : ""
        }
        {
          totalRecords < 10 ? (
            <h4>Showing {totalRecords} / {totalRecords}</h4>
          ) : ""
        }
      </div>
      {renderCards()}
      {
        searchResults.length > 0 &&
        <div className='home__paginator'>
          <TablePagination
            style={{ color: '#fff' }}
            component="div"
            count={totalRecords}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      }
    </div>
  );
};

export default SearchPage;


