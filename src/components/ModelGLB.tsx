import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Text } from '@react-three/drei';
import { useCustomizationStore } from '../store/customization';
import * as THREE from 'three';

export function ModelGLB({ modelPath = '/cake5.glb' }) {
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
        images,
        texts,
        toppings
    } = useCustomizationStore();
    const [originalMaterials, setOriginalMaterials] = useState<Map<string, THREE.Material>>(new Map());
    const [hovered, setHovered] = useState<string | null>(null);

    // Initialize original materials
    useEffect(() => {
        scene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                const materialId = child.uuid;
                const originalMaterial = child.material.clone();
                setOriginalMaterials(prev => new Map(prev).set(materialId, originalMaterial));
                child.userData.name = child.name;
                child.raycast = new THREE.Mesh().raycast;
            }
        });
    }, [scene]);

    // Get topping geometry based on type
    const getToppingGeometry = (type: string): THREE.BufferGeometry => {
        switch (type) {
            case 'sprinkles':
                return new THREE.BoxGeometry(0.1, 0.02, 0.02);
            case 'chocolate-chips':
                return new THREE.SphereGeometry(0.05, 8, 8);
            case 'nuts':
                return new THREE.IcosahedronGeometry(0.05, 0);
            default:
                return new THREE.SphereGeometry(0.05, 8, 8);
        }
    };

    // Handle material and decoration updates
    useEffect(() => {
        scene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                const originalMaterial = originalMaterials.get(child.uuid);
                if (originalMaterial) {
                    const newMaterial = originalMaterial.clone();
                    if (newMaterial instanceof THREE.MeshStandardMaterial) {
                        // Apply base material properties
                        if (colors[child.name]) {
                            newMaterial.color.set(colors[child.name]);
                        }

                        // Apply textures if available
                        const textureConfig = textures[child.name];
                        if (textureConfig) {
                            const texture = new THREE.TextureLoader().load(textureConfig.texture);
                            texture.repeat.set(textureConfig.repeat, textureConfig.repeat);
                            texture.rotation = textureConfig.rotation * Math.PI / 180;
                            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                            newMaterial.map = texture;
                        }

                        // Handle selection and hover effects
                        if (selectedPart === child.name) {
                            newMaterial.emissive.set('#444444');
                        } else if (hovered === child.name) {
                            newMaterial.emissive.set('#222222');
                        } else {
                            newMaterial.emissive.set('#000000');
                        }

                        child.material = newMaterial;

                        // Clear existing decorations
                        child.children = child.children.filter(c => c.userData.isPermanent);

                        // Add image decorations
                        const partImages = images[child.name];
                        if (partImages?.length) {
                            partImages.forEach((imageConfig) => {
                                const texture = new THREE.TextureLoader().load(imageConfig.url);
                                const decalMaterial = new THREE.MeshPhysicalMaterial({
                                    map: texture,
                                    transparent: true,
                                    opacity: imageConfig.opacity,
                                    depthTest: true,
                                    depthWrite: false,
                                    polygonOffset: true,
                                    polygonOffsetFactor: -4,
                                });

                                const decalGeometry = new THREE.PlaneGeometry(
                                    1 * imageConfig.scale,
                                    1 * imageConfig.scale
                                );

                                const decal = new THREE.Mesh(decalGeometry, decalMaterial);
                                decal.position.copy(imageConfig.position);
                                decal.rotation.copy(imageConfig.rotation);
                                decal.userData.isImage = true;
                                child.add(decal);
                            });
                        }

                        // Add toppings
                        const partToppings = toppings[child.name];
                        if (partToppings?.length) {
                            partToppings.forEach((toppingConfig) => {
                                const geometry = getToppingGeometry(toppingConfig.type);
                                const material = new THREE.MeshStandardMaterial({
                                    color: toppingConfig.color
                                });
                                const topping = new THREE.Mesh(geometry, material);
                                topping.position.copy(toppingConfig.position);
                                topping.scale.setScalar(toppingConfig.size);
                                topping.userData.isTopping = true;
                                child.add(topping);
                            });
                        }
                    }
                }
            }
        });
    }, [colors, selectedPart, hovered, originalMaterials, textures, images, texts, toppings]);

    // Handle animation
    useFrame((state, delta) => {
        if (meshRef.current && isPlaying) {
            meshRef.current.rotation.y += delta * animationSpeed;
        }
    });

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
            {/* Render texts as separate components */}
            {Object.entries(texts).map(([textId, config]) => (
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