import { useEffect, useState } from 'react';
import classes from './UserCard.module.css';

const UserCard = (props) => {
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [bio, setBio] = useState('');
  const [starredCount, setStarredCount] = useState(0);
  useEffect(() => {
    const fetchUserData = async () => {
      let response = await fetch(`https://api.github.com/users/${props.userName}`);

      if (!response.ok) {
        return;
      }
      const userData = await response.json();
      console.log(userData);
      setFollowerCount(userData.followers);
      setFollowingCount(userData.following);
      setBio(userData.bio);
    };

    const fetchStarredData = async () => {
      let response = await fetch(`https://api.github.com/users/${props.userName}/starred?per_page=100`);

      if (!response.ok) {
        return;
      }
      const starredData = await response.json();
      console.log(starredData);
      setStarredCount(starredData.length);
    };

    fetchUserData();
    fetchStarredData();
  }, [props.userName]);

  return (
    <div className={classes.UserCard}>
      <div className={classes.UserCardContents}>
        <div className={classes.UserHeading}>
          <div>
            <a href={props.htmlURL} target="_blank" rel="noopener noreferrer">
              {props.userName}
            </a>
          </div>
          <a href={props.htmlURL} className={classes.UserCardImg} target="_blank" rel="noopener noreferrer">
            <img src={props.avatarURL} alt={`Avatar`} />
          </a>
        </div>
        <div>Description: {bio}</div>
        <div>Star Count: {starredCount === 100 ? `100 or more!` : starredCount}</div>
        <div>Followers: {followerCount}</div>
        <div>Following: {followingCount}</div>
      </div>
    </div>
  );
};

export default UserCard;
