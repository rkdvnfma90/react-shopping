import React, { useState } from 'react'
import { Typography, Button, Form, Input } from 'antd'
import FileUpload from '../../utils/FileUpload'

const { TextArea } = Input

const Books = [
  { key: 1, value: '건강/취미' },
  { key: 2, value: '경제/경영' },
  { key: 3, value: '여행' },
  { key: 4, value: '역사' },
  { key: 5, value: 'IT' },
  { key: 6, value: '자연' },
  { key: 7, value: '인문' },
]

function UploadProductPage() {
  const [Title, setTitle] = useState('')
  const [Description, setDescription] = useState('')
  const [Price, setPrice] = useState(0)
  const [Book, setBook] = useState(1)
  const [Images, setImages] = useState([])

  const titleChangeHandler = (event) => {
    setTitle(event.currentTarget.value)
  }

  const descriptionChangeHandler = (event) => {
    setDescription(event.currentTarget.value)
  }

  const priceChangeHandler = (event) => {
    setPrice(event.currentTarget.value)
  }

  const bookChangeHandler = (event) => {
    setBook(event.currentTarget.value)
  }

  const updateImages = (newImages) => {
    setImages(newImages)
  }

  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2>상품 업로드</h2>
      </div>

      <FileUpload refreshFunction={updateImages} />

      <Form>
        <br />
        <br />
        <label>이름</label>
        <Input onChange={titleChangeHandler} value={Title} />
        <br />
        <br />
        <label>설명</label>
        <TextArea onChange={descriptionChangeHandler} />
        <br />
        <br />
        <label>가격($)</label>
        <Input type="number" onChange={priceChangeHandler} />
        <br />
        <br />
        <select onChange={bookChangeHandler} value={Book}>
          {Books.map((book) => (
            <option key={book.key} value={book.key}>
              {book.value}
            </option>
          ))}
        </select>
        <br />
        <br />
        <Button>확인</Button>
      </Form>
    </div>
  )
}

export default UploadProductPage
