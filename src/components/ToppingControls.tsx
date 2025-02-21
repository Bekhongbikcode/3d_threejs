import React from 'react';
import { useCustomizationStore } from '../store/customization';
import * as THREE from 'three';

export function ToppingControls() {
    const { selectedPart, toppings, addToppingToPart, removeToppingFromPart } = useCustomizationStore();

    const toppingTypes = [
        { id: 'sprinkles', name: 'Sprinkles' },
        { id: 'chocolate-chips', name: 'Chocolate Chips' },
        { id: 'nuts', name: 'Nuts' }
    ];

    if (!selectedPart) return null;

    return (
        <div className="space-y-4 p-4 border rounded-lg bg-white shadow-sm">
            <h3 className="text-lg font-medium text-gray-900">Add Toppings</h3>

            <div className="grid grid-cols-2 gap-2">
                {toppingTypes.map((type) => (
                    <button
                        key={type.id}
                        onClick={() => addToppingToPart(selectedPart, {
                            type: type.id,
                            density: 1,
                            size: 1,
                            color: '#000000',
                            position: new THREE.Vector3(0, 0, 0)
                        })}
                        className="p-2 border rounded hover:bg-gray-100"
                    >
                        {type.name}
                    </button>
                ))}
            </div>

            <div className="space-y-2">
                {toppings[selectedPart]?.map((topping, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm font-medium">{topping.type}</span>
                        <div className="space-x-2">
                            <input
                                type="range"
                                min="0.1"
                                max="2"
                                step="0.1"
                                value={topping.size}
                                onChange={(e) => {
                                    const newToppings = [...toppings[selectedPart]];
                                    newToppings[index] = {
                                        ...topping,
                                        size: parseFloat(e.target.value)
                                    };
                                    addToppingToPart(selectedPart, newToppings[index]);
                                }}
                                className="w-24"
                            />
                            <button
                                onClick={() => removeToppingFromPart(selectedPart, index)}
                                className="text-red-500 hover:text-red-600"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}