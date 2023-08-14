import React, { useEffect, useState } from 'react';
import '../App.css';
import branch1 from "../api/branch1.json"
import branch2 from "../api/branch2.json";
import branch3 from "../api/branch3.json";


const formatNumber = (number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'INR' }).format(number);
  };


const RevenueApp = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState({
      key: '',
      direction: 'ascending',
    });
  
    useEffect(() => {
      const data = [...branch1.products, ...branch2.products, ...branch3.products];
  
      const mergedProducts = data.reduce((acc, product) => {
        const existingProduct = acc.find((p) => p.name === product.name);
        if (existingProduct) {
          existingProduct.sold += product.sold;
        } else {
          acc.push(product);
        }
        return acc;
      }, []);
  
      mergedProducts.sort((a, b) => a.name.localeCompare(b.name));
  
      setProducts(mergedProducts);
      setIsLoading(false);
    }, []);
  
    useEffect(() => {
      const filtered = products.filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()));
      setFilteredProducts(filtered);
    }, [products, searchTerm]);
  
    const sortTable = (key) => {
      let direction = 'ascending';
      if (sortConfig.key === key && sortConfig.direction === 'ascending') {
        direction = 'descending';
      }
      setSortConfig({ key, direction });
  
      const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (a[key] < b[key]) {
          return direction === 'ascending' ? -1 : 1;
        }
        if (a[key] > b[key]) {
          return direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
  
      setFilteredProducts(sortedProducts);
    };
  
    const handleSearchChange = (event) => {
      setSearchTerm(event.target.value);
    };
  
    const totalRevenue = filteredProducts.reduce((acc, product) => acc + (product.unitPrice * product.sold), 0);
  
    return (
      <div className="App container" data-testid="app">
        <nav className="navbar">
          <div className="navbar__brand">Revenue Aggregator</div>
        </nav>
        <div className="input-group">
          <input placeholder='Type here...' className="input-group__input" type="text" id="search" value={searchTerm} onChange={handleSearchChange} />
          <label className="input-group__label" htmlFor="search">
            Search
          </label>
        </div>
        <div className="table-container">
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th title='Click here' onClick={() => sortTable('name')}>
                    Product Name
                    <span title='Click here' className={`sort-icon ${sortConfig.direction === 'ascending' ? 'up' : 'down'}`}></span>
                  </th>
                  <th onClick={() => sortTable('totalRevenue')}>Total Revenue</th>
                </tr>
              </thead>
  
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td data-testid="product-name">{product.name}</td>
                    <td>{formatNumber(product.unitPrice * product.sold)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="total-revenue">
                <tr>
                  <td>Total Revenue for Displayed Products:</td>
                  <td data-testid="total-revenue">{formatNumber(totalRevenue)}</td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>
      </div>
    );
  };
  
  
  export default RevenueApp;