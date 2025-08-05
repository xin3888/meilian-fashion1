import React, { useState } from 'react';
import Head from 'next/head';
import Header from '../../components/Layout/Header';
import ProductCard from '../../components/Product/ProductCard';

// 模拟产品数据
const mockProducts = [
  {
    id: 1,
    name: '优雅连衣裙',
    description: '轻盈飘逸的夏季连衣裙，展现女性优雅气质',
    price: 299,
    originalPrice: 399,
    image: '/dress1.jpg',
    rating: 4,
    reviews: 128,
    discount: 25,
    isNew: true
  },
  {
    id: 2,
    name: '时尚手提包',
    description: '精选优质皮革，经典设计，百搭实用',
    price: 599,
    image: '/bag1.jpg',
    rating: 5,
    reviews: 89,
    isNew: false
  },
  {
    id: 3,
    name: '高跟鞋',
    description: '舒适与美观并重，让您自信满满',
    price: 459,
    originalPrice: 599,
    image: '/shoes1.jpg',
    rating: 4,
    reviews: 156,
    discount: 23,
    isNew: false
  },
  // 添加更多产品...
];

export default function Products() {
  const [products] = useState(mockProducts);
  const [sortBy, setSortBy] = useState('featured');
  const [filterCategory, setFilterCategory] = useState('all');

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>所有产品 - 魅恋奇趣</title>
        <meta name="description" content="浏览我们的时尚产品系列" />
      </Head>

      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">所有产品</h1>
          <p className="text-lg text-gray-600">发现您的时尚风格</p>
        </div>

        {/* 筛选和排序 */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
          <div className="flex space-x-4">
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">所有类别</option>
              <option value="dress">连衣裙</option>
              <option value="bags">包包</option>
              <option value="shoes">鞋子</option>
              <option value="accessories">配饰</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-gray-600">排序方式：</span>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="featured">推荐</option>
              <option value="price-low">价格从低到高</option>
              <option value="price-high">价格从高到低</option>
              <option value="newest">最新上架</option>
              <option value="rating">评分最高</option>
            </select>
          </div>
        </div>

        {/* 产品网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* 加载更多按钮 */}
        <div className="text-center mt-12">
          <button className="bg-pink-600 text-white px-8 py-3 rounded-lg hover:bg-pink-700 transition">
            加载更多产品
          </button>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 魅恋奇趣. 保留所有权利。</p>
        </div>
      </footer>
    </div>
  );
}