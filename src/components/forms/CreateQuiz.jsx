import React, { useState } from 'react'
import { Button, Input, Radio, Select, Form, Tag, message } from 'antd';
import { difficultyOptions, subjectOptions } from '../../lib/constants';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../auth/AuthContext';

const CreateQuiz = () => {
  const [quizForm] = Form.useForm();
  const [qaForm] = Form.useForm();
  const [questions, setQuestions] = useState([]);
  const [correctAnswerText, setCorrectAnswerText] = useState('');

  const { currentUser } = useAuth();

  const onFinish = (values) => {
    values.correctAnswerText = correctAnswerText;
    setQuestions((prevQuestions) => [...prevQuestions, values]);
    qaForm.resetFields(); // Reset only the questions and answers form
  };

  const onFinishAll = async (values) => {
    console.log('Quiz details:', quizForm.getFieldsValue());
    console.log('All questions:', questions);
    const optionsString = values.options || '';
    const optionsArray = optionsString.split(',').map(option => option.trim());
    const quizData = {
      ...values,
      options: optionsArray,
      creator: currentUser.displayName,
      creatorId: currentUser.uid,
      quiz: true,
    };
    try {
      const quizRef = await addDoc(collection(db, 'sets'), quizData);
      console.log('Quiz document created with ID:', quizRef.id);
      await Promise.all(questions.map((question, index) =>
        addDoc(collection(db, 'sets', quizRef.id, 'questions'), {
          ...question,
          correctAnswer: question.correctAnswerText,
          order: index + 1, // Add an order field to maintain the question order
        })
      ));
      message.success('Quiz created successfully!');
      quizForm.resetFields();
      qaForm.resetFields();
      setQuestions([]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='w-full flex flex-col gap-4'>
      <h2 className='text-2xl font-bold'>Start Creating a Quiz!</h2>
      <Form
        form={qaForm}
        name="qaForm"
        onFinish={onFinish}
        layout="vertical"
        className='w-4/5 border-2 p-2 rounded-xl'
      >
        <div className='flex justify-end mb-4'>
          <Tag color="#108ee9">Question {questions.length + 1}</Tag>
        </div>
        <Form.Item
          label="Question"
          name="question"
          rules={[{ required: true, message: 'Please enter question title!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Answer Options"
          name="options"
          rules={[{ required: true, message: 'Please enter answer options!' }]}
        >
          <Input.TextArea placeholder="Enter answer options, separated by a comma" />
        </Form.Item>
        <Form.Item
          label="Correct Answer"
          name="correctAnswer"
          rules={[{ required: true, message: 'Please choose the correct answer!' }]}
        >
          <Radio.Group onChange={(e) => setCorrectAnswerText(e.target.value)}>
          {Array.from({ length: 4 }, (_, index) => (
            <Radio key={index + 1} value={`Option ${index + 1}`}>
              Option {index + 1}
            </Radio>
          ))}
          </Radio.Group>
        </Form.Item>
        <Form.Item className='float-right'>
          <Button type="primary" htmlType="submit" className='bg-blue-500'>
            Next Question ({questions.length + 2})
          </Button>
        </Form.Item>
      </Form>
      <Form
        form={quizForm}
        name="quizForm"
        onFinish={onFinishAll}
        layout="vertical"
        className='w-4/5'
      >
        <Form.Item
          label="Quiz title"
          name="name"
          rules={[{ required: true, message: 'Please enter the title of the quiz!' }]}
        >
          <Input placeholder='Please enter the title of the quiz!' />
        </Form.Item>
        <div className='flex gap-2 w-full'>
          <Form.Item
            className='w-full'
            label="Subject"
            name="subject"
          >
            <Select options={subjectOptions} />
          </Form.Item>
          <Form.Item
            className='w-full'
            label="Difficulty"
            name="difficulty"
          >
            <Select options={difficultyOptions} />
          </Form.Item>
        </div>
        <div className='flex justify-between items-end'>
          <Form.Item
            label="Pick a theme"
            name="colorGroup"
          >
            <Radio.Group className='flex gap-2'>
              <Radio.Button value='blue' className='blue-quiz'></Radio.Button>
              <Radio.Button value='orange' className='orange-quiz'></Radio.Button>
              <Radio.Button value='green' className='green-quiz'></Radio.Button>
              <Radio.Button value='purple' className='purple-quiz'></Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className='bg-blue-500'>
              Save Quiz
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  )
}

export default CreateQuiz