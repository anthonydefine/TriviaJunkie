import React, { useState } from 'react'
import { Button, Radio } from 'antd'
import CreateQuiz from '../../components/forms/CreateQuiz';
import CreateFlash from '../../components/forms/CreateFlash';

const CreateSet = () => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value)
  }

  return (
    <div className='flex flex-1'>
      <div className='flex flex-col flex-1 items-center gap-10 py-10 px-5 md:px-8 lg:p-14 base-home'>
        {selectedOption === null ? (
          <>
            <h2>Choose the set style!</h2>
            <Radio.Group onChange={handleOptionChange}>
              <Radio.Button value='flashcard'>
                Flashcard
              </Radio.Button>
              <Radio.Button value='quiz'>
                Quiz
              </Radio.Button>
            </Radio.Group>
          </>
        ) : <Button className='self-start' onClick={() => setSelectedOption(null)}>Back</Button>}
        {selectedOption === 'flashcard' && (
          <div className='w-full'>
            <CreateFlash />
          </div>
        )}
        {selectedOption === 'quiz' && (
          <div className='w-full'>
            <CreateQuiz />
          </div>
        )}
      </div>
    </div>
  )
}

export default CreateSet