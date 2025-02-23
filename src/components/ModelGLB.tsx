import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Text } from '@react-three/drei';
import { useCustomizationStore } from '../store/customization';
import * as THREE from 'three';

interface TextConfig {
    position: { x: number; y: number; z: number };
    rotation: { x: number; y: number; z: number };
    size: number;
    color: string;
    content: string;
}

interface TextureConfig {
    texture: string;
    repeat: number;
    rotation: number;
}

export function ModelGLB({ modelPath = '/cake3.glb' }) {
    const meshRef = useRef<THREE.Group>(null!);
    const { scene } = useGLTF(modelPath);
    const {
        colors,
        selectedPart,
        scale,
        animationSpeed,
        isPlaying,
        setSelectedPart,
        textures,
        texts
    } = useCustomizationStore();

    const [originalMaterials] = useState<Map<string, THREE.Material>>(new Map());
    const [hovered, setHovered] = useState<string | null>(null);
    const [loadedTextures, setLoadedTextures] = useState<Map<string, THREE.Texture>>(new Map());
    const [rotation, setRotation] = useState(0);

    // Implement rotation animation using useFrame
    useFrame((_, delta) => {
        if (isPlaying && meshRef.current) {
            setRotation((prev) => prev + delta * animationSpeed);
            meshRef.current.rotation.y = rotation;
        }
    });

    // Debug scene hierarchy
    useEffect(() => {
        console.log('Scene hierarchy:');
        scene.traverse((object) => {
            if (object instanceof THREE.Mesh) {
                console.log({
                    name: object.name,
                    type: object.type,
                    geometry: {
                        type: object.geometry.type,
                        hasUVs: !!object.geometry.attributes.uv,
                        uvs: object.geometry.attributes.uv?.array,
                    },
                    material: {
                        type: object.material.type,
                        properties: {
                            transparent: object.material.transparent,
                            side: object.material.side,
                            visible: object.material.visible,
                            opacity: object.material.opacity,
                        }
                    },
                    position: object.position,
                    rotation: object.rotation,
                    scale: object.scale,
                });
            }
        });
    }, [scene]);

    // Enhanced texture loading with debug
    useEffect(() => {
        const textureLoader = new THREE.TextureLoader();

        const loadTexture = async (textureUrl: string) => {
            console.log('Loading texture:', textureUrl);
            return new Promise<THREE.Texture>((resolve, reject) => {
                textureLoader.load(
                    textureUrl,
                    (texture) => {
                        console.log('Texture loaded:', {
                            url: textureUrl,
                            size: {
                                width: texture.image.width,
                                height: texture.image.height
                            },
                            format: texture.format,
                            type: texture.type
                        });

                        // Configure texture
                        texture.colorSpace = THREE.SRGBColorSpace;
                        texture.flipY = false;
                        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                        texture.needsUpdate = true;

                        resolve(texture);
                    },
                    undefined,
                    reject
                );
            });
        };

        Object.entries(textures).forEach(async ([_, config]) => {
            try {
                const texture = await loadTexture(config.texture);
                setLoadedTextures(prev => new Map(prev).set(config.texture, texture));
            } catch (error) {
                console.error('Failed to load texture:', config.texture, error);
            }
        });

        return () => {
            loadedTextures.forEach(texture => texture.dispose());
        };
    }, [textures]);

    // Enhanced material update with debug
    useEffect(() => {
        scene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                const originalMaterial = originalMaterials.get(child.uuid);
                if (originalMaterial && originalMaterial instanceof THREE.MeshStandardMaterial) {
                    const newMaterial = new THREE.MeshStandardMaterial();

                    // Basic material properties
                    newMaterial.transparent = true;
                    newMaterial.side = THREE.DoubleSide;
                    newMaterial.needsUpdate = true;

                    // Apply color
                    if (colors[child.name]) {
                        newMaterial.color.set(colors[child.name]);
                    }

                    // Apply texture with detailed logging
                    const textureConfig = textures[child.name];
                    if (textureConfig && loadedTextures.has(textureConfig.texture)) {
                        const texture = loadedTextures.get(textureConfig.texture)!.clone();

                        // Configure texture properties
                        texture.repeat.set(textureConfig.repeat, textureConfig.repeat);
                        texture.rotation = textureConfig.rotation * Math.PI / 180;
                        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                        texture.needsUpdate = true;

                        // Apply texture to material
                        newMaterial.map = texture;
                        newMaterial.needsUpdate = true;

                        console.log('Material updated for:', child.name, {
                            hasTexture: !!newMaterial.map,
                            textureProperties: {
                                repeat: texture.repeat.toArray(),
                                rotation: texture.rotation,
                                wrapS: texture.wrapS,
                                wrapT: texture.wrapT
                            },
                            materialProperties: {
                                transparent: newMaterial.transparent,
                                side: newMaterial.side,
                                visible: newMaterial.visible,
                                needsUpdate: newMaterial.needsUpdate
                            }
                        });
                    }

                    // Apply selection/hover effects
                    if (selectedPart === child.name) {
                        newMaterial.emissive.set('#444444');
                    } else if (hovered === child.name) {
                        newMaterial.emissive.set('#222222');
                    } else {
                        newMaterial.emissive.set('#000000');
                    }

                    // Assign new material
                    child.material = newMaterial;
                }
            }
        });
    }, [colors, selectedPart, hovered, originalMaterials, textures, loadedTextures]);

    return (
        <group
            ref={meshRef}
            scale={[scale, scale, scale]}
            onPointerOver={(e) => {
                e.stopPropagation();
                setHovered(e.object.name);
                document.body.style.cursor = 'pointer';
            }}
            onPointerOut={(e) => {
                e.stopPropagation();
                setHovered(null);
                document.body.style.cursor = 'auto';
            }}
            onClick={(e) => {
                e.stopPropagation();
                setSelectedPart(e.object.name);
            }}
        >
            <primitive object={scene} />
            {Object.entries(texts).map(([textId, config]: [string, TextConfig]) => (
                <Text
                    key={textId}
                    position={[config.position.x, config.position.y, config.position.z]}
                    rotation={[config.rotation.x, config.rotation.y, config.rotation.z]}
                    fontSize={config.size}
                    color={config.color}
                >
                    {config.content}
                </Text>
            ))}
        </group>
    );
}