"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/Community.css";
import { User } from "lucide-react";

function MarketItemPage() {
  const { id } = useParams(); // URL에서 상품 ID 가져오기
  const navigate = useNavigate();

  // 상태 관리
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 백엔드에서 상품 데이터 불러오기
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `http://localhost:8080/api/products/${id}`
        );
        if (!response.ok) {
          throw new Error("상품 정보를 불러오는 데 실패했습니다.");
        }
        const data = await response.json();
        setProduct(data); // 상품 데이터 저장
      } catch (error) {
        console.error("상품 데이터 가져오기 실패:", error);
        setError("상품 정보를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // 가격 포맷팅 함수
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // 채팅하기 버튼 클릭 핸들러
  const handleChatClick = () => {
    if (product?.sellerName) {
      navigate(`/chat?seller=${product.sellerName}`);
    }
  };

  if (isLoading) {
    return <div className="page-container">로딩 중...</div>;
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-state">
          <p>{error}</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/market")}
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page-container">
        <div className="error-state">
          <p>상품을 찾을 수 없습니다.</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/market")}
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="product-detail">
        {/* 상품 이미지 */}
        <img
  src={
    product.images &&
    Array.isArray(product.images) &&
    product.images.length > 0
      ? `http://localhost:8080${product.images[0]}?timestamp=${new Date().getTime()}`
      : "/placeholder.svg"
  }
  alt={product.title}
  className="product-detail-image"
/>

        {/* 상품 정보 */}
        <div>
          {/* 판매자 정보 */}
          <div className="seller-info">
            <div className="seller-avatar">
              <img src="/placeholder.svg" alt={product.sellerName} />
            </div>
            <div className="seller-details">
              <p className="seller-name">{product.sellerName}</p>
            </div>
          </div>

          {/* 상품 상세 정보 */}
          <div className="product-detail-header">
            <h1 className="product-detail-title">{product.title}</h1>
            <p className="product-detail-price">
              {formatPrice(product.price)}원
            </p>
            <div className="product-detail-meta">
              <div className="product-location">
                <span className="product-location-icon">📍</span>
                <span>{User.location || "위치 정보 없음"}</span>
              </div>
              <span>•</span>
              <span>등록일: {product.createdAt}</span>
            </div>
          </div>

          {/* 상품 설명 */}
          <div className="product-detail-description">
            {product.description}
          </div>

          {/* 액션 버튼 */}
          <div className="action-buttons">
            <button
              className="action-button action-button-primary"
              onClick={handleChatClick}
            >
              <span className="action-button-icon">💬</span>
              채팅하기
            </button>
          </div>
        </div>
      </div>

      {/* 하단 고정 버튼 (모바일용) */}
      <div className="fixed-bottom">
        <div className="fixed-bottom-content">
          <button
            className="action-button action-button-primary"
            onClick={handleChatClick}
          >
            <span className="action-button-icon">💬</span>
            채팅하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default MarketItemPage;
