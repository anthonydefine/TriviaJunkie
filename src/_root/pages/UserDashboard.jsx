import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getUser } from '../../lib/constants';
import { Avatar } from 'antd';
import UserDashSets from '../../components/UserDashSets';
import Badge from '../../components/Badge';

const UserDashboard = () => {
  const [userData, setUserData] = useState(null)
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const user = await getUser(id);
      setUserData(user);
    };
    fetchData();
  }, [id]);

  return (
    <div className='flex flex-1'>
      <div className='flex flex-col flex-1 items-center gap-10 py-10 px-5 md:px-8 lg:p-14 base-home'>
        <div className='flex justify-between items-center w-full'>
          <span>
            <h2 className='text-4xl font-bold'>{userData?.displayName}&apos;s Profile</h2>
            <p className='text-slate-400 font-bold'>Check out {userData?.displayName}&apos;s stats and sets they've created!</p>
          </span>
          <Avatar size='large' />
        </div>
        <div className='flex gap-4 w-full'>
          <div className='h-80 w-full bg-blue-200 flex flex-col justify-center items-center rounded-xl'>
            <p>Badges</p>
            <Badge />
          </div>
          <div className='h-80 w-full bg-blue-200 rounded-xl'>
            <p>Highest scores</p>
          </div>
        </div>
        <div className='w-full'>
          <h3>Explore <strong>{userData?.displayName}'s</strong> Sets</h3>
          <UserDashSets />
        </div>
      </div>
    </div>
  )
}

export default UserDashboard