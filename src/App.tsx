import { Suspense } from 'react'
import './App.css'
import { Scene } from './scene/scene'


function App() {

    return (
        <>
            <div className='scene'>
                <Suspense fallback={null}>
                    <Scene />
                </Suspense>
            </div>
        </>
    )
}

export default App
