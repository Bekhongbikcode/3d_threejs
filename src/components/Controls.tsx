import React from 'react';
import { useCustomizationStore } from '../store/customization';
import { Play, Pause, Download, Upload, Palette, LucideIcon } from 'lucide-react';

interface SliderProps {
    label: string;
    value: number;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    min: number;
    max: number;
    step: number;
    icon?: LucideIcon;
}

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

    const Slider: React.FC<SliderProps> = ({
        label,
        value,
        onChange,
        min,
        max,
        step,
        icon: Icon
    }) => (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    {Icon && <Icon size={16} className="text-teal-600" />}
                    {label}
                </label>
                <span className="text-sm text-gray-500">{value.toFixed(1)}</span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={onChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer
                         accent-teal-600 hover:accent-teal-700 transition-all"
            />
        </div>
    );

    return (
        <div className="w-80 p-6 bg-white rounded-xl shadow-lg space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Cake Customizer</h2>
                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-2 rounded-full bg-teal-100 text-teal-600 hover:bg-teal-200 
                             transition-colors duration-200"
                >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>
            </div>

            {selectedPart ? (
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div className="flex items-center gap-2">
                        <Palette size={16} className="text-teal-600" />
                        <label className="text-sm font-medium text-gray-700">
                            {selectedPart} Color
                        </label>
                    </div>
                    <input
                        type="color"
                        value={colors[selectedPart] || '#ffffff'}
                        onChange={(e) => setColorForPart(selectedPart, e.target.value)}
                        className="w-full h-10 rounded cursor-pointer"
                    />
                </div>
            ) : (
                <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                        <Palette size={16} />
                        Click any part of the cake to customize its color
                    </p>
                </div>
            )}

            <div className="space-y-4">
                <Slider
                    label="Cake Size"
                    value={scale}
                    onChange={(e) => setScale(parseFloat(e.target.value))}
                    min={0.5}
                    max={2}
                    step={0.1}
                />

                <Slider
                    label="Frosting Texture"
                    value={roughness}
                    onChange={(e) => setRoughness(parseFloat(e.target.value))}
                    min={0}
                    max={1}
                    step={0.1}
                />

                <Slider
                    label="Decoration Shine"
                    value={metalness}
                    onChange={(e) => setMetalness(parseFloat(e.target.value))}
                    min={0}
                    max={1}
                    step={0.1}
                />

                <Slider
                    label="Rotation Speed"
                    value={animationSpeed}
                    onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
                    min={0}
                    max={2}
                    step={0.1}
                />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
                <button
                    onClick={exportConfig}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-teal-600 
                             text-white rounded-lg hover:bg-teal-700 transition-colors duration-200"
                >
                    <Download size={16} />
                    Save Design
                </button>
                <label className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 
                                text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 
                                cursor-pointer">
                    <Upload size={16} />
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