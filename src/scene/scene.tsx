import React, { useEffect, useLayoutEffect } from "react"
import InstancedMouseEffect from "./demo"
import { useControls } from "leva"

export const Scene = () => {
  const {color, metalness, roughness, grid, size, camera, lookAt, zoom} = useControls({
    grid: {
      value: 55,
      min: 1,
      max: 400,
      step: 1
    },
    size: {
      value: 1.5,
      min: 0.1,
      max: 5,
      step: 0.1
    },
    metalness: {
      value: 0.2,
      min: 0,
      max: 1,
      step: 0.05
    },
    roughness: {
      value: 0.2,
      min: 0,
      max: 1,
      step: 0.05
    },
    color: '#2f2f2f',
    camera: {
      value: {
        x: 40,
        y: 40,
        z: 40
      },
      min: -70,
      max: 70,
      step: 2
    },
    lookAt: {
      value: {
        x: 0,
        y: 0,
        z: 0
      },
      min: -10,
      max: 10,
      step: 0.5
    },
    zoom: {
      value: 1,
      min: 0.1,
      max: 5,
      step: 0.1
    }
  })



  const ref = React.useRef<HTMLDivElement>(null!)


  useLayoutEffect(() => {
    const wrapper = ref.current
    if (!wrapper) return
    else {
      if (window.InstancedMouseEffect) {
        window.InstancedMouseEffect.destroy()
        window.InstancedMouseEffect = null
      }
      wrapper.innerHTML = ""
      const canvas = document.createElement("canvas")
      canvas.id = "canvas"
      wrapper.appendChild(canvas)
      window.InstancedMouseEffect = new InstancedMouseEffect(canvas, {
        meshArgs: {
          color,
          metalness,
          roughness
        },
        grid,
        size
      })

    }

  }, [color, metalness, roughness, grid, size])

  useEffect(() => {
    if (window.InstancedMouseEffect) {
      console.log("set camera", camera)
      window.InstancedMouseEffect.moveCamera({...camera, v: lookAt, zoom})
    }
  }, [camera, lookAt, zoom])

  return <div className="canvas-wrapper" ref={ref}><canvas  id='canvas' /></div>
}