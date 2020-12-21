import React, { useState } from 'react'
import { Collapse, Radio } from 'antd'

const { Panel } = Collapse

function RadioBox({ list, handleFilters }) {
  // Value는 라디오박스 선택 값인데 초기값은 아이디가 1부터 시작하므로 1로 줌.
  const [Value, setValue] = useState(1)

  const renderRadioBoxLists = () =>
    list &&
    list.map((value) => (
      <Radio key={value._id} value={value._id}>
        {value.name}
      </Radio>
    ))

  const handleChange = (event) => {
    setValue(event.target.value)
    handleFilters(event.target.value) // 부모 컴포넌트에 값 전달
  }

  return (
    <div>
      <Collapse defaultActiveKey={['1']}>
        <Panel header="Price" key="1">
          {/* Radio.Group의 value와 Radio 의 value 가 일치해야 선택 됨 */}
          <Radio.Group onChange={handleChange} value={Value}>
            {renderRadioBoxLists()}
          </Radio.Group>
        </Panel>
      </Collapse>
    </div>
  )
}

export default RadioBox
