"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Group } from "three";
import { GIFT_MODEL_PATHS } from "@/lib/giftModels";

const MODEL_SCALE = [1.12, 0.96, 0.98, 0.91] as const;
const MODEL_OFFSET = [-0.66, -0.80, -0.63, -0.81] as const;

type SceneProps = {
  centers: { x: number; y: number }[];
  size: { width: number; height: number };
  opened: boolean[];
  hovered: number | null;
  visible: boolean;
  playing: boolean;
  reduceMotion: boolean;
  onReady: () => void;
};

function Present({ index, x, y, opened, hovered, playing, reduceMotion, onReady }: {
  index: number;
  x: number;
  y: number;
  opened: boolean;
  hovered: boolean;
  playing: boolean;
  reduceMotion: boolean;
  onReady: () => void;
}) {
  const { scene } = useGLTF(GIFT_MODEL_PATHS[index]);
  const { invalidate } = useThree();
  const root = useRef<Group>(null);
  const lidVelocity = useRef(0);
  const model = useMemo(() => scene.clone(true), [scene]);
  const lid = useMemo(() => model.getObjectByName("GiftLid"), [model]);

  useEffect(() => {
    if (lid) onReady();
  }, [lid, onReady]);

  useEffect(() => {
    if (reduceMotion && lid) {
      lid.rotation.x = opened ? -1.2 : 0;
      lidVelocity.current = 0;
      invalidate();
    }
  }, [opened, reduceMotion, lid, invalidate]);

  useFrame((state, delta) => {
    if (!playing || reduceMotion) return;
    const step = Math.min(delta, 0.05);
    if (root.current) {
      const drift = Math.sin(state.clock.elapsedTime * 1.05 + index * 1.1);
      const targetY = y + drift * 0.045 + (opened ? 0.09 : hovered ? 0.055 : 0);
      root.current.position.y += (targetY - root.current.position.y) * (1 - Math.exp(-step * 6));
      const targetTurn = hovered ? 0.13 : Math.sin(state.clock.elapsedTime * 0.6 + index) * 0.035;
      root.current.rotation.y += (targetTurn - root.current.rotation.y) * (1 - Math.exp(-step * 5));
      root.current.rotation.z += ((opened ? -0.025 : 0) - root.current.rotation.z) * (1 - Math.exp(-step * 5));
      const scale = 1 + (hovered ? 0.025 : 0) + (opened ? 0.025 : 0);
      root.current.scale.setScalar(root.current.scale.x + (scale - root.current.scale.x) * (1 - Math.exp(-step * 5)));
    }
    if (lid) {
      const target = opened ? -1.2 : 0;
      lidVelocity.current += (target - lid.rotation.x) * 44 * step;
      lidVelocity.current *= Math.exp(-7.5 * step);
      lid.rotation.x += lidVelocity.current * step;
    }
  });

  return (
    <group ref={root} position={[x, y, 0]}>
      <primitive object={model} rotation={[0.18, -0.35, 0]} scale={MODEL_SCALE[index]} position={[0, MODEL_OFFSET[index], 0]} />
    </group>
  );
}

function Presents({ centers, size, opened, hovered, playing, reduceMotion, onReady }: SceneProps) {
  return (
    <>
      <hemisphereLight args={["#fff4e3", "#19213b", 2.1]} />
      <directionalLight position={[-3, 5, 8]} intensity={3.8} />
      <directionalLight position={[4, 2, 5]} intensity={1.7} color="#f2d8ae" />
      {centers.map((center, index) => (
        <Present
          key={index}
          index={index}
          x={(center.x - size.width / 2) / 100}
          y={(size.height / 2 - center.y) / 100}
          opened={opened[index]}
          hovered={hovered === index}
          playing={playing}
          reduceMotion={reduceMotion}
          onReady={onReady}
        />
      ))}
    </>
  );
}

export default function GiftScene(props: SceneProps) {
  return (
    <div className={`pointer-events-none absolute inset-0 z-10 transition-opacity ${props.reduceMotion ? "duration-0" : "duration-500"}`} style={{ opacity: props.visible ? 1 : 0 }} aria-hidden="true">
      <Canvas
        orthographic
        camera={{ position: [0, 0, 10], zoom: 100, near: 0.1, far: 100 }}
        frameloop={props.playing && !props.reduceMotion ? "always" : "demand"}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <Presents {...props} />
        </Suspense>
      </Canvas>
    </div>
  );
}
