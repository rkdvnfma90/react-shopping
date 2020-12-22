import React, { useState } from 'react'
import { Collapse, Checkbox } from 'antd'

const { Panel } = Collapse

function CheckBox({ list, handleFilters }) {
  // 체크된 항목들
  const [Checked, setChecked] = useState([])
  const handleToggle = (value) => {
    // 현재 누른 체크박스의 index
    const currentIndex = Checked.indexOf(value)
    const newChecked = [...Checked]

    // 현재 누른 체크박스가 기존 체크된 항목에 없으면 넣어주고
    if (currentIndex === -1) {
      newChecked.push(value)
    } else {
      // 있으면 빼준다.
      newChecked.splice(currentIndex, 1)
    }

    setChecked(newChecked)
    handleFilters(newChecked) // 부모 컴포넌트에 값 전달
  }

  const renderCheckBoxLists = () =>
    list &&
    list.map((value, index) => (
      <React.Fragment key={index}>
        <Checkbox
          onChange={() => handleToggle(value._id)}
          checked={Checked.indexOf(value._id) === -1 ? false : true}
        >
          <span>{value.name}</span>
        </Checkbox>
      </React.Fragment>
    ))

  return (
    <div>
      <Collapse defaultActiveKey={['0']}>
        <Panel header="Category" key="1">
          {renderCheckBoxLists()}
        </Panel>
      </Collapse>
    </div>
  )
}

export default CheckBox
