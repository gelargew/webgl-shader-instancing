import { Effects, Instance, Instances, OrbitControls } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import React from 'react'
import * as THREE from 'three'

const grid = 55
const size = 0.5
const gridSize = grid * size
const positions = [] as [number, number, number][]
for (let x = 0; x < grid; x++) {
    for (let y = 0; y < grid; y++) {
        positions.push([
            x * size - gridSize / 2 + size / 2,
            0,
            y * size - gridSize / 2 + size / 2,
        ])
    }
}
const uTime = { value: 0 }
const uniforms = {
    uTime,
}

const vertexHead = `

  uniform float uTime;

  mat4 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;

    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
  }

  vec3 rotate(vec3 v, vec3 axis, float angle) {
    mat4 m = rotationMatrix(axis, angle);
    return (m * vec4(v, 1.0)).xyz;
  }

  void main(){

`
const projectVertex = `
        vec4 position = instanceMatrix[3];
        float toCenter = length(position.xz);
        transformed.y += sin(uTime * 2. + toCenter) * .3;

        transformed = rotate(transformed, vec3(0., 1., 1.), uTime + toCenter * .4);
        transformed.y += sin(uTime * 2. + toCenter) * .3;

        // Code goes above this
        vec4 mvPosition = vec4( transformed, 1.0 );

        #ifdef USE_INSTANCING

          mvPosition = instanceMatrix * mvPosition;

        #endif

        mvPosition = modelViewMatrix * mvPosition;

        gl_Position = projectionMatrix * mvPosition;
`

export const Scene_old = () => {
    return (
        <Canvas>
            <ambientLight intensity={5} />
            <OrbitControls />
            <Objects />
            <Effects>

            </Effects>
        </Canvas>
    )
}

const Objects = () => {
    const meshP = React.useRef<THREE.MeshPhysicalMaterial>(null!)
    const meshD = React.useRef<THREE.MeshDepthMaterial>(null!)

    useFrame(({clock}) => {
      // @ts-ignore
      const pUniforms = meshP.current?.uniforms
      // @ts-ignore
      const dUniforms = meshD.current?.uniforms

      if (pUniforms?.uTime) pUniforms.uTime.value = clock.getElapsedTime()
      if (dUniforms?.uTime) dUniforms.uTime.value = clock.getElapsedTime()
    })

    return (
        <Instances limit={grid * grid}>
            <meshPhysicalMaterial
                ref={meshP}
                color={0x1084ff}
                metalness={0}
                roughness={0}
                onBeforeCompile={shader => {
                    shader.vertexShader = shader.vertexShader.replace(
                        'void main() {',
                        vertexHead,
                    )
                    shader.vertexShader = shader.vertexShader.replace(
                        '#include <project_vertex>',
                        projectVertex,
                    )
                    shader.uniforms = {
                        ...shader.uniforms,
                        ...uniforms,
                    }
                }}
            />
            <meshDepthMaterial
                ref={meshD}
                onBeforeCompile={shader => {
                    shader.vertexShader = shader.vertexShader.replace(
                        'void main() {',
                        vertexHead,
                    )
                    shader.vertexShader = shader.vertexShader.replace(
                        '#include <project_vertex>',
                        projectVertex,
                    )
                    shader.uniforms = {
                        ...shader.uniforms,
                        ...uniforms,
                    }
                }}
                depthPacking={THREE.RGBADepthPacking}
            />
            <boxGeometry args={[size, 4, size]} />
            {positions.map((pos, i) => (
                <Instance key={i} position={pos} />
            ))}
        </Instances>
    )
}
