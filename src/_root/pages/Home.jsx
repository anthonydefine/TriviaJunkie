import React, { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import SetCard from '../../components/SetCard';

const Home = () => {
  const [basicSets, setBasicSets] = useState([]);
  const [intermediateSets, setIntermediateSets] = useState([]);
  const [expertSets, setExpertSets] = useState([]);
  const [userSets, setUserSets] = useState([]);

useEffect(() => {
  const triviaCollection = collection(db, 'sets');
  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(triviaCollection);
      const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      // Separate sets based on difficulty
      const basicSetsData = data.filter(set => set.difficulty === 'basic');
      const intermediateSetsData = data.filter(set => set.difficulty === 'intermediate');
      const expertSetsData = data.filter(set => set.difficulty === 'expert');
      const userSetsData = data.filter(set => set.creatorId !== 'V7ZIU9vOmwOBaSWLuAHmSyMjr0C3');
      // Update state with filtered sets
      setBasicSets(basicSetsData);
      setIntermediateSets(intermediateSetsData);
      setExpertSets(expertSetsData);
      setUserSets(userSetsData);
    } catch (error) {
      console.error('Error fetching trivia data:', error);
    }
  };
  fetchData();
  return () => {};
}, []);


  return (
    <div className='flex flex-1'>
      <div className='flex flex-col flex-1 items-center gap-10 py-10 px-5 md:px-8 lg:p-14 base-home'>
        <div>
          <h2 className='place-self-start'>Basic Trivia</h2>
          <ul>
            {basicSets.map((item) => {
              return (
                <li key={item.id}>
                  <SetCard item={item} />
                </li>
              )
            })}
          </ul>
        </div>
        <div>
          <h2 className='place-self-start'>Basic Trivia</h2>
          <ul>
            {intermediateSets.map((item) => {
              return (
                <li key={item.id}>
                  <SetCard item={item} />
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Home