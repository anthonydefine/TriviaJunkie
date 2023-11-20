import React, { useState } from 'react'
import { Button, Input, Radio, Select, Form, Tag, message } from 'antd';
import { difficultyOptions, subjectOptions } from '../../lib/constants';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

const CreateFlash = () => {
  const [flashcardForm] = Form.useForm();
  const [flashform] = Form.useForm();
  const [cards, setCards] = useState([]);

  const navigate = useNavigate();

  const { currentUser } = useAuth();

  const flashFinish = (values) => {
    setCards((prevQuestions) => [...prevQuestions, values]);
    flashform.resetFields(); // Reset only the questions and answers form
  };

  const onFinishAll = async (values) => {
    console.log('Quiz details:', flashcardForm.getFieldsValue());
    console.log('All questions:', cards);
    const flashData = {
      ...values,
      creator: currentUser.displayName,
      creatorId: currentUser.uid,
      quiz: false,
    };
    try {
      const flashRef = await addDoc(collection(db, 'sets'), flashData);
      console.log('flash document created with ID:', flashRef.id);
      await Promise.all(cards.map((card, index) =>
        addDoc(collection(db, 'sets', flashRef.id, 'cards'), {
          ...card,
          order: index + 1,
        })
      ));
      message.success('Quiz created successfully!');
      flashcardForm.resetFields();
      flashform.resetFields();
      setCards([]);
      navigate(`/users/${currentUser?.id}`)
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='w-full flex flex-col gap-4'>
      <h2 className='text-2xl font-bold'>Start Creating Flashcards!</h2>
      <Form
        form={flashform}
        name="flashform"
        onFinish={flashFinish}
        layout="vertical"
        className='w-4/5 border-2 p-2 rounded-xl'
      >
        <div className='flex justify-end mb-4'>
          <Tag color="#108ee9">Card {cards.length + 1}</Tag>
        </div>
        <Form.Item
          label="Presenting Side"
          name="presenting"
          rules={[{ required: true, message: 'Please enter presenting side information!' }]}
        >
          <Input.TextArea placeholder="This is the first side of the card" />
        </Form.Item>
        <Form.Item
          label="Hidden Side"
          name="hidden"
          rules={[{ required: true, message: 'Please enter hidden side information!' }]}
        >
          <Input.TextArea placeholder="This is the second side of the card" />
        </Form.Item>
        <Form.Item className='float-right'>
          <Button type="primary" htmlType="submit" className='bg-blue-500'>
            Next Card ({cards.length + 2})
          </Button>
        </Form.Item>
      </Form>
      <Form
        form={flashcardForm}
        name="flashcardForm"
        onFinish={onFinishAll}
        layout="vertical"
        className='w-4/5'
      >
        <Form.Item
          label="Flashcards title"
          name="name"
          rules={[{ required: true, message: 'Please enter the title of the flashcard set!' }]}
        >
          <Input placeholder='Please enter the title of the flashcard set!' />
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
              Save Flashcards
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  )
}

export default CreateFlash