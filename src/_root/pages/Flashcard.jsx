import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { db } from '../../lib/firebase';
import { doc, getDoc, collection, getDocs, setDoc, addDoc, updateDoc } from 'firebase/firestore';
import { Button, Rate, message } from 'antd';
import { colorQuiz } from '../../lib/constants';

const Flashcard = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [flashData, setFlashData] = useState(null);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [finish, setFinish] = useState(false);
  const [rating, setRating] = useState(null);

  const handleRateChange = (value) => {
    setRating(value);
  };

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const docRef = doc(db, 'sets', id);
        const docSnap = await getDoc(docRef);
  
        if (docSnap.exists()) {
          setFlashData(docSnap.data());
          const subcollectionRef = collection(docRef, 'cards');
          const subcollectionSnapshot = await getDocs(subcollectionRef);
          const subcollectionData = subcollectionSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setCards(subcollectionData);
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error getting document:', error);
      }
    };
    fetchQuizData();
  }, [id]);

  const handleNextCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % cards.length);
    setFlipped(false); // Reset flipped state when moving to the next card
  };

  const currentCard = cards[currentCardIndex];

  const handleReturn = async () => {
    const flashDocRef = doc(db, 'sets', id);
    const flashDocSnapshot = await getDoc(flashDocRef);
    if (flashDocSnapshot.exists()) {
      const currentRating = flashDocSnapshot.data().rating || 0;
      const totalRatings = flashDocSnapshot.data().totalRatings || 0;
      // Calculate the new rating
      const newRating = (currentRating * totalRatings + (rating || 0)) / (totalRatings + 1);
      // Update the quiz document
      await updateDoc(flashDocRef, {
        rating: newRating,
        totalRatings: totalRatings + 1,
      });
      message.success('Flashcard rating updated successfully!');
    } else {
      console.log('Flashcard document not found.');
    }
    navigate('/');
  }

  return (
    <div className='flex flex-1'>
      <div className={`flex-1 items-center gap-10 py-10 px-5 md:px-8 lg:p-14 h-full ${colorQuiz(flashData?.colorGroup)}`}>
        {currentCard ? (
          <>
            {!finish ? (
              <div className='flex flex-col gap-8 items-center p-6 w-full h-full'>
                <h4 className='text-4xl font-bold'>{flashData.name}</h4>
                <div className={`w-4/5 h-96 flashcard ${flipped ? 'flipped' : ''}`}>
                  {flipped ? (
                    <p className='text-4xl font-bold text-center back'>{currentCard.hidden}</p>
                  ) : (
                    <p className='text-4xl font-bold front'>{currentCard.presenting}</p>
                  )}
                  
                </div>
                <div className='flex gap-6'>
                  <Button size='large' className='' onClick={() => setFlipped(!flipped)}>Flip Card</Button>
                  {currentCardIndex < cards.length - 1 ? (
                    <Button onClick={handleNextCard} size='large'>Next Card</Button>
                  ) : (
                    <Button onClick={() => setFinish(true)} size='large'>Finish</Button>
                  )}
                </div>
              </div>
            ) : (
              <div className='flex flex-col gap-8 justify-center items-center h-full'>
                <p className='text-2xl font-bold'>Great Job!</p>
                <p className='text-xl'>Please rate the Flashcard set before leaving!</p>
                <Rate allowHalf defaultValue={4.5} onChange={handleRateChange} />
                <Button onClick={handleReturn}>Done</Button>
              </div>
            )}
            <p>Created by: <Link to={`/users/${flashData.creatorId}`}>{flashData.creator}</Link></p>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>   
  )
}

export default Flashcard