import React, { useState, ChangeEvent } from 'react';
import { useCustomizationStore } from '../store/customization';
import * as THREE from 'three';
import { Type, Palette, Trash2, Scale, Plus } from 'lucide-react';

// Types
interface TextConfig {
    content: string;
    font: string;
    size: number;
    color: string;
    position: THREE.Vector3;
    rotation: THREE.Euler;
}

interface Texts {
    [key: string]: TextConfig;
}

interface ColorInputProps {
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    label: string;
}

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

// Custom Card Components
const Card: React.FC<CardProps> = ({ children, className = '' }) => (
    <div className={`bg-white rounded-lg shadow-sm ${className}`}>
        {children}
    </div>
);

const CardHeader: React.FC<CardProps> = ({ children, className = '' }) => (
    <div className={`px-6 py-4 ${className}`}>
        {children}
    </div>
);

const CardTitle: React.FC<CardProps> = ({ children, className = '' }) => (
    <h3 className={`text-xl font-semibold text-gray-900 ${className}`}>
        {children}
    </h3>
);

const CardContent: React.FC<CardProps> = ({ children, className = '' }) => (
    <div className={`px-6 pb-6 ${className}`}>
        {children}
    </div>
);

// Color Input Component
const ColorInput: React.FC<ColorInputProps> = ({ value, onChange, label }) => (
    <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Palette className="w-4 h-4" />
            {label}
        </label>
        <div className="flex items-center gap-3">
            <input
                type="color"
                value={value}
                onChange={onChange}
                className="w-10 h-10 rounded-lg cursor-pointer"
            />
            <input
                type="text"
                value={value.toUpperCase()}
                onChange={onChange}
                className="flex-1 px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                pattern="^#[0-9A-Fa-f]{6}$"
            />
        </div>
    </div>
);

export function TextControls() {
    const { selectedPart, texts, addTextToPart, removeTextFromPart } = useCustomizationStore();
    const [newText, setNewText] = useState<string>('');
    const [textColor, setTextColor] = useState<string>('#000000');
    const [textSize, setTextSize] = useState<number>(1);

    if (!selectedPart) return null;

    const handleAddText = () => {
        if (!newText.trim()) return;

        addTextToPart(selectedPart, {
            content: newText,
            font: 'helvetiker',
            size: textSize,
            color: textColor,
            position: new THREE.Vector3(0, 0, 0),
            rotation: new THREE.Euler(0, 0, 0)
        });
        setNewText('');
    };

    const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
        setNewText(e.target.value);
    };

    const handleColorChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTextColor(e.target.value);
    };

    const handleSizeChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTextSize(parseFloat(e.target.value));
    };

    return (
        <Card className="w-full max-w-md">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                    <Type className="w-5 h-5" />
                    Text Controls
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Text Content
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newText}
                                onChange={handleTextChange}
                                placeholder="Enter your text here..."
                                className="flex-1 px-3 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                onClick={handleAddText}
                                disabled={!newText.trim()}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Add
                            </button>
                        </div>
                    </div>

                    <ColorInput
                        value={textColor}
                        onChange={handleColorChange}
                        label="Text Color"
                    />

                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <Scale className="w-4 h-4" />
                            Text Size
                        </label>
                        <div className="flex items-center gap-4">
                            <input
                                type="range"
                                min="0.1"
                                max="2"
                                step="0.1"
                                value={textSize}
                                onChange={handleSizeChange}
                                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                            <span className="w-12 text-sm text-gray-600 tabular-nums">
                                {textSize.toFixed(1)}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-700">Applied Texts</h4>
                    <div className="space-y-2">
                        {Object.entries(texts as Texts)
                            .filter(([id]) => id.startsWith(selectedPart))
                            .map(([id, config]) => (
                                <div
                                    key={id}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-4 h-4 rounded-full"
                                            style={{ backgroundColor: config.color }}
                                        />
                                        <span className="text-sm text-gray-700">
                                            {config.content}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => removeTextFromPart(selectedPart, id)}
                                        className="p-1 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
                                        aria-label="Remove text"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default TextControls;