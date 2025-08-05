import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../../components/Layout/Header';

export default function Cart() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: '优雅连衣裙',
      price: 299,
      quantity: 1,
      size: 'M',
      color: '粉色',
      image: '/dress1.jpg'
    },
    {
      id: 2,
      name: '时尚手提包',
      price: 599,
      quantity: 1,
      color: '黑色',
      image: '/bag1.jpg'
    }
  ]);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity === 0) {
      setCartItems(cartItems.filter(item => item.id !== id));
    } else {
      setCartItems(cartItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 30;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>购物车 - 魅恋奇趣</title>
      </Head>

      <Header />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">购物车</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <svg className="w-24 h-24 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-xl text-gray-600 mb-4">您的购物车是空的</p>
            <Link href="/products" className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition inline-block">
              继续购物
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 购物车项目 */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex flex-col md:flex-row items-center border-b pb-6 mb-6 last:border-0 last:pb-0 last:mb-0">
                    <div className="relative w-32 h-32 flex-shrink-0 mb-4 md:mb-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-grow md:ml-6 text-center md:text-left">
                      <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
                      <div className="text-sm text-gray-600 mb-2">
                        {item.size && <span>尺码: {item.size} | </span>}
                        {item.color && <span>颜色: {item.color}</span>}
                      </div>
                      <div className="text-lg font-bold text-pink-600">¥{item.price}</div>
                    </div>
                    <div className="flex items-center mt-4 md:mt-0">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="mx-4 font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-4 text-red-500 hover:text-red-700"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 订单摘要 */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-4">订单摘要</h2>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>商品小计</span>
                    <span>¥{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>运费</span>
                    <span>{shipping === 0 ? '免费' : `¥${shipping}`}</span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-sm text-gray-600">满500元免运费</p>
                  )}
                </div>
                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between text-lg font-bold">
                    <span>总计</span>
                    <span className="text-pink-600">¥{total}</span>
                  </div>
                </div>
                <button className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 transition mb-3">
                  结算
                </button>
                <Link href="/products" className="block text-center text-gray-600 hover:text-pink-600">
                  继续购物
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}