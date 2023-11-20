import React, { useEffect, useState } from 'react'
import { Rate } from 'antd'
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useParams } from 'react-router-dom';

const UserDashSets = () => {
  const [userSets, setUserSets] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    const fetchUserQuizzes = async () => {
      try {
        const q = query(collection(db, 'sets'), where('creatorId', '==', id));
        const querySnapshot = await getDocs(q);
        const fetchedQuizzes = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUserSets(fetchedQuizzes);
      } catch (error) {
        console.error('Error fetching user quizzes:', error);
      }
    };

    fetchUserQuizzes();
  }, [id])

  console.log(userSets)

  return (
    <div>
      <table className="table w-full">
        <thead>
          <tr>
            <th>Title</th>
            <th>Type</th>
            <th>Subject</th>
            <th>Difficulty</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {userSets?.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.quiz ? 'Quiz' : 'Flashcards'}</td>
              <td>{item.subject}</td>
              <td>{item.difficulty}</td>
              <td><Rate disabled value={item.rating} /> ( {item.totalRatings} )</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UserDashSets