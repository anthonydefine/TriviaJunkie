import React from 'react'
import { Button, Rate } from 'antd'
import { Link } from 'react-router-dom'
import { colorCard } from '../lib/constants'

const SetCard = ({ item }) => {
  console.log(item.colorGroup)
  return (
    <div className={`p-4 flex flex-col justify-between ${colorCard(item.colorGroup)} rounded-2xl h-80 w-96`}>
      <h3 className='text-xl font-bold'>
        {item.name}
      </h3>
      <p>{item.quiz ? 'Quiz' : 'Flashcards'}</p>
      <div className='flex flex-col gap-4'>
        <Link className='text-right' to={`/sets/${item.quiz ? 'quiz' : 'flashcard'}/${item?.id}`} >
          <Button>Start</Button>
        </Link>
        <span className='flex justify-between'>
          <p className='capitalize'>{item.difficulty}</p>
          {item.rating && (
            <span>
              <Rate disabled value={item.rating} /> 
              ({item.totalRatings})
            </span>
          )}
        </span>
      </div>
    </div>
  )
}

export default SetCard