import React, { useState } from 'react'
import Dropzone from 'react-dropzone'
import { FileAddOutlined } from '@ant-design/icons'
import axios from 'axios'

// 그냥 props를 사용해도 됨
// refreshFunction 는 자식 컴포넌트에서 부모 컴포넌트로 state를 전달하기 위한 함수
function FileUpload({ refreshFunction }) {
  const [Images, setImages] = useState([])
  const dropHandler = (files) => {
    const formData = new FormData()
    const config = {
      header: { 'content-type': 'multipart/form-data' },
    }

    formData.append('file', files[0])

    axios.post('/api/product/image', formData, config).then((response) => {
      if (response.data.success) {
        setImages([...Images, response.data.filePath])
        refreshFunction([...Images, response.data.filePath])
      } else {
        alert('파일을 저장하는데 실패했습니다.')
      }
    })
  }

  const deleteHandler = (image) => {
    const currentIndex = Images.indexOf(image)
    let newImage = [...Images]
    newImage.splice(currentIndex, 1)
    setImages(newImage)
    refreshFunction(newImage)
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <Dropzone onDrop={dropHandler}>
        {({ getRootProps, getInputProps }) => (
          <section>
            <div
              style={{
                width: '300px',
                height: '240px',
                border: '1px solid lightgray',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              {...getRootProps()}
            >
              <input {...getInputProps()} />

              <FileAddOutlined style={{ fontSize: '3rem' }} />
            </div>
          </section>
        )}
      </Dropzone>

      <div
        style={{
          display: 'flex',
          width: '350px',
          height: '240px',
          overflowX: 'auto',
        }}
      >
        {Images.map((image, index) => (
          <div key={index} onClick={() => deleteHandler(image)}>
            <img
              style={{ minWidth: '300px', width: '300px', height: '240px' }}
              src={`http://localhost:5000/${image}`}
            ></img>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FileUpload
