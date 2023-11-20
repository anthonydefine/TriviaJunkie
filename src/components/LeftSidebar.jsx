import React, { useState } from 'react'
import { Avatar, Button,  } from 'antd';
import { LeftCircleFilled, LogoutOutlined, PlusOutlined } from '@ant-design/icons';
import { signOut } from 'firebase/auth';
import auth from '../lib/firebase';
import { Link, useNavigate } from 'react-router-dom';
import home from '../../public/assets/home.png';
import { useAuth } from '../auth/AuthContext';

const LeftSidebar = () => {
  const [minimize, setMinimize] = useState(false);
  const navigate = useNavigate();

  const { currentUser } = useAuth();

  const handleMinimize = () => {
    setMinimize(true);
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/sign-in')
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  return (
    <nav 
      onMouseEnter={() => setMinimize(false)} 
      className={`hidden md:flex px-6 py-10 flex-col justify-between max-w-[${minimize ? '70px' : '270px'}]`}
    >
      <div className='flex flex-col gap-6'>
        <div className='flex justify-between items-center gap-4'>
          <Link to='/' className={minimize ? 'hidden' : 'flex'}>
            Trivia Junkie
          </Link>
          <Button 
            type='text' 
            className={`text-slate-100 sidebar-arrow ${minimize ? 'rotate-180' : ''}`}
            icon={<LeftCircleFilled />} 
            onClick={handleMinimize}>
          </Button>
        </div>
        <div className={minimize ? 'hidden' : 'block'}>
          <p className='text-lg font-semibold'>Welcome:</p>
          <h4 className='text-xl font-bold'>{currentUser?.displayName}</h4>
        </div>
      </div>
      <div className='flex flex-col gap-8'>
        <Link to='/' className='flex items-center gap-4'>
          <img width={28} height={28} src={home} />
          <span className={minimize ? 'hidden' : 'flex'}>Home</span>
        </Link>
        <Link to={`/users/${currentUser?.uid}`} className='flex items-center gap-4'>
          <img width={28} height={28} src={home} />
          <span className={minimize ? 'hidden' : 'flex'}>Dashboard</span>
        </Link>
        <Link to='/create-set' className='flex items-center gap-4'>
          <img width={28} height={28} src={home} />
          <span className={minimize ? 'hidden' : 'flex'}>Create Set</span>
        </Link>
        <Link to='/create-quiz' className='flex items-center gap-4'>
          <img width={28} height={28} src={home} />
          <span className={minimize ? 'hidden' : 'flex'}>Light mode</span>
        </Link>
      </div>
      <div className={minimize ? 'hidden' : 'block h-1/2'}>
        carousel of activities
      </div>
      <div className='flex gap-4'>
        <LogoutOutlined />
        <Button onClick={handleSignOut} className={minimize ? 'hidden' : 'flex'}>Sign out</Button>
      </div>
    </nav>
  )
}

export default LeftSidebar