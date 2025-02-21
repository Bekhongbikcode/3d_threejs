import { create } from 'zustand';
import { TextureConfig, TextConfig, ToppingConfig, ImageConfig } from '../types/types'

interface CustomizationStore {
    selectedPart: string | null;
    colors: Record<string, string>;
    textures: Record<string, TextureConfig>;
    texts: Record<string, TextConfig>;
    toppings: Record<string, ToppingConfig[]>;
    images: Record<string, ImageConfig[]>;
    scale: number;
    roughness: number;
    metalness: number;
    animationSpeed: number;
    isPlaying: boolean;

    setSelectedPart: (part: string | null) => void;
    setColorForPart: (part: string, color: string) => void;
    setTextureForPart: (part: string, config: TextureConfig) => void;
    addTextToPart: (part: string, config: TextConfig) => void;
    removeTextFromPart: (part: string, textId: string) => void;
    addToppingToPart: (part: string, config: ToppingConfig) => void;
    removeToppingFromPart: (part: string, index: number) => void;
    addImageToPart: (part: string, config: ImageConfig) => void;
    removeImageFromPart: (part: string, index: number) => void;
    updateImageConfig: (part: string, index: number, config: Partial<ImageConfig>) => void;
    setScale: (scale: number) => void;
    setRoughness: (roughness: number) => void;
    setMetalness: (metalness: number) => void;
    setAnimationSpeed: (speed: number) => void;
    setIsPlaying: (isPlaying: boolean) => void;
}

export const useCustomizationStore = create<CustomizationStore>((set) => ({
    selectedPart: null,
    colors: {
        'cake-base': '#FFE4B5',
        'frosting-top': '#FFC0CB',
        'frosting-middle': '#FFB6C1',
        'frosting-bottom': '#FF69B4',
        'decoration': '#FF1493'
    },
    textures: {},
    texts: {},
    toppings: {},
    images: {},
    scale: 1,
    roughness: 0.3,
    metalness: 0.1,
    animationSpeed: 0.5,
    isPlaying: true,

    setSelectedPart: (part) => set({ selectedPart: part }),
    setColorForPart: (part, color) => set((state) => ({
        colors: { ...state.colors, [part]: color }
    })),
    setTextureForPart: (part, config) => set((state) => ({
        textures: { ...state.textures, [part]: config }
    })),
    addTextToPart: (part, config) => set((state) => ({
        texts: { ...state.texts, [`${part}-${Date.now()}`]: config }
    })),
    removeTextFromPart: (part, textId) => set((state) => {
        const newTexts = { ...state.texts };
        delete newTexts[textId];
        return { texts: newTexts };
    }),
    addToppingToPart: (part, config) => set((state) => ({
        toppings: {
            ...state.toppings,
            [part]: [...(state.toppings[part] || []), config]
        }
    })),
    removeToppingFromPart: (part, index) => set((state) => ({
        toppings: {
            ...state.toppings,
            [part]: state.toppings[part]?.filter((_, i) => i !== index) || []
        }
    })),
    addImageToPart: (part, config) => set((state) => ({
        images: {
            ...state.images,
            [part]: [...(state.images[part] || []), config]
        }
    })),
    removeImageFromPart: (part, index) => set((state) => ({
        images: {
            ...state.images,
            [part]: state.images[part]?.filter((_, i) => i !== index) || []
        }
    })),
    updateImageConfig: (part, index, config) => set((state) => ({
        images: {
            ...state.images,
            [part]: state.images[part]?.map((img, i) =>
                i === index ? { ...img, ...config } : img
            ) || []
        }
    })),
    setScale: (scale) => set({ scale }),
    setRoughness: (roughness) => set({ roughness }),
    setMetalness: (metalness) => set({ metalness }),
    setAnimationSpeed: (animationSpeed) => set({ animationSpeed }),
    setIsPlaying: (isPlaying) => set({ isPlaying })
}));