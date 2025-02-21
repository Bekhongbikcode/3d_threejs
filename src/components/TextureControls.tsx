import React from 'react';
import { useCustomizationStore } from '../store/customization';

export function TextureControls() {
    const { selectedPart, textures, setTextureForPart } = useCustomizationStore();

    const textureOptions = [
        { id: 'sprinkles', path: '/file.svg', name: 'Sprinkles' },
        { id: 'chocolate', path: '/next.svg', name: 'Chocolate' },
        { id: 'marble', path: '/vercel.svg', name: 'Marble' },
        { id: 'dots', path: '/window.svg', name: 'Dots' }
    ];

    if (!selectedPart) return null;

    const currentTexture = textures[selectedPart];

    return (
        <div className="space-y-4 p-4 border rounded-lg bg-white shadow-sm">
            <h3 className="text-lg font-medium text-gray-900">Textures</h3>

            <div className="grid grid-cols-2 gap-2">
                {textureOptions.map((texture) => (
                    <button
                        key={texture.id}
                        onClick={() => setTextureForPart(selectedPart, {
                            texture: texture.path,
                            scale: 1,
                            rotation: 0,
                            repeat: 1
                        })}
                        className="relative p-2 border rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <img
                            src={texture.path}
                            alt={texture.name}
                            className="w-full h-20 object-cover rounded"
                        />
                        <span className="block mt-1 text-sm text-gray-600">
                            {texture.name}
                        </span>
                    </button>
                ))}
            </div>

            {currentTexture && (
                <div className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Scale
                        </label>
                        <input
                            type="range"
                            min="0.1"
                            max="5"
                            step="0.1"
                            value={currentTexture.scale}
                            onChange={(e) => setTextureForPart(selectedPart, {
                                ...currentTexture,
                                scale: parseFloat(e.target.value)
                            })}
                            className="w-full mt-1"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Rotation
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="360"
                            value={currentTexture.rotation}
                            onChange={(e) => setTextureForPart(selectedPart, {
                                ...currentTexture,
                                rotation: parseInt(e.target.value)
                            })}
                            className="w-full mt-1"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Repeat
                        </label>
                        <input
                            type="range"
                            min="1"
                            max="10"
                            value={currentTexture.repeat}
                            onChange={(e) => setTextureForPart(selectedPart, {
                                ...currentTexture,
                                repeat: parseInt(e.target.value)
                            })}
                            className="w-full mt-1"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}