import React from 'react';
import EleganceSection from './EleganceSection';
import Footer from './FooterHomePage';
import CakeCollection from './CakeCollection';
import HeaderDashboard from './Header';

export default function CakeHomeDashboard() {

    return (
        <div className="relative min-h-screen bg-gradient-to-b from-pink-50 to-pink-100">

            {/* Header and Banner Here */}
            <>
                <HeaderDashboard />
            </>

            {/* Cake Collection Here */}
            <>
                <CakeCollection />
            </>

            {/* HomePageNext Here */}
            <>
                <EleganceSection />
            </>

            {/* Footer Here */}
            <>
                <Footer />
            </>
        </div>
    );
}