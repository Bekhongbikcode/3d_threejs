import React from 'react';
import { useCustomizationStore } from '../store/customization';

export function Controls() {
    const {
        selectedPart,
        colors,
        scale,
        roughness,
        metalness,
        animationSpeed,
        isPlaying,
        setColorForPart,
        setScale,
        setRoughness,
        setMetalness,
        setAnimationSpeed,
        setIsPlaying
    } = useCustomizationStore();

    const exportConfig = () => {
        const config = {
            colors,
            scale,
            roughness,
            metalness,
            animationSpeed,
            isPlaying
        };
        const blob = new Blob([JSON.stringify(config)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'cake-config.json';
        a.click();
    };

    const importConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const config = JSON.parse(e.target?.result as string);
                Object.entries(config.colors).forEach(([part, color]) => {
                    setColorForPart(part, color as string);
                });
                setScale(config.scale);
                setRoughness(config.roughness);
                setMetalness(config.metalness);
                setAnimationSpeed(config.animationSpeed);
                setIsPlaying(config.isPlaying);
            };
            reader.readAsText(file);
        }
    };

    return (
        <div className="space-y-4 p-4 bg-white rounded shadow">
            <h2 className="text-xl font-bold mb-4">Cake Customizer</h2>

            {selectedPart ? (
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Color for {selectedPart}
                    </label>
                    <input
                        type="color"
                        value={colors[selectedPart] || '#ffffff'}
                        onChange={(e) => setColorForPart(selectedPart, e.target.value)}
                        className="mt-1"
                    />
                </div>
            ) : (
                <p className="text-sm text-gray-500">
                    Click on a part of the cake to customize its color
                </p>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700">Cake Size</label>
                <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={scale}
                    onChange={(e) => setScale(parseFloat(e.target.value))}
                    className="mt-1 w-full"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Frosting Texture</label>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={roughness}
                    onChange={(e) => setRoughness(parseFloat(e.target.value))}
                    className="mt-1 w-full"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Decoration Shine</label>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={metalness}
                    onChange={(e) => setMetalness(parseFloat(e.target.value))}
                    className="mt-1 w-full"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Rotation Speed</label>
                <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={animationSpeed}
                    onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
                    className="mt-1 w-full"
                />
            </div>

            <div className="flex items-center">
                <label className="text-sm font-medium text-gray-700 mr-2">Rotation</label>
                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    {isPlaying ? 'Stop' : 'Start'}
                </button>
            </div>

            <div className="flex space-x-4">
                <button
                    onClick={exportConfig}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    Save Design
                </button>
                <label className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600">
                    Load Design
                    <input
                        type="file"
                        accept=".json"
                        onChange={importConfig}
                        className="hidden"
                    />
                </label>
            </div>
        </div>
    );
}