import { Avatar } from '@chakra-ui/react'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import userAtom from '../atoms/userAtom';
import { useRecoilValue } from 'recoil';
import { useSelector } from 'react-redux';
import useUserApi from '../api/userAPI';



function SearchedProfile({ user }) {
    const { handleFollow } = useUserApi();
    const currentUser = useRecoilValue(userAtom)
    const mode = useSelector((state) => state.mode.mode);
    const [following, setFollowing] = useState(user?.followers?.includes(currentUser?.username))

    return (
        <>
            <div key={user._id} className={` my-[1rem] border-2 flex justify-between w-[27rem] h-[5rem] rounded-[1.4rem]
                            ${mode ? 'border-[white]' : 'bg-white border-[#c6c6c6]'}`}>

                <Link to={`/${user?.username}`}>
                    <div className={`flex`}>
                        <Avatar
                            name={user?.username}
                            className={`m-4`}
                            src={user?.avatar || "./nullAvatar.jpg"}
                            size={{
                                base: 'sm',
                                md: 'md',
                            }}
                        />
                        <div className={`mt-3`}>
                            <span className={`inline`}>{user?.username}</span>
                            <img src='./space.png' alt='space ininity stone' className={`ml-[.5rem] inline w-[1rem] h-[1rem]`} />
                            <span className={`block  ${mode ? 'text-[#999999]' : 'text-[#7e7e7e]'}`}>{user?.fullName}</span>
                        </div>
                    </div>
                </Link>
                <div className={`grid place-items-center`}>
                    {currentUser?._id !== user?._id && (
                        <button
                            className={`mr-8 text-[1.2rem] border-2 w-[6rem] h-[2.5rem] rounded-[2rem]
                                ${mode ? 'border-[white]' : 'border-[#c6c6c6]'}`}
                            onClick={() => handleFollow(currentUser, user, setFollowing, following)}
                        >
                            {following ? "Unfollow" : "Follow"}
                        </button>
                    )}
                </div>

            </div>
        </>
    )
}

export default SearchedProfile
