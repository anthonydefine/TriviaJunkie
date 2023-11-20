import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import star from '../../public/assets/star.png';
import { checkUserBadges } from '../lib/constants';

const badges = [
  { name: 'Set Pioneer', color: 'bg-gradient-to-tr from-green-400 to-green-500', icon: star },
  { name: 'Set Explorer', color: 'bg-gradient-to-tr from-green-400 to-green-500', icon: star },
  { name: 'Set Master', color: 'bg-gradient-to-tr from-green-400 to-green-500', icon: star },
  { name: 'Quiz Whiz', color: 'bg-gradient-to-tr from-green-400 to-green-500', icon: star },
  { name: 'Sets Explorer', color: 'bg-gradient-to-tr from-green-400 to-green-500', icon: star },
  // Add more badges as needed
];

const Badge = () => {
  const [userBadges, setUserBadges] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    const fetchUserBadges = async () => {
      const { badgesArray } = await checkUserBadges(id);
      setUserBadges(badgesArray);
    };
    fetchUserBadges();
  }, [id]);

  return (
    <div>
      <ul>
        {Array.isArray(userBadges) &&
          userBadges.map((badgeName, index) => {
            const badge = badges.find((b) => b.name === badgeName);
            return (
              <li key={index}>
                <img
                  className={`p-2 border-2 rounded-full ${badge.color}`}
                  src={badge.icon}
                  alt={badge.name}
                />
                {badge.name}
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default Badge