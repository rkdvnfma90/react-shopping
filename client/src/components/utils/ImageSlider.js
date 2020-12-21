import React from 'react'
import { Col, Card, Row, Carousel } from 'antd'

function ImageSlider({ images }) {
  return (
    <div>
      <Carousel autoplay>
        {images.map((image, index) => (
          <div key={index}>
            <img
              style={{ width: '100%', maxHeight: '150px' }}
              src={`http://localhost:5000/${image}`}
            />
          </div>
        ))}
      </Carousel>
    </div>
  )
}

export default ImageSlider
