import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PresentationControls, Stage } from '@react-three/drei';
import { useGLTF } from '@react-three/drei';
import Link from 'next/link';
import Image from 'next/image';

function Model({ onClick }) {
    const { scene } = useGLTF('/cake5.glb');
    return <primitive object={scene} onClick={onClick} />;
}

export default function CakeHomeDashboard() {
    const [rotating, setRotating] = useState(false);

    const products = [
        {
            name: 'ONI MASK',
            price: 59.99,
            bg: 'bg-red-50',
            image: '/imagecake.jpg'
        },
        {
            name: 'PINK DROP',
            price: 89.99,
            bg: 'bg-pink-50',
            image: '/imagecake1.jpeg'
        },
        {
            name: 'THANK YOU',
            price: 69.99,
            bg: 'bg-blue-50',
            image: '/imagecake2.jpeg'
        },
        {
            name: 'YELLOW & BLACK',
            price: 79.99,
            bg: 'bg-yellow-50',
            image: '/imagecake3.jpg'
        }
    ];

    return (
        <div className="relative min-h-screen bg-pink-100">
            {/* Navigation */}
            <nav className="absolute top-0 w-full z-50 p-4 flex justify-between items-center">
                <div className="text-2xl font-bold text-purple-900">Cake Custom</div>
                <div className="flex gap-8">
                    <a href="#team" className="text-purple-900">Team</a>
                    <Link href="/Model3DCustom" className="text-purple-900">Customizer Cake</Link>
                    <a href="#about" className="text-purple-900">About</a>
                </div>
                <button className="bg-purple-900 text-white px-4 py-2 rounded">
                    Cart (1)
                </button>
            </nav>

            {/* Hero Section */}
            <div className="relative h-screen flex items-center">
                <div className="absolute inset-0 text-[200px] font-black text-purple-200 opacity-30 pointer-events-none">
                    Customizer Cake
                </div>

                {/* Left Content */}
                <div className="w-1/2 pl-16 z-10">
                    <h1 className="text-6xl font-black text-purple-900 mb-4">
                        Place you can custom and using your imaginary
                    </h1>
                    <p className="text-xl mb-8">
                        Not just a cake, your cake. Design a cake that's as real as the places you take it.
                    </p>
                    <Link href="/Model3DCustom">
                        <button className="bg-orange-400 text-black px-8 py-3 rounded-lg font-bold hover:bg-orange-500 transition-colors">
                            Create Your Cake
                        </button>
                    </Link>
                </div>

                {/* 3D Model Section */}
                <div className="absolute right-0 w-1/2 h-full">
                    <Canvas>
                        <Suspense fallback={null}>
                            <PresentationControls
                                global
                                rotation={[0, rotating ? Math.PI * 2 : 0, 0]}
                                polar={[-Math.PI / 3, Math.PI / 3]}
                                azimuth={[-Math.PI / 1.4, Math.PI / 2]}>
                                <Stage environment="city" intensity={0.6}>
                                    <Model onClick={() => setRotating(!rotating)} />
                                </Stage>
                            </PresentationControls>
                            <OrbitControls enableZoom={false} />
                        </Suspense>
                    </Canvas>
                </div>
            </div>

            {/* Latest Drop Section */}
            <section className="bg-white py-24">
                <div className="max-w-7xl mx-auto px-8">
                    <h2 className="text-6xl font-black text-center mb-6">POPULAR CAKE</h2>
                    <p className="text-2xl text-center mb-16 text-gray-600">Grab our freshest designs before they sell out!</p>

                    <div className="grid grid-cols-4 gap-12">
                        {products.map((board) => (
                            <div key={board.name} className={`${board.bg} p-6 rounded-2xl transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}>
                                <div className="flex justify-between mb-4">
                                    <span className="text-xl font-bold">${board.price}</span>
                                    <span className="flex items-center gap-1">
                                        <span className="text-yellow-400">⭐</span>
                                        <span className="font-medium">37</span>
                                    </span>
                                </div>
                                <div className="h-72 bg-white rounded-xl mb-6 shadow-inner overflow-hidden">
                                    <Image
                                        src={board.image}
                                        alt={board.name}
                                        width={400}
                                        height={400}
                                        className="w-full h-full object-cover"
                                        priority={true}
                                    />
                                </div>
                                <h3 className="text-center font-bold text-lg">{board.name}</h3>
                                <button className="w-full mt-4 py-3 bg-purple-900 text-white rounded-lg hover:bg-purple-800 transition-colors">
                                    Add to Cart
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}