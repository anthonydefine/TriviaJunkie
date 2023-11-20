import React, { useState, useEffect } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { db } from '../../lib/firebase';
import { doc, getDoc, collection, getDocs, setDoc, addDoc, updateDoc } from 'firebase/firestore';
import { Button, Radio, Progress, Rate, message } from 'antd';
import { colorQuiz } from '../../lib/constants';
import { useAuth } from '../../auth/AuthContext';

const Quiz = () => {

  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const { id } = useParams();

  const [quizData, setQuizData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [rating, setRating] = useState(null);
  const [rerender, setRerender] = useState(false);

  const handleRateChange = (value) => {
    setRating(value);
  };

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const docRef = doc(db, 'sets', id);
        const docSnap = await getDoc(docRef);
  
        if (docSnap.exists()) {
          setQuizData(docSnap.data());
          const subcollectionRef = collection(docRef, 'questions');
          const subcollectionSnapshot = await getDocs(subcollectionRef);
          const subcollectionData = subcollectionSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setQuestions(subcollectionData);
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error getting document:', error);
      }
    };
  
    fetchQuizData();
  }, [id]);
  

  const handleAnswerSubmit = (answer) => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = answer === currentQuestion.correctAnswer;
    setUserAnswers((prevAnswers) => [
      ...prevAnswers,
      { questionId: currentQuestion.id, userAnswer: answer, isCorrect },
    ]);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      setShowResult(true);
    }
  };

  useEffect(() => {
    setRerender(prev => !prev);
  }, [questions]);

  const quizProgress = (userAnswers.length / questions.length) * 100;

  const calculateTotalCorrect = () => {
    return userAnswers.filter((answer) => answer.isCorrect).length;
  };

  const calculateCorrectPercentage = () => {
    const totalQuestions = questions.length; // Replace with the actual total number of questions
    const correctAnswers = userAnswers.filter(answer => answer.isCorrect).length;
    const percentage = (correctAnswers / totalQuestions) * 100;
    return Math.round(percentage);
  };

  const handleReturn = async () => {
    const quizId = id
    console.log(id)
    try {
      // Ensure the currentUser is available
      if (!currentUser) {
        throw new Error('User not authenticated.');
      }
      // Obtain the user document reference
      const userDocRef = doc(db, 'users', currentUser.uid);
      // Check if the user document exists
      const userDocSnapshot = await getDoc(userDocRef);
      if (!userDocSnapshot.exists()) {
        throw new Error('User document does not exist.');
      }
      // Check if the quizTaken subcollection exists
      const quizTakenRef = collection(userDocRef, 'quizTaken');
      const quizTakenSnapshot = await getDocs(quizTakenRef);
      // Check if the user has previously taken the quiz
      const existingQuizDoc = quizTakenSnapshot.docs.find(
        (doc) => doc.data().quizId === quizId
      );
      if (existingQuizDoc) {
        // Compare the new score with the existing one
        const existingScore = existingQuizDoc.data().score;
        if (calculateCorrectPercentage() > existingScore) {
          // Update the existing document with the new score
          await updateDoc(existingQuizDoc.ref, {
            score: calculateCorrectPercentage(),
            rated: !!rating, // Set to true if a rating is provided
          });
          message.success('Quiz completed and updated successfully!');
        } else {
          message.info('Quiz completed. Your previous score is higher.');
        }
      } else {
        // Add a new document to the quizTaken subcollection
        await addDoc(quizTakenRef, {
          quizId: quizId,
          score: calculateCorrectPercentage(),
          rated: !!rating, // Set to true if a rating is provided
        });
        message.success('Quiz completed and added to quizTaken successfully!');
      }
      // Update the quiz document with the new rating
      const quizDocRef = doc(db, 'sets', quizId);
      const quizDocSnapshot = await getDoc(quizDocRef);
      if (quizDocSnapshot.exists()) {
        const currentRating = quizDocSnapshot.data().rating || 0;
        const totalRatings = quizDocSnapshot.data().totalRatings || 0;
        // Calculate the new rating
        const newRating = (currentRating * totalRatings + (rating || 0)) / (totalRatings + 1);
        // Update the quiz document
        await updateDoc(quizDocRef, {
          rating: newRating,
          totalRatings: totalRatings + 1,
        });
        message.success('Quiz rating updated successfully!');
      } else {
        console.log('Quiz document not found.');
      }
      navigate('/');
    } catch (error) {
      console.error('Error handling return:', error.message);
    }
  };

  return (
    <div className='flex flex-1'>
      <div className={`flex-1 items-center gap-10 py-10 px-5 md:px-8 lg:p-14 ${colorQuiz(quizData?.colorGroup)}`}>
        {quizData ? (
          <>
            <div className='flex flex-col gap-4 items-center p-6'>
              <h4 className='text-4xl font-bold'>{quizData.name}</h4>
                {quizProgress === 100 ? (
                  <Progress type="circle" percent={calculateCorrectPercentage()} />
                ) : (
                  <Progress type="circle" percent={quizProgress} />
                )}
                {showResult ? (
                  <div className='w-full flex flex-col gap-4 items-center text-3xl font-bold'>
                    <h4>Quiz Result</h4>
                    <p>Total Correct: {calculateTotalCorrect()} out of {questions.length}</p>
                    <span className='text-center'>
                      <p className='text-xl'>Please rate the quiz before leaving!</p>
                      <Rate allowHalf defaultValue={4.5} onChange={handleRateChange} />
                    </span>
                    <Button className='w-1/4' onClick={handleReturn}>
                      Done
                    </Button>
                  </div>
                ) : (
                  <div>
                    <h4>Question {currentQuestionIndex + 1}</h4>
                    <p>{questions[currentQuestionIndex]?.question}</p>
                    <Radio.Group 
                      className='grid grid-cols-2 gap-4 border-none'
                      onChange={(e) => handleAnswerSubmit(e.target.value)} 
                      value={undefined}
                    >
                      {rerender && Array.isArray(questions[currentQuestionIndex]?.options) &&
                        questions[currentQuestionIndex]?.options.map((option) => (
                          <Radio.Button
                            key={option}
                            className='rounded-xl border-none'
                            value={option}
                          >
                            {option}
                          </Radio.Button>
                        ))}
                    </Radio.Group>
                  </div>
                )}
            </div>
            <p>Created by: <Link to={`/users/${quizData.creatorId}`}>{quizData.creator}</Link></p>
            
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  )
}

export default Quiz