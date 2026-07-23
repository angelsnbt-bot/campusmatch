import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import './Hyperspeed.css';

interface HyperspeedProps {
  className?: string;
  effectActive?: boolean;
  speed?: number;
  roadWidth?: number;
  roadLines?: number;
  colors?: [string, string];
  quality?: 'low' | 'medium' | 'high';
}

const Hyperspeed: React.FC<HyperspeedProps> = ({
  className = '',
  effectActive = true,
  speed = 0.5,
  roadWidth = 1.0,
  roadLines = 50,
  colors = ['#3b82f6', '#8b5cf6'],
  quality = 'medium',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const timeRef = useRef(0);
  const [webGLSupported, setWebGLSupported] = useState(true);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || (canvas as any).getContext('experimental-webgl');
    if (!gl) {
      setWebGLSupported(false);
    }
  }, []);

  useEffect(() => {
    if (!containerRef.current || !webGLSupported || !effectActive) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    cameraRef.current = camera;

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    let pixelRatio: number;
    let iterations: number;
    if (quality === 'high') {
      pixelRatio = isMobile ? 0.6 : Math.min(window.devicePixelRatio, 1.5);
      iterations = 100;
    } else if (quality === 'medium') {
      pixelRatio = isMobile ? 0.5 : Math.min(window.devicePixelRatio, 1.2);
      iterations = 70;
    } else {
      pixelRatio = 0.5;
      iterations = 40;
    }

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: true,
        powerPreference: 'low-power',
        precision: 'mediump',
        stencil: false,
        depth: false,
      });
    } catch {
      setWebGLSupported(false);
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(pixelRatio);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const parseColor = (hex: string) => {
      const c = new THREE.Color(hex);
      return new THREE.Vector3(c.r, c.g, c.b);
    };

    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      precision mediump float;
      uniform float uTime;
      uniform vec2 uResolution;
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      uniform float uSpeed;
      uniform float uRoadWidth;
      uniform float uIntensity;
      uniform int uIterations;
      varying vec2 vUv;

      void main() {
        vec2 uv = (vUv * 2.0 - 1.0) * vec2(uResolution.x / uResolution.y, 1.0);

        float t = uTime * uSpeed;

        float road = smoothstep(uRoadWidth, 0.0, abs(uv.x));

        float z = 1.0 / (abs(uv.y) + 0.01) + t;
        float lines = step(0.95, fract(z * 4.0));
        float roadLines = road * lines * 0.3;

        float speedLines = 0.0;
        for (int i = 0; i < 100; i++) {
          if (i >= uIterations) break;
          float fi = float(i);
          float angle = fract(fi * 0.618) * 3.14159 * 2.0;
          vec2 dir = vec2(cos(angle), sin(angle));
          float d = abs(dot(uv, vec2(-dir.y, dir.x)));
          float len = fract(fi * 0.314 + t * 0.1) * 2.0 + 0.5;
          float brightness = smoothstep(len, 0.0, d) * 0.02;
          speedLines += brightness;
        }

        float glow = road * 0.15;
        vec3 color = mix(uColor1, uColor2, vUv.y * 0.5 + 0.5 + sin(t) * 0.2);

        float finalIntensity = (glow + roadLines + speedLines) * uIntensity;
        vec3 finalColor = color * finalIntensity;

        gl_FragColor = vec4(finalColor, finalIntensity * 0.8);
      }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(width, height) },
        uColor1: { value: parseColor(colors[0]) },
        uColor2: { value: parseColor(colors[1]) },
        uSpeed: { value: speed },
        uRoadWidth: { value: roadWidth },
        uIntensity: { value: 1.0 },
        uIterations: { value: iterations },
      },
      transparent: true,
      depthWrite: false,
      depthTest: false,
    });
    materialRef.current = material;

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let lastTime = performance.now();
    const targetFPS = quality === 'high' ? 60 : 45;
    const frameTime = 1000 / targetFPS;

    const animate = (currentTime: number) => {
      if (!materialRef.current || !rendererRef.current || !sceneRef.current || !cameraRef.current) return;

      const deltaTime = currentTime - lastTime;
      if (deltaTime >= frameTime) {
        timeRef.current += 0.016;
        materialRef.current.uniforms.uTime.value = timeRef.current;
        rendererRef.current.render(sceneRef.current, cameraRef.current);
        lastTime = currentTime - (deltaTime % frameTime);
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    let resizeTimeout: number | null = null;
    const handleResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(() => {
        if (!rendererRef.current || !materialRef.current || !containerRef.current) return;
        const newWidth = containerRef.current.clientWidth;
        const newHeight = containerRef.current.clientHeight;
        rendererRef.current.setSize(newWidth, newHeight);
        materialRef.current.uniforms.uResolution.value.set(newWidth, newHeight);
      }, 150) as unknown as number;
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (rendererRef.current) {
        rendererRef.current.dispose();
        rendererRef.current.forceContextLoss();
        if (container.contains(rendererRef.current.domElement)) {
          container.removeChild(rendererRef.current.domElement);
        }
      }
      if (materialRef.current) materialRef.current.dispose();
      if (geometry) geometry.dispose();
      rendererRef.current = null;
      materialRef.current = null;
      sceneRef.current = null;
      cameraRef.current = null;
      rafRef.current = null;
    };
  }, [webGLSupported, effectActive, quality, speed, roadWidth, colors]);

  if (!webGLSupported || !effectActive) {
    return <div className={`hyperspeed-fallback ${className}`} />;
  }

  return <div ref={containerRef} className={`hyperspeed-container ${className}`} />;
};

export default Hyperspeed;
