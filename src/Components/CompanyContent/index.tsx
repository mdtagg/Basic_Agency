import { getCompanyData } from '../../utils/getCompanyData'
import './index.css'
import { useRef,useEffect,useState } from "react"

interface CompanyContent {
    scrollWidth:number
    setScrollWidth:React.Dispatch<React.SetStateAction<number>>
    setScrollPosition:React.Dispatch<React.SetStateAction<number>>
}

const CompanyContent = (props:CompanyContent) => {

    const companyData = getCompanyData()
    const { setScrollPosition, setScrollWidth, scrollWidth } = props
    const [ mouseDown,setMouseDown ] = useState(false)
    const listRef = useRef<HTMLUListElement | null>(null)

    function handleScroll(e:React.UIEvent<HTMLElement, UIEvent>) {
        const target = e.target as HTMLUListElement
        const maxScroll = target.scrollWidth - target.clientWidth // Amount of overflow scroll
        const scrollPosition = ((maxScroll - target.scrollLeft) / maxScroll) * 100 //the percentage from 100 of scroll 
        const adjusted = (100 - scrollPosition) * ((100 - scrollWidth) * 0.01) // The percentage of scroll to adjust right including scrollBar width
        setScrollPosition(adjusted)
    }

    function handleMouseMove(e:React.MouseEvent<HTMLUListElement, MouseEvent>) {
        if(!mouseDown) return;
        listRef.current!.scrollLeft -= e.movementX  //scrolls the carousel position horizonally with the mouse position
        
    }

    useEffect(() => {
        setScrollWidth((window.innerWidth / listRef.current!.scrollWidth) * 100)
    },[])
  
    return (
        <>
        <ul 
            onScroll={(e) => handleScroll(e)}
            onMouseMove={(e) => handleMouseMove(e)}
            onMouseDown={() => setMouseDown(true)}
            onMouseUp={() => setMouseDown(false)}
            draggable={false}
            className="company-list"
            ref={listRef}
        >
        {companyData.map(company => {
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
    </>
    )
}

export { CompanyContent }