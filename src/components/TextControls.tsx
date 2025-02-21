import React, { useState } from 'react'
import { useCustomizationStore } from '../store/customization'
import * as THREE from 'three'

export function TextControls() {
    const { selectedPart, texts, addTextToPart, removeTextFromPart } = useCustomizationStore()
    const [newText, setNewText] = useState('')
    const [textColor, setTextColor] = useState('#000000')
    const [textSize, setTextSize] = useState(1)

    if (!selectedPart) return null

    const handleAddText = () => {
        if (!newText.trim()) return

        addTextToPart(selectedPart, {
            content: newText,
            font: 'helvetiker',
            size: textSize,
            color: textColor,
            position: new THREE.Vector3(0, 0, 0),
            rotation: new THREE.Euler(0, 0, 0)
        })
        setNewText('')
    }

    return (
        <div className="space-y-4 p-4 border rounded-lg bg-white shadow-sm">
            <h3 className="text-lg font-medium text-gray-900">Add Text</h3>

            <div className="space-y-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Text Content
                    </label>
                    <input
                        type="text"
                        value={newText}
                        onChange={(e) => setNewText(e.target.value)}
                        placeholder="Enter text..."
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Text Color
                    </label>
                    <input
                        type="color"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="mt-1 block"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Text Size
                    </label>
                    <input
                        type="range"
                        min="0.1"
                        max="2"
                        step="0.1"
                        value={textSize}
                        onChange={(e) => setTextSize(parseFloat(e.target.value))}
                        className="w-full mt-1"
                    />
                </div>

                <button
                    onClick={handleAddText}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Add Text
                </button>
            </div>

            <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700">Current Texts</h4>
                <div className="mt-2 space-y-2">
                    {Object.entries(texts)
                        .filter(([id]) => id.startsWith(selectedPart))
                        .map(([id, config]) => (
                            <div key={id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                                <span className="text-sm text-gray-600">
                                    {config.content}
                                </span>
                                <button
                                    onClick={() => removeTextFromPart(selectedPart, id)}
                                    className="text-red-500 hover:text-red-600"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    )
}