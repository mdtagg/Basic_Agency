import "./index.css"
import { useState,useRef } from "react"
import { getCompanyData } from "./utils/companies"
import Cursor from "./Cursor"

const Carousel = () => {

    const Companies = getCompanyData()
    const [ isMouseDown, setIsMouseDown ] = useState(false)
    const [ isHover,setIsHover ] = useState(false)
    const scrollBar = useRef<HTMLUListElement | null>(null)
    const cursorContainer = useRef<HTMLDivElement | null>(null)
    const cursorOuter = useRef<HTMLDivElement | null>(null)
    const carouselContainer = useRef<HTMLDivElement | null>(null)
    const carouselStage = useRef<HTMLUListElement | null>(null)


    function handleScroll(e:React.UIEvent<HTMLUListElement, UIEvent>) {
        const target = e.target as HTMLUListElement
        const maxScroll = target.scrollWidth - target.clientWidth // Amount of overflow scroll
        const scrollPosition = ((maxScroll - target.scrollLeft) / maxScroll) * 100 //the percentage from 100 of scroll space left
        const adjusted = (100 - scrollPosition) * .4 // The percentage of scroll to adjust right including scrollBar width
        scrollBar.current!.style.left = `${adjusted}%`
        
    }

    function handleMouseOut(e:React.MouseEvent<HTMLDivElement, MouseEvent>) {
        const target = e.target as HTMLElement
        const cursorStyle = cursorOuter.current!.style
        cursorStyle.transform = `translate(0)`
        cursorStyle.transition = `transform 0.5s`
        cursorStyle.opacity = "1"
        if(target.id === 'carousel-stage' || target.id === 'carousel-container') {
            cursorStyle.position = "static"
        }
    }

    function handleMouseMove(e:React.MouseEvent<HTMLDivElement, MouseEvent>) {       
        let { clientX,clientY } = e
        const cursorOffset = cursorOuter.current!.offsetTop
        clientX -= window.innerWidth - 160 //adjusting the horizontal position by half the cursor width
        clientY -= cursorOffset + 80 // calculates the next position of the cursor height adjusted for half the cursor width

        if(isMouseDown) {
            let currentPosition = carouselStage.current!.scrollLeft
            let movement = e.movementX
            carouselStage.current!.scrollLeft = currentPosition - movement
        }
        cursorOuter.current!.style.position = "fixed"
        cursorOuter.current!.style.transform = `translate(${clientX}px,${clientY}px)`
        cursorOuter.current!.style.transition = isMouseDown ? "unset": "transform 0.1s"
    }

    return (
        <div 
            // className="carousel-container" 
            id="carousel-container"
            onMouseOut={(e) => handleMouseOut(e)} 
            onMouseMove={(e) => handleMouseMove(e)}
            onMouseDown={() => setIsMouseDown(true)}
            onMouseUp={() => setIsMouseDown(false)}
            ref={carouselContainer}
        >
            <ul 
                // className="carousel-stage" 
                id="carousel-stage"
                onScroll={(e) => handleScroll(e)}
                ref={carouselStage}
                draggable={false}
            >
            {Companies.map(company => {

                return (
                    <div className="carousel-panel">
                        <p className="company-logo">{company.title}</p>
                        <p>_</p>
                        <div className="company-information">
                            <p>{company.title}</p>
                            <p 
                                className="carousel-content"
                            >
                                {company.content}
                                {company.anchor && 
                                    <a 
                                        className="company-anchor" 
                                        href={company.anchor}
                                        onMouseEnter={() => {
                                            cursorOuter.current!.style.opacity = ".7"
                                            cursorOuter.current!.style.position = "fixed"
                                            setIsHover(true)
                                        }}
                                        onMouseLeave={() => {
                                            setIsHover(false)
                                            // cursorOuter.current!.style.position = "fixed"

                                        }}
                                    >
                                        here
                                    </a>
                                }
                            </p>
                        </div>
                    </div>
                )
            })}
            </ul>
            <div className="progress-bar-container">
                <span 
                    ref={scrollBar} 
                    className="progress-bar-thumb" 
                ></span>
            </div>
            <Cursor
                cursorContainer={cursorContainer}
                cursorOuter={cursorOuter}
                isMouseDown={isMouseDown}
                isHover={isHover}
            />
        </div>
    )
}

export default Carousel