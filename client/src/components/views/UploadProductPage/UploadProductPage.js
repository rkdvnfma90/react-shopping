import React, { useState } from 'react'
import { Typography, Button, Form, Input } from 'antd'
import FileUpload from '../../utils/FileUpload'
import Axios from 'axios'

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

// auth hoc 컴포넌트에서 props로 user를 넣었기 때문에 아래와 같이 user 정보를 가져올 수 있다.
function UploadProductPage({ user, history }) {
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

  const submitHandler = (event) => {
    event.preventDefault()

    if (!Title || !Description || !Price || !Book || !Images) {
      return alert('모든 값을 넣어야 합니다.')
    }

    const body = {
      // 로그인 된 사람의 ID
      writer: user.userData._id,
      title: Title,
      description: Description,
      price: Price,
      images: Images,
      book: Book,
    }

    // 서버에 값들을 request 보낸다.
    Axios.post('/api/product', body).then((response) => {
      if (response.data.success) {
        alert('상품 업로드를 성공 했습니다.')
        history.push('/')
      } else {
        alert('상품 업로드를 실패 했습니다.')
      }
    })
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
        <Button type="submit" onClick={submitHandler}>
          확인
        </Button>
      </Form>
    </div>
  )
}

export default UploadProductPage
