import React from 'react';
import AliceCarousel from 'react-alice-carousel';
import "react-alice-carousel/lib/alice-carousel.css";
import image1 from '../../assets/images/1.png';
import image2 from '../../assets/images/2.png';
import image3 from '../../assets/images/3.png';
import image4 from '../../assets/images/4.png';

const Slideshow = () => {
    return (
        <div>
            <AliceCarousel autoPlay autoPlayInterval="5000">
                <img src={image1} alt="1" width={450} height={350} />
                <img src={image2} alt="2" width={450} height={350} />
                <img src={image3} alt="3" width={450} height={350} />
                <img src={image4} alt="4" width={450} height={350} />
            </AliceCarousel>
        </div>
    )
};

export default Slideshow;