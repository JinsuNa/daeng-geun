"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Community.css";
import { useParams } from "react-router-dom";

function MarketPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // 한 페이지당 10개 표시
  const userId = localStorage.getItem("userId")
  const navigate = useNavigate()
  const { id } = useParams();
  const [product, setProduct] = useState(null);
// 초기 로그인 페이지 항시
useEffect(()=>{
  if(!userId){
setTimeout(()=>navigate('/login'),0);
return;
  }
})
  
  useEffect(() => {
    fetch("http://localhost:8080/api/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("상품 목록을 불러오는 데 실패했습니다.");
        }
        return response.json();
      })

      .then((data) => {
        // 최신 등록된 상품이 먼저 오도록 정렬
        const sortedData = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setProducts(sortedData);
        setFilteredProducts(sortedData);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
        console.log("상품불러오는 response.data error:", error);
      });
  }, []);

  useEffect(() => {
    fetch(`http://localhost:8080/api/products/${id}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("✅ 조회수 증가 확인:", data.views); // 🔥 디버깅용 로그
        setProduct(data);
      })
      .catch((error) => console.error("Error fetching product:", error));
  }, [id]); // ✅ `id`가 변경될 때만 실행 (초기 1회 실행)



  

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1); // 검색 시 첫 페이지로 이동

    if (value) {
      const searchLower = value.toLowerCase();
      const filtered = products.filter(
        (product) =>
          product.title.toLowerCase().includes(searchLower) ||
          product.location.toLowerCase().includes(searchLower)
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return "/default-image.jpg"; // 기본 이미지 경로
    }
    return imagePath.startsWith("http")
      ? imagePath
      : `http://localhost:8080${imagePath}`;
  };

  // 페이지네이션 로직
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">댕근마켓</h1>
        <Link to="/market/write" className="btn btn-primary">
          글쓰기
        </Link>
      </div>

      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="찾으시는 물품을 검색해보세요"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <span className="search-icon">🔍</span>
      </div>

      {loading ? (
        <div className="loading">로딩 중...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : displayedProducts.length > 0 ? (
        <div className="product-grid" >
          {displayedProducts.map((product) => (
            <Link
              key={product.id}
              to={`/market/${product.id}`}
              className="product-card"
            >
              <div className="product-image-container">
                <img
                  src={getImageUrl(product.image)}
                  alt={product.title}
                  className="product-image"
                  onError={(e) => (e.target.src = "/default-image.jpg")}
                />
              </div>
              <div className="product-info">
                <h3 className="product-title">{product?.title}</h3>
                <p className="product-price">{formatPrice(product?.price)}원</p>
                <div className="product-meta">
                  <div className="product-location">
                    <span className="product-location-icon">📍</span>
                    <span>{product?.location}</span>
                  </div>
                  <div className="product-seller">
                    <span className="product-seller-icon">👤</span>
                    <span>{product?.sellerNickname}</span>
                  </div>
                  <div className="product-views">
                    <span className="product-views-icon">👀</span>
                    <p>조회수: {product?.views}회</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>검색 결과가 없습니다.</p>
        </div>
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="btn btn-outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            이전
          </button>
          <span className="page-info">
            {currentPage} / {totalPages}
          </span>
          <button
            className="btn btn-outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}

export default MarketPage;
